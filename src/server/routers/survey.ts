import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { readOrMintBallot } from "@/lib/ballot";
import { getSurvey, isKnownOption } from "@/content/surveys";

const slugLike = /^[a-z0-9-]+$/i;

export const surveyRouter = router({
  /**
   * Aggregate counts for every question in a vertical.
   * Returns a response-free tally — no ballot hashes, no associate ids.
   */
  aggregate: publicProcedure
    .input(z.object({ vertical: z.string().min(2).max(64) }))
    .query(async ({ ctx, input }) => {
      const survey = getSurvey(input.vertical);
      if (!survey) throw new TRPCError({ code: "NOT_FOUND" });

      const rows = await ctx.db.surveyResponse.groupBy({
        by: ["questionSlug", "optionKey"],
        where: { vertical: input.vertical },
        _count: { _all: true },
      });

      const byQuestion = new Map<string, Map<string, number>>();
      for (const r of rows) {
        if (!byQuestion.has(r.questionSlug)) {
          byQuestion.set(r.questionSlug, new Map());
        }
        byQuestion.get(r.questionSlug)!.set(r.optionKey, r._count._all);
      }

      return {
        vertical: survey.vertical,
        questions: survey.questions.map((q) => {
          const counts = byQuestion.get(q.slug) ?? new Map<string, number>();
          const total = [...counts.values()].reduce((a, b) => a + b, 0);
          return {
            slug: q.slug,
            total,
            options: q.options.map((o) => ({
              key: o.key,
              count: counts.get(o.key) ?? 0,
            })),
          };
        }),
      };
    }),

  /**
   * Record a single response. One ballot = one answer per question
   * (enforced by the unique index on (vertical, slug, ballotHash)).
   * Changing an answer upserts the same row.
   */
  submit: publicProcedure
    .input(
      z.object({
        vertical: z.string().min(2).max(64).regex(slugLike),
        questionSlug: z.string().min(2).max(120).regex(slugLike),
        optionKey: z.string().min(1).max(64).regex(slugLike),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!isKnownOption(input.vertical, input.questionSlug, input.optionKey)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unknown question or option for this vertical.",
        });
      }

      const { ballotHash } = readOrMintBallot();
      const associateId = ctx.session?.user?.id
        ? (
            await ctx.db.associate.findUnique({
              where: { userId: ctx.session.user.id },
              select: { id: true },
            })
          )?.id ?? null
        : null;

      await ctx.db.surveyResponse.upsert({
        where: {
          vertical_questionSlug_ballotHash: {
            vertical: input.vertical,
            questionSlug: input.questionSlug,
            ballotHash,
          },
        },
        update: { optionKey: input.optionKey, associateId },
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

  /**
   * Return this ballot's current selections so the UI can reflect prior
   * answers without making a guess. No ballot hash leaks to the client —
   * only the ballot's own choices come back.
   */
  myAnswers: publicProcedure
    .input(z.object({ vertical: z.string().min(2).max(64) }))
    .query(async ({ ctx, input }) => {
      const { ballotHash } = readOrMintBallot();
      const rows = await ctx.db.surveyResponse.findMany({
        where: { vertical: input.vertical, ballotHash },
        select: { questionSlug: true, optionKey: true },
      });
      const selections: Record<string, string> = {};
      for (const r of rows) selections[r.questionSlug] = r.optionKey;
      return selections;
    }),
});
