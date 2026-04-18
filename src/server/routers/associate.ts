import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { consentFingerprint } from "@/lib/identity";

export const associateRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const associate = await ctx.db.associate.findUnique({
      where: { userId: ctx.userId },
      select: {
        id: true,
        industry: true,
        identityStatus: true,
        bridgeConsentFlag: true,
        createdAt: true,
      },
    });
    if (!associate) throw new TRPCError({ code: "NOT_FOUND" });
    return associate;
  }),

  /**
   * Initiate an identity unlock event.
   *
   * This does NOT change the Employer-visible projection on its own — it
   * records the consent fingerprint into the append-only audit log. Downstream
   * case/placement logic checks for a matching unlock event when deciding
   * what to reveal.
   */
  requestUnlock: protectedProcedure
    .input(
      z.object({
        caseId: z.string().cuid().optional(),
        reason: z.enum([
          "ADVOCACY_RECOMMENDED",
          "ASSOCIATE_INITIATED",
          "PLACEMENT_REQUIRED",
          "VERIFICATION",
        ]),
        initiatedBy: z.enum(["associate", "ai-recommendation"]),
        promptVersion: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      const now = new Date();
      const consentHash = consentFingerprint({
        associateId: associate.id,
        reason: input.reason,
        promptVersion: input.promptVersion,
        timestamp: now.toISOString(),
      });

      return ctx.db.identityUnlockEvent.create({
        data: {
          associateId: associate.id,
          caseId: input.caseId,
          reason: input.reason,
          initiatedBy: input.initiatedBy,
          consentHash,
          createdAt: now,
        },
      });
    }),
});
