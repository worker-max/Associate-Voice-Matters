import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

export const caseRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const associate = await ctx.db.associate.findUnique({
      where: { userId: ctx.userId },
      select: { id: true },
    });
    if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

    return ctx.db.case.findMany({
      where: { associateId: associate.id },
      orderBy: { updatedAt: "desc" },
      include: {
        employer: {
          select: { id: true, name: true, talkaiqPartnerFlag: true },
        },
        feedback: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { structuredJson: true, createdAt: true, aiTags: true },
        },
      },
    });
  }),

  get: protectedProcedure
    .input(z.object({ caseId: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      const record = await ctx.db.case.findUnique({
        where: { id: input.caseId },
        include: {
          employer: {
            select: { id: true, name: true, talkaiqPartnerFlag: true },
          },
          feedback: { orderBy: { createdAt: "asc" } },
        },
      });
      if (!record || record.associateId !== associate.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return record;
    }),

  open: protectedProcedure
    .input(
      z.object({
        wing: z.enum(["CHANNEL", "ENVOY"]),
        employerId: z.string().cuid().optional(),
        anonymous: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.case.create({
        data: {
          associateId: associate.id,
          employerId: input.employerId,
          wing: input.wing,
          anonymousFlag: input.anonymous,
        },
      });
    }),

  /**
   * Flip the anonymity flag on a single case. Unlocking requires an existing
   * IdentityUnlockEvent — the associate must have gone through the consent
   * flow first.
   */
  setAnonymity: protectedProcedure
    .input(
      z.object({
        caseId: z.string().cuid(),
        anonymous: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      const record = await ctx.db.case.findUnique({
        where: { id: input.caseId },
        select: { associateId: true },
      });
      if (!record || record.associateId !== associate.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!input.anonymous) {
        const unlock = await ctx.db.identityUnlockEvent.findFirst({
          where: { associateId: associate.id, caseId: input.caseId },
          orderBy: { createdAt: "desc" },
        });
        if (!unlock) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Unlock consent required before identity can be revealed.",
          });
        }
      }

      return ctx.db.case.update({
        where: { id: input.caseId },
        data: { anonymousFlag: input.anonymous },
      });
    }),
});
