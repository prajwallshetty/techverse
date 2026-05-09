import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { StorageSlot } from "@/models/StorageSlot";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const slots = await StorageSlot.find({ warehouseId: id }).sort({ slotNumber: 1 }).lean();
    return NextResponse.json({ slots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
