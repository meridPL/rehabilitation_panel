import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";

import { User, userSchema } from "@/types/User";
import { decodeJwt } from "@/provider/jwt-helper";
import { readDb, writeDb } from "@/db/fileDb";

const bodySchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Hasło musi mieć min. 6 znaków").optional(),
});

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const decoded = decodeJwt(token);

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    const message = "Nieprawidłowe dane";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (body.newPassword !== undefined && !body.currentPassword) {
    return NextResponse.json(
      { error: "obecne hasło jest wymagane do ustawienia nowego hasła" },
      { status: 400 },
    );
  }

  const data = await readDb();
  const users = z.array(userSchema).parse(data.users);
  const index = users.findIndex((u) => u.id === decoded.id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Użytkownik nie znaleziony" },
      { status: 404 },
    );
  }

  const user = users[index];

  if (body.newPassword !== undefined) {
    if (user.password !== body.currentPassword) {
      return NextResponse.json({ error: "Błędne hasło" }, { status: 400 });
    }
  }

  const updated: User = {
    ...user,
    ...(body.firstName !== undefined && { name: body.firstName }),
    ...(body.lastName !== undefined && { surname: body.lastName }),
    ...(body.newPassword !== undefined && { password: body.newPassword }),
  };

  users[index] = updated;
  data.users = users;
  await writeDb(data);

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      surname: updated.surname,
      age: updated.age,
    },
  });
}
