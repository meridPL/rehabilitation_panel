import { taskSchema } from "@/types/Task";
import { cookies } from "next/headers";
import z from "zod";

import { decodeJwt } from "@/provider/jwt-helper";
import { readDb } from "@/db/fileDb";

export const getTasks = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Brak autoryzacji");
  }
  const decoded = decodeJwt(token);
  const data = await readDb();
  const tasks = z.array(taskSchema).parse(data.tasks);
  return tasks.filter((task) => task.userId === decoded.id);
};

export const getTask = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Brak autoryzacji");
  }
  const decoded = decodeJwt(token);
  const data = await readDb();
  const tasks = z.array(taskSchema).parse(data.tasks);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error("Zadanie nie znalezione");
  }
  if (task.userId !== decoded.id) {
    throw new Error("Brak dostępu");
  }
  return task;
};
