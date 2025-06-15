import { z } from "zod/v4";

export const TodoDataSchema = z.object({
  id: z.int(),
  text: z.string().min(1, { error: "任务必须有内容" }).max(32, { error: "任务不能超过 32 个字符" }).optional(),
  description: z.string().min(1, { error: "描述必须有内容" }).nullable().optional(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
  deadline: z.iso.datetime().nullable().optional(),
});

export type TodoData = z.infer<typeof TodoDataSchema>;
