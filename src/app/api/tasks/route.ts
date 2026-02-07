import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";
import { taskSchema } from "@/types/Task";
import { decodeJwt } from "@/provider/jwt-helper";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const decoded = decodeJwt(token);

  const { readDb } = await import("@/db/fileDb");
  const data = await readDb();
  const dbJson = data.tasks;

  const tasks = z.array(taskSchema).parse(dbJson);

  return NextResponse.json({
    tasks: tasks.filter((task) => task.userId === decoded.id),
  });
}
