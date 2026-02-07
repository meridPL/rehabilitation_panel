import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";

import { userSchema } from "@/types/User";
import { encodeJwt } from "@/provider/jwt-helper";

const loginSchema = z.object({
  email: z.email("Nieprawidłowy format adresu email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export async function POST(req: Request) {
  let body: z.infer<typeof loginSchema>;
  try {
    body = loginSchema.parse(await req.json());
  } catch {
    const message = "Nieprawidłowe dane";
    return NextResponse.json({ message }, { status: 400 });
  }

  const { email, password } = body;

  const { readDb } = await import("@/db/fileDb");
  const data = await readDb();
  const dbJson = data.users;
  const users = z.array(userSchema).parse(dbJson);

  const user = users.find(
    (user) => user.email === email && user.password === password,
  );

  if (user) {
    const token = encodeJwt({ email, id: user.id, password: user.password });
    const cookieStore = await cookies();
    cookieStore.set("token", token);
    return NextResponse.json({
      token: token,
      user: { email },
    });
  }

  return NextResponse.json({ message: "Nieprawidłowe dane" }, { status: 401 });
}
