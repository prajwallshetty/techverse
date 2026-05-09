import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";
import { Booking } from "@/models/Booking";
import { Bid } from "@/models/Bid";
import { Crop } from "@/models/Crop";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // 1. Fetch Key Stats
    const [crops, rawBookings, recentBookings] = await Promise.all([
      Crop.find({ farmerId: userId }).lean(),
      Booking.find({ farmerId: userId }).lean(),
      Booking.find({ farmerId: userId })
        .populate("warehouseId", "name location")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
    ]);

    const totalStoredWeight = rawBookings.reduce((acc, b) => acc + (b.status === "confirmed" ? b.quantityTons : 0), 0);
    
    // Count active bids for the farmer's bookings
    const bookingIds = rawBookings.map(b => b._id);
    const activeBidsCount = await Bid.countDocuments({ 
      bookingId: { $in: bookingIds },
      status: "pending"
    });

    // 2. Fetch Nearby Warehouses (Mocking "nearby" with limit)
    const nearbyWarehouses = await Warehouse.find({ isActive: true })
      .limit(3)
      .lean();

    // Serialize ObjectIds for client
    const serializedBookings = recentBookings.map(b => ({
      ...b,
      _id: b._id.toString(),
      farmerId: b.farmerId.toString(),
      warehouseId: b.warehouseId ? {
        ...(b.warehouseId as any),
        _id: (b.warehouseId as any)._id.toString(),
      } : null,
    }));

    return NextResponse.json({
      stats: {
        totalStoredWeight,
        activeBidsCount,
        cropCount: crops.length
      },
      bookings: serializedBookings,
      warehouses: nearbyWarehouses
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
