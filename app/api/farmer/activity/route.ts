import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db/mongoose";
import { UserActivity } from "@/models/UserActivity";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, metadata } = await request.json();
    if (!type) {
      return NextResponse.json({ error: "Activity type required" }, { status: 400 });
    }

    await dbConnect();
    
    // For logins, only log once per day to save space
    if (type === "login") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const existing = await UserActivity.findOne({
        userId: session.user.id,
        type: "login",
        createdAt: { $gte: today }
      });
      if (existing) return NextResponse.json({ success: true, message: "Already logged today" });
    }

    const activity = await UserActivity.create({
      userId: session.user.id,
      type,
      metadata
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
