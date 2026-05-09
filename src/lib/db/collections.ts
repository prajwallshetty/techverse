import type { FarmHolding } from "@/types/domain";
import { getDb } from "@/lib/db/mongodb";

export async function farmsCollection() {
  const db = await getDb();
  return db.collection<FarmHolding>("farms");
}
