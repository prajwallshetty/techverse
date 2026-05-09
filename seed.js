import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const BookingSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse", required: true },
    cropName: { type: String, required: true },
    quantityTons: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" },
    marketplaceStatus: { type: String, default: "listed" },
    autoSellTargetPrice: { type: Number },
    isAutoSellEnabled: { type: Boolean, default: false },
    auctionEndsAt: { type: Date },
    startingBid: { type: Number },
    basePrice: { type: Number },
});

const BidSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    traderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: "pending" },
});

const UserSchema = new mongoose.Schema({
    name: String,
    role: String
});

const WarehouseSchema = new mongoose.Schema({
    name: String,
});

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
const Bid = mongoose.models.Bid || mongoose.model("Bid", BidSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Warehouse = mongoose.models.Warehouse || mongoose.model("Warehouse", WarehouseSchema);

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

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to DB");

  try {
    const farmer = await User.findOne({ role: "farmer" });
    const warehouse = await Warehouse.findOne();
    const trader = await User.findOne({ role: "trader" });

    if (!farmer || !warehouse || !trader) {
       throw new Error("Missing users/warehouses to seed");
    }

    const listedBookings = await Booking.find({ marketplaceStatus: "listed" }).select('_id');
    const listedIds = listedBookings.map(b => b._id);
    await Bid.deleteMany({ bookingId: { $in: listedIds } });
    await Booking.deleteMany({ marketplaceStatus: "listed" });
    console.log("Cleared old listings");

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
      console.log(`Seeded ${crop.name}`);

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

    console.log("Seeding complete!");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
