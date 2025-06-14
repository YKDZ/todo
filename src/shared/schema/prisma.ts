import { z } from "zod/v4";

export const PrimsaDateTime = z.date().or(z.iso.date());

export const UserSchema = z.object({
  id: z.cuid2(),
  createdAt: PrimsaDateTime,
  updatedAt: PrimsaDateTime,
});

export const AccountSchema = z.object({
  type: z.string(),
  provider: z.string(),
  providerAccountId: z.string(),
  meta: z.json().nullable(),
  createdAt: PrimsaDateTime,
  updatedAt: PrimsaDateTime,
  userId: z.cuid2(),
  get User() {
    return UserSchema.optional();
  },
});

export const TodoSchema = z.object({
  id: z.int(),
  text: z.string(),
  isCompleted: z.boolean(),
  isImportant: z.boolean(),
  deadline: PrimsaDateTime.nullable(),
  createdAt: PrimsaDateTime,
  updatedAt: PrimsaDateTime,
  creatorId: z.cuid2(),
  get Creator() {
    return UserSchema.optional();
  },
});

export type JSONType = z.infer<ReturnType<typeof z.json>>;
export type Todo = z.infer<typeof TodoSchema>;
export type User = z.infer<typeof UserSchema>;
