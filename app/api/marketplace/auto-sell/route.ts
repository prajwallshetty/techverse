import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { auth } from "@/lib/auth";

const settingsSchema = z.object({
  bookingId: z.string().min(1),
  isAutoSellEnabled: z.boolean(),
  autoSellTargetPrice: z.number().optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid settings data" }, { status: 400 });
    }

    const { bookingId, isAutoSellEnabled, autoSellTargetPrice } = parsed.data;

    await dbConnect();

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, farmerId: session.user.id },
      { isAutoSellEnabled, autoSellTargetPrice },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
