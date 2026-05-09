import type { FarmHolding, User } from "@/types/domain";

import { getDb } from "@/lib/db/mongodb";

export async function farmsCollection() {
  const db = await getDb();
  return db.collection<FarmHolding>("farms");
}

export async function usersCollection() {
  const db = await getDb();
  return db.collection<User>("users");
}


