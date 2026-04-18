import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

/**
 * Feedback intake. Phase 1: stores raw text. Phase 2 wires the Claude API
 * call that structures raw → {structuredJson, aiTags, confidence}.
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
        select: { associateId: true },
      });
      if (!caseRecord || caseRecord.associateId !== associate.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return ctx.db.feedback.create({
        data: {
          caseId: input.caseId,
          rawText: input.rawText,
        },
      });
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
