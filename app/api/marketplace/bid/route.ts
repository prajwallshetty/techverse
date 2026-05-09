import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongoose";
import { Bid } from "@/models/Bid";
import { auth } from "@/lib/auth";

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

    // 1. Check if bid is higher than current highest
    const highestBid = await Bid.findOne({ bookingId }).sort({ amount: -1 });
    if (highestBid && amount <= highestBid.amount) {
      return NextResponse.json({ 
        error: "Bid must be higher than current highest: ₹" + highestBid.amount 
      }, { status: 400 });
    }

    // 2. Create the new bid
    const bid = new Bid({
      bookingId,
      traderId: session.user.id,
      amount,
      status: "pending",
    });

    await bid.save();

    return NextResponse.json({ success: true, bid }, { status: 201 });

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
