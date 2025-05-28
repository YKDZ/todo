import { UserSchema } from "@/shared/schema/prisma";
import { authedProcedure, publicProcedure, router } from "../server";
import { prisma } from "@/server/db/prisma";
import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  whoAmI: publicProcedure
    .input(
      z.object({
        id: z.cuid2(),
      }),
    )
    .output(z.void())
    .query(async ({ ctx, input }) => {
      const { setCookie } = ctx;
      const { id } = input;

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "指定的用户 ID 不存在" });
      }

      setCookie("userId", id);
    }),
  delete: authedProcedure.output(z.void()).mutation(async ({ ctx }) => {
    const { userId, delCookie } = ctx;

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    delCookie("userId");
  }),
  askNew: publicProcedure.mutation(async ({ ctx: { setCookie } }) => {
    const user = UserSchema.parse(
      await prisma.user.create({
        data: {},
      }),
    );
    setCookie("userId", user.id);
    return user;
  }),
  fetch: publicProcedure
    .input(
      z.object({
        id: z.cuid2(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      return UserSchema.nullable().parse(
        await prisma.user.findUnique({
          where: {
            id,
          },
        }),
      );
    }),
});
