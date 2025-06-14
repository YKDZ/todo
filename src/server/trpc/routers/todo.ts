import { prisma } from "@/server/db/prisma";
import { authedProcedure, router } from "../server";
import { z } from "zod/v4";
import type { Todo } from "@/shared/schema/prisma";
import { TodoSchema } from "@/shared/schema/prisma";
import { TodoDataSchema } from "@/shared/schema/misc";

export const todoRouter = router({
  create: authedProcedure
    .input(
      z.object({
        text: z.string().min(1),
      }),
    )
    .output(TodoSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { text } = input;

      return TodoSchema.parse(
        await prisma.todo.create({
          data: {
            text,
            Creator: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
      );
    }),
  listOwned: authedProcedure.output(z.array(TodoSchema)).query(async ({ ctx }) => {
    const { user } = ctx;

    return z.array(TodoSchema).parse(
      await prisma.todo.findMany({
        where: {
          creatorId: user.id,
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
        datas: z.array(TodoDataSchema),
      }),
    )
    .output(z.array(TodoSchema))
    .mutation(async ({ input }) => {
      const { datas } = input;

      return z.array(TodoSchema).parse(
        await prisma.$transaction(async (tx) => {
          const result: Todo[] = [];
          for (const { id, isCompleted, isImportant, deadline, text } of datas) {
            result.push(
              await tx.todo.update({
                where: {
                  id,
                },
                data: {
                  isCompleted,
                  isImportant,
                  text,
                  deadline: deadline !== undefined ? (deadline === null ? null : new Date(deadline)) : undefined,
                },
              }),
            );
          }
          return result;
        }),
      );
    }),
  delete: authedProcedure
    .input(
      z.object({
        ids: z.array(z.int()),
      }),
    )
    .output(z.void())
    .mutation(async ({ input }) => {
      const { ids } = input;

      await prisma.todo.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    }),
});
