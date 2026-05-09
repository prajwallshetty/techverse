import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Bid } from "@/models/Bid";
import { User } from "@/models/User";
import { Warehouse } from "@/models/Warehouse";

const realisticCrops = [
  { name: "Tomato", price: 1800, tons: 50 },
  { name: "Onion", price: 2200, tons: 120 },
  { name: "Potato", price: 1500, tons: 200 },
  { name: "Rice", price: 3450, tons: 500 },
  { name: "Wheat", price: 2890, tons: 450 },
  { name: "Corn", price: 2100, tons: 300 },
  { name: "Coconut", price: 4500, tons: 80 },
  { name: "Arecanut", price: 45000, tons: 20 },
  { name: "Chilli", price: 14200, tons: 40 },
  { name: "Banana", price: 1200, tons: 60 }
];

export async function GET() {
  await dbConnect();

  try {
    const farmer = await User.findOne({ role: "farmer" });
    const warehouse = await Warehouse.findOne();
    const trader = await User.findOne({ role: "trader" });

    if (!farmer || !warehouse || !trader) {
       return NextResponse.json({ error: "Missing users/warehouses to seed" }, { status: 400 });
    }

    const listedBookings = await Booking.find({ marketplaceStatus: "listed" }).select('_id');
    const listedIds = listedBookings.map(b => b._id);
    await Bid.deleteMany({ bookingId: { $in: listedIds } });
    await Booking.deleteMany({ marketplaceStatus: "listed" });

    const newBookings = [];

    for (const crop of realisticCrops) {
      const endsAt = new Date();
      endsAt.setHours(endsAt.getHours() + Math.floor(Math.random() * 24) + 1);

      const booking = new Booking({
        farmerId: farmer._id,
        warehouseId: warehouse._id,
        cropName: crop.name,
        quantityTons: crop.tons,
        totalPrice: crop.tons * crop.price, 
        status: "confirmed",
        marketplaceStatus: "listed",
        auctionEndsAt: endsAt,
        startingBid: crop.price,
        basePrice: crop.price,
        isAutoSellEnabled: true,
        autoSellTargetPrice: crop.price * 1.5, 
      });

      await booking.save();
      newBookings.push(booking);

      const numBids = Math.floor(Math.random() * 3) + 1;
      let currentPrice = crop.price;
      for (let i = 0; i < numBids; i++) {
        currentPrice += Math.floor(Math.random() * 50) + 10;
        await Bid.create({
          bookingId: booking._id,
          traderId: trader._id,
          amount: currentPrice,
          status: "pending"
        });
      }
    }

    return NextResponse.json({ success: true, count: newBookings.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
