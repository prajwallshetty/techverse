import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Warehouse } from "@/models/Warehouse";
import { Bid } from "@/models/Bid";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Aggregated Platform KPIs
    const [userCount, warehouseCount, bookingStats, bidCount] = await Promise.all([
      User.countDocuments(),
      Warehouse.countDocuments(),
      Booking.aggregate([
        { $group: { _id: null, totalTonnage: { $sum: "$quantityTons" }, totalRevenue: { $sum: "$totalPrice" } } }
      ]),
      Bid.countDocuments()
    ]);

    const stats = {
      totalUsers: userCount,
      totalWarehouses: warehouseCount,
      totalTonnage: bookingStats[0]?.totalTonnage || 0,
      totalVolume: bookingStats[0]?.totalRevenue || 0,
      totalBids: bidCount,
    };

    // 2. Role Distribution
    const roles = await User.aggregate([
      { $group: { _id: "$role", value: { $sum: 1 } } }
    ]);

    const roleData = roles.map(r => ({
      name: r._id.charAt(0).toUpperCase() + r._id.slice(1).replace('_', ' '),
      value: r.value
    }));

    return NextResponse.json({ stats, roleData }, { status: 200 });

  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
