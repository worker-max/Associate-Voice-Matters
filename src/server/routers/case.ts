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
      select: {
        id: true,
        wing: true,
        status: true,
        anonymousFlag: true,
        employerId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
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
});
