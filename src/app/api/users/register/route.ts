import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";

import { User, userSchema } from "@/types/User";
import { encodeJwt } from "@/provider/jwt-helper";
import { readDb, writeDb } from "@/db/fileDb";

const registerSchema = z.object({
  name: z.string().min(1, "Imię jest wymagane").trim(),
  surname: z.string().min(1, "Nazwisko jest wymagane").trim(),
  email: z
    .email("Nieprawidłowy format adresu email")
    .transform((s) => s.trim().toLowerCase()),
  password: z.string().min(6, "Hasło musi mieć min. 6 znaków"),
});

export async function POST(req: Request) {
  let body: z.infer<typeof registerSchema>;
  try {
    body = registerSchema.parse(await req.json());
  } catch {
    const message = "Nieprawidłowe dane";
    return NextResponse.json({ message }, { status: 400 });
  }

  const { name, surname, email, password } = body;

  const data = await readDb();
  const users = z.array(userSchema).parse(data.users);

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json(
      { message: "Konto z tym adresem email już istnieje" },
      { status: 409 },
    );
  }

  const nextId = Math.max(0, ...users.map((u) => u.id)) + 1;
  const newUser: User = {
    id: nextId,
    email,
    password,
    name,
    surname,
    age: 0,
  };

  users.push(newUser);
  data.users = users;
  await writeDb(data);

  const token = encodeJwt({
    email: newUser.email,
    id: newUser.id,
    password: newUser.password,
  });
  const cookieStore = await cookies();
  cookieStore.set("token", token);

  return NextResponse.json({
    token,
    user: { id: newUser.id, email: newUser.email },
  });
}
