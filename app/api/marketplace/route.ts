import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Bid } from "@/models/Bid";
import { Warehouse } from "@/models/Warehouse";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Parse Filters from URL
    const { searchParams } = new URL(request.url);
    const cropType = searchParams.get("crop");
    const location = searchParams.get("location");

    const query: any = { status: "confirmed", marketplaceStatus: "listed" };
    if (cropType) query.cropName = cropType;

    // 2. Fetch Bookings (Crops) and their current highest bids
    const bookings = await Booking.find(query)
      .populate({ path: "warehouseId", select: "name location", model: Warehouse })
      .sort({ createdAt: -1 })
      .lean();

    // 3. Enhance with highest bid info
    const enhancedBookings = await Promise.all(
      bookings.map(async (b: any) => {
        const highestBid = await Bid.findOne({ bookingId: b._id })
          .sort({ amount: -1 })
          .lean();
        
        // Filter by location if provided (on the populated warehouseId)
        if (location) {
          const warehouseLocation = b.warehouseId?.location || "";
          if (!warehouseLocation.toLowerCase().includes(location.toLowerCase())) {
            return null;
          }
        }

        return {
          ...b,
          highestBid: highestBid?.amount || 0,
          bidCount: await Bid.countDocuments({ bookingId: b._id }),
        };
      })
    );

    return NextResponse.json({ 
      listings: enhancedBookings.filter(b => b !== null) 
    }, { status: 200 });

  } catch (error) {
    console.error("Marketplace API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
