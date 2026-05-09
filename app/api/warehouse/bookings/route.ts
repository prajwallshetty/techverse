import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Warehouse } from "@/models/Warehouse";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "warehouse_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const warehouse = await Warehouse.findOne({ ownerId: session.user.id });
    if (!warehouse) return NextResponse.json({ bookings: [] });

    const bookings = await Booking.find({ warehouseId: warehouse._id })
      .populate("farmerId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "warehouse_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, status } = await request.json();

    await dbConnect();

    const booking = await Booking.findById(bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Ensure owner has right to this booking
    const warehouse = await Warehouse.findOne({ _id: booking.warehouseId, ownerId: session.user.id });
    if (!warehouse) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    booking.status = status;
    await booking.save();

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
