import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";

export async function GET() {
  try {
    await dbConnect();
    const warehouses = await Warehouse.find({ isActive: true }).lean();
    return NextResponse.json({ warehouses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
