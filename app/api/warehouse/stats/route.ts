import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Warehouse } from "@/models/Warehouse";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "warehouse_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Find the warehouse owned by this user
    const warehouse = await Warehouse.findOne({ ownerId: session.user.id });
    if (!warehouse) {
      return NextResponse.json({ error: "No warehouse found for this owner" }, { status: 404 });
    }

    // 2. Aggregate Stats
    const bookings = await Booking.find({ warehouseId: warehouse._id });
    
    const stats = {
      totalRevenue: bookings
        .filter(b => b.status === "confirmed" || b.status === "completed")
        .reduce((sum, b) => sum + b.totalPrice, 0),
      activeBookings: bookings.filter(b => b.status === "confirmed").length,
      completedBookings: bookings.filter(b => b.status === "completed").length,
      currentStock: warehouse.currentStockTons,
      totalCapacity: warehouse.capacityTons,
      utilizationRate: Math.round((warehouse.currentStockTons / warehouse.capacityTons) * 100),
    };

    // 3. Prepare Chart Data (Group by Crop)
    const cropDistribution = bookings.reduce((acc: any, curr) => {
      acc[curr.cropName] = (acc[curr.cropName] || 0) + curr.quantityTons;
      return acc;
    }, {});

    const chartData = Object.keys(cropDistribution).map(name => ({
      name,
      value: cropDistribution[name]
    }));

    return NextResponse.json({ stats, chartData, warehouseName: warehouse.name }, { status: 200 });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
