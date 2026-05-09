import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Bid } from "@/models/Bid";
import { Booking } from "@/models/Booking";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "trader") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const traderId = session.user.id;

    // 1. Fetch Trader Bids
    const traderBids = await Bid.find({ traderId }).lean();
    
    // 2. Fetch Successful Purchases (Bids that were accepted - we might need a status for this in future, 
    // for now we count confirmed ones where trader is linked to a booking)
    const activeTrades = await Bid.countDocuments({ traderId, status: "pending" });
    const successfulPurchases = await Bid.countDocuments({ traderId, status: "accepted" });

    // 3. Calculate Portfolio Value (Sum of accepted bids)
    const portfolioValue = await Bid.aggregate([
      { $match: { traderId: new Object(traderId), status: "accepted" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // 4. Fetch Recent Activity
    const recentBids = await Bid.find({ traderId })
      .populate("bookingId", "cropName quantityTons status")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      stats: {
        portfolioValue: portfolioValue[0]?.total || 0,
        activeTrades,
        winRate: traderBids.length > 0 ? Math.round((successfulPurchases / traderBids.length) * 100) : 0,
        monthlyPnL: 184000 // Mocked for now
      },
      recentBids
    });
  } catch (error: any) {
    console.error("Trader Stats Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
