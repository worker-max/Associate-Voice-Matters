import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { structureFeedback } from "@/lib/ai/structure-feedback";

/**
 * Feedback intake. Stores raw text, then calls the neutral-moderator AI to
 * produce an employer-ready structured record. If AI structuring fails for
 * any reason — missing key, upstream error, bad JSON — we still persist the
 * raw submission so the associate never loses their words.
 */
export const feedbackRouter = router({
  submit: protectedProcedure
    .input(
      z.object({
        caseId: z.string().cuid(),
        rawText: z.string().min(1).max(8000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      const caseRecord = await ctx.db.case.findUnique({
        where: { id: input.caseId },
        select: { associateId: true, status: true },
      });
      if (!caseRecord || caseRecord.associateId !== associate.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      let structured: Awaited<ReturnType<typeof structureFeedback>> | null = null;
      let aiTags: string[] = [];
      let confidence: number | null = null;

      try {
        structured = await structureFeedback(input.rawText);
        aiTags = structured.tags;
        confidence = structured.confidence;
      } catch (err) {
        console.error("[feedback.submit] structuring failed", err);
      }

      const feedback = await ctx.db.feedback.create({
        data: {
          caseId: input.caseId,
          rawText: input.rawText,
          structuredJson: structured as object | null,
          aiTags,
          confidence,
        },
      });

      // First submission on an OPEN case moves it to AWAITING_EMPLOYER.
      if (caseRecord.status === "OPEN") {
        await ctx.db.case.update({
          where: { id: input.caseId },
          data: { status: "AWAITING_EMPLOYER" },
        });
      }

      return { feedback, structured };
    }),

  listForCase: protectedProcedure
    .input(z.object({ caseId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      const caseRecord = await ctx.db.case.findUnique({
        where: { id: input.caseId },
        select: { associateId: true },
      });
      if (!caseRecord || caseRecord.associateId !== associate.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.feedback.findMany({
        where: { caseId: input.caseId },
        orderBy: { createdAt: "asc" },
      });
    }),
});
