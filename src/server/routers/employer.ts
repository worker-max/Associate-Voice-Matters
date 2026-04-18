import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const employerRouter = router({
  search: publicProcedure
    .input(z.object({ q: z.string().min(1).max(120) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.employer.findMany({
        where: {
          OR: [
            { name: { contains: input.q, mode: "insensitive" } },
            { domain: { contains: input.q, mode: "insensitive" } },
          ],
        },
        take: 20,
        select: {
          id: true,
          name: true,
          industry: true,
          domain: true,
          // Surface the partner flag so the UI can show routing state —
          // at launch, always false.
          talkaiqPartnerFlag: true,
        },
      });
    }),
});
