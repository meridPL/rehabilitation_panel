import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";
import { taskSchema } from "@/types/Task";
import { decodeJwt } from "@/provider/jwt-helper";
import { readDb, writeDb } from "@/db/fileDb";

const bodySchema = z.object({ id: z.number() });

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const decoded = decodeJwt(token);

  let body: { id: number };
  try {
    body = bodySchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe dane, oczekiwano { id: number }" },
      { status: 400 },
    );
  }

  const data = await readDb();
  const tasks = z.array(taskSchema).parse(data.tasks);
  const index = tasks.findIndex((t) => t.id === body.id);

  if (index === -1) {
    return NextResponse.json(
      { error: "Zadanie nie znalezione" },
      { status: 404 },
    );
  }

  const task = tasks[index];
  if (task.userId !== decoded.id) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  if (task.status !== "to_do") {
    return NextResponse.json(
      {
        error: "Zadanie może być rozpoczęte tylko gdy status jest do zrobienia",
      },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  tasks[index] = {
    ...task,
    status: "in_progress",
    startedAt: now,
  };

  data.tasks = tasks;
  await writeDb(data);

  return NextResponse.json({ task: tasks[index] });
}
