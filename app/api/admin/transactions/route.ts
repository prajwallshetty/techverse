import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Bid } from "@/models/Bid";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch recent activity across all critical streams
    const [bookings, bids] = await Promise.all([
      Booking.find().sort({ createdAt: -1 }).limit(10).populate("farmerId", "name"),
      Bid.find().sort({ createdAt: -1 }).limit(10).populate("traderId", "name")
    ]);

    // Flatten into a single audit log
    const auditLog = [
      ...bookings.map(b => ({ id: b._id, type: "BOOKING", user: (b.farmerId as any)?.name, amount: b.totalPrice, status: b.status, date: b.createdAt })),
      ...bids.map(bi => ({ id: bi._id, type: "BID", user: (bi.traderId as any)?.name, amount: bi.amount, status: bi.status, date: bi.createdAt }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ auditLog: auditLog.slice(0, 20) }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
