import { auth } from "@/lib/auth";
import { Booking } from "@/models/Booking";
import dbConnect from "@/lib/db/mongoose";
import { BookingsListClient } from "@/features/warehouse/bookings-list-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Bookings | AgriHold AI",
};

export default async function BookingsHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await dbConnect();

  const bookings = await Booking.find({ farmerId: session.user.id })
    .populate("warehouseId", "name location pricePerTon")
    .sort({ createdAt: -1 })
    .lean();

  // Serialize ObjectIds to strings to pass to Client Component safely
  const serializedBookings = bookings.map(b => ({
    ...b,
    _id: b._id.toString(),
    farmerId: b.farmerId.toString(),
    warehouseId: b.warehouseId ? {
      ...b.warehouseId,
      _id: b.warehouseId._id.toString(),
    } : null,
  }));

  return (
    <div className="h-full w-full bg-surface">
      <BookingsListClient initialBookings={serializedBookings} />
    </div>
  );
}
