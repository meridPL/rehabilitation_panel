import { cookies } from "next/headers";
import z from "zod";

import { userSchema } from "@/types/User";
import { decodeJwt } from "@/provider/jwt-helper";
import { readDb } from "@/db/fileDb";

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    throw new Error("Brak autoryzacji");
  }
  const decoded = decodeJwt(token);
  const data = await readDb();
  const users = z.array(userSchema).parse(data.users);
  const user = users.find((u) => u.id === decoded.id);
  if (!user) {
    throw new Error("Użytkownik nie znaleziony");
  }
  return user;
};

export const getUser = async (id: number) => {
  const data = await readDb();
  const users = z.array(userSchema).parse(data.users);
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error("Użytkownik nie znaleziony");
  }
  return user;
};
