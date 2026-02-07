import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";

import { userSchema } from "@/types/User";
import { decodeJwt } from "@/provider/jwt-helper";
import { readDb } from "@/db/fileDb";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const decoded = decodeJwt(token);
  const { id } = await ctx.params;
  const requestedId = parseInt(id, 10);
  if (Number.isNaN(requestedId) || requestedId !== decoded.id) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  const data = await readDb();
  const users = z.array(userSchema).parse(data.users);
  const user = users.find((u) => u.id === requestedId);
  if (!user) {
    return NextResponse.json(
      { error: "Użytkownik nie znaleziony" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      age: user.age,
    },
  });
}
