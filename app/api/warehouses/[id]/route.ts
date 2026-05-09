import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";
import { StorageSlot } from "@/models/StorageSlot";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    
    const warehouse = await Warehouse.findById(id).lean();
    if (!warehouse) {
      return NextResponse.json({ error: "Warehouse not found" }, { status: 404 });
    }

    const slots = await StorageSlot.find({ warehouseId: id }).sort({ slotNumber: 1 }).lean();

    return NextResponse.json({ warehouse, slots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
