import { z } from "zod/v4";

export const PrimsaDateTime = z.date().or(z.iso.date());

export const UserSchema = z.object({
  id: z.cuid2(),
  createdAt: PrimsaDateTime,
});

export const TodoSchema = z.object({
  id: z.int(),
  text: z.string(),
  isCompleted: z.boolean(),
  isImportant: z.boolean(),
  createdAt: PrimsaDateTime,
  updatedAt: PrimsaDateTime,
  creatorId: z.cuid2(),
});

export type Todo = z.infer<typeof TodoSchema>;
export type User = z.infer<typeof UserSchema>;
