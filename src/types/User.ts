import z from "zod";

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  surname: z.string(),
  age: z.number(),
});
export type User = z.infer<typeof userSchema>;
