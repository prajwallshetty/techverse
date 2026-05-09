import { auth } from "@/lib/auth";
import { Booking } from "@/models/Booking";
import dbConnect from "@/lib/db/mongoose";
import { LoanDashboardClient } from "@/features/loans/loan-dashboard-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Microloans | AgriHold AI",
};

export default async function FarmerLoansPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await dbConnect();

  // 1. Fetch confirmed bookings to use as potential collateral
  const bookings = await Booking.find({ 
    farmerId: session.user.id,
    status: "confirmed"
  })
  .populate("warehouseId", "name")
  .lean();

  // Serialize for Client Component
  const serializedBookings = bookings.map((b: any) => ({
    ...b,
    _id: b._id.toString(),
    warehouseId: { name: b.warehouseId.name }
  }));

  return (
    <div className="min-h-screen w-full bg-surface">
      <LoanDashboardClient initialBookings={serializedBookings} />
    </div>
  );
}
