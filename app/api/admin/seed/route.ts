import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import seedWarehouses from "@/lib/db/seed-warehouses";

export async function POST() {
  try {
    await dbConnect();
    await seedWarehouses();
    return NextResponse.json({ message: "Seed successful" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
