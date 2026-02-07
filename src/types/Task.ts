import z from "zod";

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  nameDevice: z.string(),
  time: z.number(),
  weight: z.number(),
  status: z.enum(["done", "to_do", "in_progress"]),
  userId: z.number(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

export type Task = z.infer<typeof taskSchema>;
