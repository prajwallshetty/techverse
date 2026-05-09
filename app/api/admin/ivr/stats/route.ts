import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { CallLog } from "@/models/CallLog";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Aggregated Stats
    const totalCalls = await CallLog.countDocuments();
    const serviceDistribution = await CallLog.aggregate([
      { $group: { _id: "$serviceRequested", value: { $sum: 1 } } }
    ]);

    const stats = {
      totalCalls,
      uniqueCallers: (await CallLog.distinct("callerId")).length,
      topService: serviceDistribution.sort((a, b) => b.value - a.value)[0]?._id || "None"
    };

    // 2. Recent Logs
    const recentLogs = await CallLog.find()
      .sort({ timestamp: -1 })
      .limit(15)
      .populate("farmerId", "name")
      .lean();

    return NextResponse.json({ 
      stats, 
      logs: recentLogs, 
      chartData: serviceDistribution.map(d => ({ name: d._id, value: d.value }))
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
