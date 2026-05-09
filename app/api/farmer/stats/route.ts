import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";
import { Booking } from "@/models/Booking";
import { Loan } from "@/models/Loan";
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
    const [crops, loans, bookings] = await Promise.all([
      Crop.find({ farmerId: userId }).lean(),
      Loan.find({ borrowerId: userId }).lean(),
      Booking.find({ farmerId: userId }).lean()
    ]);

    const totalStoredWeight = bookings.reduce((acc, b) => acc + (b.status === "confirmed" ? b.quantityTons : 0), 0);
    const activeLoanAmount = loans.reduce((acc, l) => acc + (l.loanStatus === "active" ? l.eligibleAmount : 0), 0);
    
    // Count active bids for the farmer's bookings
    const bookingIds = bookings.map(b => b._id);
    const activeBidsCount = await Bid.countDocuments({ 
      bookingId: { $in: bookingIds },
      status: "pending"
    });

    // 2. Fetch Nearby Warehouses (Mocking "nearby" with limit)
    const nearbyWarehouses = await Warehouse.find({ isActive: true })
      .limit(3)
      .lean();

    return NextResponse.json({
      stats: {
        totalStoredWeight,
        activeLoanAmount,
        activeBidsCount,
        cropCount: crops.length
      },
      warehouses: nearbyWarehouses
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
