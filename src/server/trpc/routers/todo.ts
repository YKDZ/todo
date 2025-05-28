import { prisma } from "@/server/db/prisma";
import { authedProcedure, router } from "../server";
import { z } from "zod/v4";
import { TodoSchema } from "@/shared/schema/prisma";
import { TRPCError } from "@trpc/server";

export const todoRouter = router({
  create: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      }),
    )
    .output(TodoSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { text } = input;

      return TodoSchema.parse(
        await prisma.todo.create({
          data: {
            text,
            Creator: {
              connectOrCreate: {
                where: {
                  id: userId,
                },
                create: {
                  id: userId,
                },
              },
            },
          },
        }),
      );
    }),
  listOwned: authedProcedure
    .input(
      z.object({
        userId: z.cuid2(),
      }),
    )
    .output(z.array(TodoSchema))
    .query(async ({ input }) => {
      const { userId } = input;

      return z.array(TodoSchema).parse(
        await prisma.todo.findMany({
          where: {
            creatorId: userId,
          },
          orderBy: {
            updatedAt: "asc",
          },
        }),
      );
    }),
  update: authedProcedure
    .input(
      z.object({
        id: z.number().int(),
        isImportant: z.boolean().optional(),
        isCompleted: z.boolean().optional(),
        text: z.string().min(1),
      }),
    )
    .output(TodoSchema)
    .mutation(async ({ input }) => {
      const { id, isCompleted, isImportant, text } = input;

      return TodoSchema.parse(
        await prisma.todo.update({
          where: {
            id,
          },
          data: {
            isCompleted,
            isImportant,
            text,
          },
        }),
      );
    }),
  delete: authedProcedure
    .input(
      z.object({
        id: z.number().int(),
      }),
    )
    .output(z.void())
    .mutation(async ({ input }) => {
      const { id } = input;

      await prisma.todo.delete({
        where: {
          id,
        },
      });
    }),
});
