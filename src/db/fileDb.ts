import path from "path";
import fs from "fs/promises";
import { User } from "@/types/User";
import { Task } from "@/types/Task";

const DB_PATH = path.join(process.cwd(), "src/db/db.json");

export type DbData = { users: User[]; tasks: Task[] };

export async function readDb(): Promise<DbData> {
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as DbData;
}

export async function writeDb(data: DbData): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
