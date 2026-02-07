import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import z from "zod";
import { taskSchema } from "@/types/Task";
import { decodeJwt } from "@/provider/jwt-helper";
import { readDb } from "@/db/fileDb";

export async function GET(req: Request, ctx: RouteContext<"/api/tasks/[id]">) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const decoded = decodeJwt(token);
  const taskId = parseInt(id, 10);
  if (Number.isNaN(taskId)) {
    return NextResponse.json(
      { error: "Nieprawidłowy id zadania" },
      { status: 400 },
    );
  }

  const data = await readDb();
  const tasks = z.array(taskSchema).parse(data.tasks);
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return NextResponse.json(
      { error: "Zadanie nie znalezione" },
      { status: 404 },
    );
  }
  if (task.userId !== decoded.id) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  return NextResponse.json({ task });
}
