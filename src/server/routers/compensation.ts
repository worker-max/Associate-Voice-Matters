import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";

const rateTypeEnum = z.enum(["HOURLY", "UNIT", "SALARY", "STIPEND", "MILEAGE"]);

export const compensationRouter = router({
  submit: protectedProcedure
    .input(
      z.object({
        role: z.string().min(1).max(120),
        region: z.string().min(1).max(120),
        facilityType: z.string().max(120).optional(),
        rate: z.number().positive(),
        rateType: rateTypeEnum,
        ptoDays: z.number().int().nonnegative().optional(),
        housingStipend: z.number().nonnegative().optional(),
        travelAllowance: z.number().nonnegative().optional(),
        notes: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const associate = await ctx.db.associate.findUnique({
        where: { userId: ctx.userId },
        select: { id: true },
      });
      if (!associate) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.compensationRecord.create({
        data: {
          associateId: associate.id,
          ...input,
        },
      });
    }),

  /**
   * Public benchmarks. No identity leaks here — MarketRate has no associate FK.
   */
  benchmark: publicProcedure
    .input(
      z.object({
        role: z.string(),
        region: z.string(),
        facilityType: z.string().optional(),
        rateType: rateTypeEnum.default("HOURLY"),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.marketRate.findFirst({
        where: {
          role: input.role,
          region: input.region,
          facilityType: input.facilityType ?? null,
          rateType: input.rateType,
        },
      });
    }),
});
