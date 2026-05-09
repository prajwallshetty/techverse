import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Bid } from "@/models/Bid";
import dbConnect from "@/lib/db/mongoose";
import mongoose from "mongoose";

const bidSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "trader") {
      return NextResponse.json({ error: "Unauthorized: Trader role required" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = bidSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
    }

    const { bookingId, amount } = parsed.data;

    await dbConnect();
    const session_mongo = await mongoose.startSession();
    session_mongo.startTransaction();

    try {
      // 1. Check if bid is higher than current highest
      const highestBid = await Bid.findOne({ bookingId }).sort({ amount: -1 }).session(session_mongo);
      if (highestBid && amount <= highestBid.amount) {
        throw new Error("Bid must be higher than current highest: ₹" + highestBid.amount);
      }

      // 2. Create the new bid
      const bid = new Bid({
        bookingId,
        traderId: session.user.id,
        amount,
        status: "pending",
      });
      await bid.save({ session: session_mongo });

      // 3. AUTO-SELL LOGIC
      const booking = await Booking.findById(bookingId).session(session_mongo);
      let autoSold = false;

      if (booking && booking.isAutoSellEnabled && booking.autoSellTargetPrice && amount >= booking.autoSellTargetPrice) {
        // EXECUTE AUTOMATIC SALE
        booking.marketplaceStatus = "sold";
        bid.status = "accepted";
        await booking.save({ session: session_mongo });
        await bid.save({ session: session_mongo });
        autoSold = true;
      }

      await session_mongo.commitTransaction();

      // 4. Trigger Real-time Event via Pusher
      const trader = await User.findById(session.user.id).select("name");
      
      await pusherServer.trigger(`marketplace-${bookingId}`, "new-bid", {
        _id: bid._id,
        amount,
        status: bid.status,
        traderId: {
          _id: session.user.id,
          name: trader?.name || "A Trader",
        },
        createdAt: bid.createdAt,
      });

      if (autoSold) {
        await pusherServer.trigger(`marketplace-${bookingId}`, "auto-sold", {
          amount,
          traderName: trader?.name,
        });
      }

      await pusherServer.trigger("marketplace-global", "bid-count-update", { bookingId });

      return NextResponse.json({ success: true, bid, autoSold }, { status: 201 });
    } catch (error: any) {
      await session_mongo.abortTransaction();
      return NextResponse.json({ error: error.message || "Failed to place bid" }, { status: 400 });
    } finally {
      session_mongo.endSession();
    }

  } catch (error) {
    console.error("Bidding Error:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}

// Get bid history for a specific booking
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    await dbConnect();

    const bids = await Bid.find({ bookingId })
      .populate("traderId", "name")
      .sort({ amount: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({ bids }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
