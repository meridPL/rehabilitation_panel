import jwt from "jsonwebtoken";
import z from "zod";

const SECRET = process.env.JWT_SECRET!;
const authSchema = z.object({
  id: z.number(),
  email: z.string(),
  password: z.string(),
});

export const decodeJwt = (token: string) => {
  const decoded = jwt.verify(token, SECRET);
  return authSchema.parse(decoded);
};

export const encodeJwt = (payload: z.infer<typeof authSchema>) => {
  return jwt.sign(payload, SECRET);
};
