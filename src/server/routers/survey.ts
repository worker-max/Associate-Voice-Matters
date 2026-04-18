import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { db } from "@/lib/db";
import { readOrMintBallot } from "@/lib/ballot";
import { usernameForBallot } from "@/lib/username";
import {
  getSurvey,
  findQuestion,
  isKnownOption,
  isKnownContextOption,
  isKnownGridRow,
} from "@/content/surveys";
import { DISCIPLINE_KEYS } from "@/content/disciplines";
import { isKnownAgency } from "@/content/agencies";

const slugLike = /^[a-z0-9-]+$/i;
const VERTICAL = z.string().min(2).max(64).regex(slugLike);
const SLUG = z.string().min(2).max(120).regex(slugLike);
const KEY = z.string().min(1).max(64).regex(slugLike);

async function resolveAssociateId(userId?: string): Promise<string | null> {
  if (!userId) return null;
  const a = await db.associate.findUnique({
    where: { userId },
    select: { id: true },
  });
  return a?.id ?? null;
}

export const surveyRouter = router({
  /**
   * Read the ballot's profile for a vertical. Mints the ballot cookie and
   * assigns a cheerful username on first visit.
   */
  profile: publicProcedure
    .input(z.object({ vertical: VERTICAL }))
    .query(async ({ ctx, input }) => {
      if (!getSurvey(input.vertical)) throw new TRPCError({ code: "NOT_FOUND" });
      const { ballotHash } = readOrMintBallot();
      const existing = await ctx.db.ballotProfile.findUnique({
        where: {
          ballotHash_vertical: { ballotHash, vertical: input.vertical },
        },
      });
      if (existing) {
        return {
          username: existing.username,
          discipline: existing.discipline,
          agencyKey: existing.agencyKey,
          agencyWritein: existing.agencyWritein,
        };
      }
      const username = usernameForBallot(ballotHash);
      const profile = await ctx.db.ballotProfile.create({
        data: {
          ballotHash,
          vertical: input.vertical,
          username,
        },
      });
      return {
        username: profile.username,
        discipline: profile.discipline,
        agencyKey: profile.agencyKey,
        agencyWritein: profile.agencyWritein,
      };
    }),

  updateProfile: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        discipline: z.string().max(64).optional().nullable(),
        agencyKey: z.string().max(120).optional().nullable(),
        agencyWritein: z.string().max(160).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!getSurvey(input.vertical)) throw new TRPCError({ code: "NOT_FOUND" });
      if (input.discipline && !DISCIPLINE_KEYS.has(input.discipline)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown discipline" });
      }
      if (
        input.agencyKey &&
        input.agencyKey !== "other" &&
        !isKnownAgency(input.vertical, input.agencyKey)
      ) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown agency" });
      }

      const { ballotHash } = readOrMintBallot();
      const username = usernameForBallot(ballotHash);

      const profile = await ctx.db.ballotProfile.upsert({
        where: {
          ballotHash_vertical: { ballotHash, vertical: input.vertical },
        },
        create: {
          ballotHash,
          vertical: input.vertical,
          username,
          discipline: input.discipline ?? null,
          agencyKey: input.agencyKey ?? null,
          agencyWritein:
            input.agencyKey === "other" ? input.agencyWritein ?? null : null,
        },
        update: {
          discipline: input.discipline ?? null,
          agencyKey: input.agencyKey ?? null,
          agencyWritein:
            input.agencyKey === "other" ? input.agencyWritein ?? null : null,
        },
      });
      return {
        username: profile.username,
        discipline: profile.discipline,
        agencyKey: profile.agencyKey,
        agencyWritein: profile.agencyWritein,
      };
    }),

  /**
   * Aggregate view for a vertical. Returns counts for single_choice, mean
   * for numeric + grid rows, sample size everywhere, and recent free-text
   * snippets. No ballot hashes leak.
   */
  aggregate: publicProcedure
    .input(z.object({ vertical: VERTICAL }))
    .query(async ({ ctx, input }) => {
      const survey = getSurvey(input.vertical);
      if (!survey) throw new TRPCError({ code: "NOT_FOUND" });

      const choiceRows = await ctx.db.surveyResponse.groupBy({
        by: ["questionSlug", "optionKey"],
        where: {
          vertical: input.vertical,
          optionKey: { not: null },
          numericValue: null,
          gridKey: "",
        },
        _count: { _all: true },
      });

      const numericRows = await ctx.db.surveyResponse.groupBy({
        by: ["questionSlug"],
        where: {
          vertical: input.vertical,
          numericValue: { not: null },
          gridKey: "",
        },
        _count: { _all: true },
        _avg: { numericValue: true },
        _min: { numericValue: true },
        _max: { numericValue: true },
      });

      const gridRows = await ctx.db.surveyResponse.groupBy({
        by: ["questionSlug", "gridKey"],
        where: {
          vertical: input.vertical,
          gridKey: { not: "" },
          numericValue: { not: null },
        },
        _count: { _all: true },
        _avg: { numericValue: true },
      });

      const freeTextCount = await ctx.db.freeTextFeedback.groupBy({
        by: ["kind"],
        where: { vertical: input.vertical },
        _count: { _all: true },
      });

      const choiceByQ = new Map<string, Map<string, number>>();
      for (const r of choiceRows) {
        if (!r.optionKey) continue;
        if (!choiceByQ.has(r.questionSlug))
          choiceByQ.set(r.questionSlug, new Map());
        choiceByQ.get(r.questionSlug)!.set(r.optionKey, r._count._all);
      }

      const numericByQ = new Map(
        numericRows.map((r) => [
          r.questionSlug,
          {
            count: r._count._all,
            avg: r._avg.numericValue ? Number(r._avg.numericValue) : null,
            min: r._min.numericValue ? Number(r._min.numericValue) : null,
            max: r._max.numericValue ? Number(r._max.numericValue) : null,
          },
        ])
      );

      const gridByQ = new Map<string, Map<string, { count: number; avg: number | null }>>();
      for (const r of gridRows) {
        if (!r.gridKey) continue;
        if (!gridByQ.has(r.questionSlug))
          gridByQ.set(r.questionSlug, new Map());
        gridByQ.get(r.questionSlug)!.set(r.gridKey, {
          count: r._count._all,
          avg: r._avg.numericValue ? Number(r._avg.numericValue) : null,
        });
      }

      const totals: Record<string, number> = {};
      for (const f of freeTextCount) totals[f.kind] = f._count._all;

      return {
        vertical: survey.vertical,
        questions: survey.questions.map((q) => {
          if (q.kind === "single_choice") {
            const counts = choiceByQ.get(q.slug) ?? new Map<string, number>();
            const total = [...counts.values()].reduce((a, b) => a + b, 0);
            return {
              slug: q.slug,
              kind: q.kind,
              total,
              options: q.options.map((o) => ({
                key: o.key,
                count: counts.get(o.key) ?? 0,
              })),
            } as const;
          }
          if (q.kind === "numeric") {
            const n = numericByQ.get(q.slug);
            const ctxCounts = q.context
              ? choiceByQ.get(`${q.slug}__${q.context.slug}`) ?? new Map<string, number>()
              : null;
            return {
              slug: q.slug,
              kind: q.kind,
              total: n?.count ?? 0,
              avg: n?.avg ?? null,
              min: n?.min ?? null,
              max: n?.max ?? null,
              context: q.context
                ? {
                    slug: q.context.slug,
                    total: ctxCounts
                      ? [...ctxCounts.values()].reduce((a, b) => a + b, 0)
                      : 0,
                    options: q.context.options.map((o) => ({
                      key: o.key,
                      count: ctxCounts?.get(o.key) ?? 0,
                    })),
                  }
                : null,
            } as const;
          }
          if (q.kind === "grid_numeric") {
            const rowsMap = gridByQ.get(q.slug) ?? new Map();
            return {
              slug: q.slug,
              kind: q.kind,
              rows: q.rows.map((r) => {
                const stats = rowsMap.get(r.key);
                return {
                  key: r.key,
                  count: stats?.count ?? 0,
                  avg: stats?.avg ?? null,
                };
              }),
            } as const;
          }
          // free_text
          return {
            slug: q.slug,
            kind: q.kind,
            total: totals[q.feedbackKind] ?? 0,
          } as const;
        }),
      };
    }),

  myAnswers: publicProcedure
    .input(z.object({ vertical: VERTICAL }))
    .query(async ({ ctx, input }) => {
      const { ballotHash } = readOrMintBallot();
      const rows = await ctx.db.surveyResponse.findMany({
        where: { vertical: input.vertical, ballotHash },
        select: {
          questionSlug: true,
          optionKey: true,
          numericValue: true,
          gridKey: true,
        },
      });
      const choice: Record<string, string> = {};
      const numeric: Record<string, number> = {};
      const context: Record<string, string> = {};
      const grid: Record<string, Record<string, number>> = {};
      for (const r of rows) {
        if (r.gridKey !== "" && r.numericValue !== null) {
          if (!grid[r.questionSlug]) grid[r.questionSlug] = {};
          grid[r.questionSlug][r.gridKey] = Number(r.numericValue);
          continue;
        }
        if (r.numericValue !== null) {
          numeric[r.questionSlug] = Number(r.numericValue);
          continue;
        }
        if (r.optionKey) {
          // Context sub-question slugs are stored as "parent__child"
          if (r.questionSlug.includes("__")) {
            context[r.questionSlug] = r.optionKey;
          } else {
            choice[r.questionSlug] = r.optionKey;
          }
        }
      }
      return { choice, numeric, context, grid };
    }),

  submitChoice: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        questionSlug: SLUG,
        optionKey: KEY,
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isKnownOption(input.vertical, input.questionSlug, input.optionKey)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unknown question or option",
        });
      }
      const { ballotHash } = readOrMintBallot();
      const associateId = await resolveAssociateId(ctx.session?.user?.id);

      await ctx.db.surveyResponse.upsert({
        where: {
          vertical_questionSlug_gridKey_ballotHash: {
            vertical: input.vertical,
            questionSlug: input.questionSlug,
            gridKey: "",
            ballotHash,
          },
        },
        update: {
          optionKey: input.optionKey,
          numericValue: null,
          associateId,
        },
        create: {
          vertical: input.vertical,
          questionSlug: input.questionSlug,
          optionKey: input.optionKey,
          ballotHash,
          associateId,
        },
      });
      return { ok: true } as const;
    }),

  submitNumeric: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        questionSlug: SLUG,
        value: z.number().finite().min(0).max(1_000_000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const q = findQuestion(input.vertical, input.questionSlug);
      if (!q || q.kind !== "numeric") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown numeric question" });
      }
      if (q.min !== undefined && input.value < q.min) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Below minimum (${q.min})` });
      }
      if (q.max !== undefined && input.value > q.max) {
        throw new TRPCError({ code: "BAD_REQUEST", message: `Above maximum (${q.max})` });
      }
      const { ballotHash } = readOrMintBallot();
      const associateId = await resolveAssociateId(ctx.session?.user?.id);

      await ctx.db.surveyResponse.upsert({
        where: {
          vertical_questionSlug_gridKey_ballotHash: {
            vertical: input.vertical,
            questionSlug: input.questionSlug,
            gridKey: "",
            ballotHash,
          },
        },
        update: {
          numericValue: input.value,
          optionKey: null,
          associateId,
        },
        create: {
          vertical: input.vertical,
          questionSlug: input.questionSlug,
          numericValue: input.value,
          ballotHash,
          associateId,
        },
      });
      return { ok: true } as const;
    }),

  /**
   * Context choice for a numeric question (e.g. role-type paired with
   * expected-productivity). Stored with a composite slug "parent__child"
   * so it lives next to its parent without colliding with the numeric row.
   */
  submitNumericContext: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        questionSlug: SLUG,
        contextOptionKey: KEY,
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isKnownContextOption(input.vertical, input.questionSlug, input.contextOptionKey)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown context option" });
      }
      const q = findQuestion(input.vertical, input.questionSlug)!;
      if (q.kind !== "numeric" || !q.context) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
      const composedSlug = `${q.slug}__${q.context.slug}`;
      const { ballotHash } = readOrMintBallot();
      const associateId = await resolveAssociateId(ctx.session?.user?.id);

      await ctx.db.surveyResponse.upsert({
        where: {
          vertical_questionSlug_gridKey_ballotHash: {
            vertical: input.vertical,
            questionSlug: composedSlug,
            gridKey: "",
            ballotHash,
          },
        },
        update: {
          optionKey: input.contextOptionKey,
          numericValue: null,
          associateId,
        },
        create: {
          vertical: input.vertical,
          questionSlug: composedSlug,
          optionKey: input.contextOptionKey,
          ballotHash,
          associateId,
        },
      });
      return { ok: true } as const;
    }),

  submitGridCell: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        questionSlug: SLUG,
        rowKey: KEY,
        value: z.number().finite().min(0).max(1_000_000).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isKnownGridRow(input.vertical, input.questionSlug, input.rowKey)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown grid row" });
      }
      const { ballotHash } = readOrMintBallot();
      const associateId = await resolveAssociateId(ctx.session?.user?.id);

      if (input.value === null) {
        await ctx.db.surveyResponse.deleteMany({
          where: {
            vertical: input.vertical,
            questionSlug: input.questionSlug,
            gridKey: input.rowKey,
            ballotHash,
          },
        });
        return { ok: true, cleared: true } as const;
      }

      await ctx.db.surveyResponse.upsert({
        where: {
          vertical_questionSlug_gridKey_ballotHash: {
            vertical: input.vertical,
            questionSlug: input.questionSlug,
            gridKey: input.rowKey,
            ballotHash,
          },
        },
        update: {
          numericValue: input.value,
          associateId,
        },
        create: {
          vertical: input.vertical,
          questionSlug: input.questionSlug,
          gridKey: input.rowKey,
          numericValue: input.value,
          ballotHash,
          associateId,
        },
      });
      return { ok: true } as const;
    }),

  submitFreeText: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        kind: z.enum(["general", "question-suggestion"]),
        text: z.string().min(3).max(4000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!getSurvey(input.vertical)) throw new TRPCError({ code: "NOT_FOUND" });
      const { ballotHash } = readOrMintBallot();
      const username = usernameForBallot(ballotHash);
      const associateId = await resolveAssociateId(ctx.session?.user?.id);

      const profile = await ctx.db.ballotProfile.findUnique({
        where: { ballotHash_vertical: { ballotHash, vertical: input.vertical } },
      });

      const row = await ctx.db.freeTextFeedback.create({
        data: {
          vertical: input.vertical,
          kind: input.kind,
          text: input.text,
          agencyKey: profile?.agencyKey ?? null,
          agencyWritein: profile?.agencyWritein ?? null,
          discipline: profile?.discipline ?? null,
          username,
          ballotHash,
          associateId,
        },
      });
      return { id: row.id, createdAt: row.createdAt } as const;
    }),

  /**
   * Public read of recent free-text entries for a vertical + kind.
   * Username is displayed; ballotHash is never exposed.
   */
  listFreeText: publicProcedure
    .input(
      z.object({
        vertical: VERTICAL,
        kind: z.enum(["general", "question-suggestion"]),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.freeTextFeedback.findMany({
        where: { vertical: input.vertical, kind: input.kind },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        select: {
          id: true,
          text: true,
          username: true,
          discipline: true,
          agencyKey: true,
          agencyWritein: true,
          createdAt: true,
        },
      });
    }),
});
