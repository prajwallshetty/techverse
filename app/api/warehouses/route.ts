import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    // Sort by trustScore descending so highest-trust warehouses appear first for farmers
    const warehouses = await Warehouse.find({ isActive: true })
      .sort({ trustScore: -1 })
      .lean();
    return NextResponse.json({ warehouses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "warehouse_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      location,
      latitude,
      longitude,
      capacityTons,
      pricePerTonPerWeek,
      certifications,
    } = body;

    if (!name || !location || !capacityTons) {
      return NextResponse.json(
        { error: "Name, location and capacity are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const warehouse = await Warehouse.create({
      ownerId: session.user.id,
      name,
      location,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      capacityTons: Number(capacityTons),
      currentStockTons: 0,
      pricePerTonPerWeek: pricePerTonPerWeek ? Number(pricePerTonPerWeek) : 500,
      certifications: certifications || [],
      zones: [],
      isActive: true,
    });

    return NextResponse.json({ warehouse }, { status: 201 });
  } catch (error: any) {
    console.error("Create warehouse error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
