import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import dbConnect from "@/lib/db/mongoose";
import { Warehouse } from "@/models/Warehouse";
import { Booking } from "@/models/Booking";
import { auth } from "@/lib/auth";
import QRCode from "qrcode";

const bookingSchema = z.object({
  warehouseId: z.string().min(1),
  cropName: z.string().min(1),
  quantityTons: z.number().positive(),
  totalPrice: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const sessionToken = await auth();
    if (!sessionToken?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const farmerId = sessionToken.user.id;

    const body = await request.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid booking data." }, { status: 400 });
    }

    const { warehouseId, cropName, quantityTons, totalPrice } = parsed.data;

    await dbConnect();
    
    // START MONGODB TRANSACTION
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch warehouse with exclusive lock/isolation to prevent race conditions
      const warehouse = await Warehouse.findById(warehouseId).session(session);

      if (!warehouse) {
        throw new Error("Warehouse not found.");
      }
      
      // Calculate available capacity
      const availableCapacity = warehouse.capacityTons - warehouse.currentStockTons;

      // 2. Check Capacity Constraint
      if (quantityTons > availableCapacity) {
        throw new Error(`Overbooking prevented: Only ${availableCapacity} MT available.`);
      }

      // 3. Update Warehouse Capacity (increase currentStockTons)
      warehouse.currentStockTons += quantityTons;
      await warehouse.save({ session });

      // 4. Create Confirmed Booking Entry
      const booking = new Booking({
        farmerId,
        warehouseId,
        cropName,
        quantityTons,
        totalPrice,
        status: "confirmed",
      });

      // 5. Generate Secure QR Code Data
      const qrPayload = JSON.stringify({
        bookingId: booking._id.toString(),
        farmerId: farmerId,
        warehouseId: warehouseId,
        timestamp: new Date().toISOString()
      });
      
      const qrDataUrl = await QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: 'H',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      booking.qrCodeDataUrl = qrDataUrl;
      await booking.save({ session });

      // COMMIT TRANSACTION
      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (transactionError: any) {
      // ABORT TRANSACTION ON FAILURE
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ error: transactionError.message || "Booking failed." }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch all bookings for this farmer, populate warehouse details
    const bookings = await Booking.find({ farmerId: session.user.id })
      .populate("warehouseId", "name location")
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
  }
}
