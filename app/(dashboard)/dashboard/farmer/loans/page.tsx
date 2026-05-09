import { auth } from "@/lib/auth";
import { Booking } from "@/models/Booking";
import { Loan } from "@/models/Loan";
import dbConnect from "@/lib/db/mongoose";
import { DecentroAPI } from "@/lib/decentro";
import { LoanDashboardClient } from "@/features/loans/loan-dashboard-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Microloans | AgriHold AI",
};

export default async function FarmerLoansPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  await dbConnect();

  // 1. Fetch Collateral (Confirmed Bookings)
  const activeBookings = await Booking.find({ 
    farmerId: session.user.id,
    status: "confirmed"
  }).lean();

  const totalCollateralValue = activeBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

  // 2. Fetch Eligibility from Decentro SDK
  const eligibilityInfo = await DecentroAPI.checkEligibility(totalCollateralValue);
  const eligibility = {
    ...eligibilityInfo,
    totalCollateralValue
  };

  // 3. Fetch Existing Loans
  const rawLoans = await Loan.find({ borrowerId: session.user.id }).sort({ createdAt: -1 }).lean();
  
  // Serialize Mongoose ObjectIds to strings
  const loans = rawLoans.map((l: any) => ({
    ...l,
    _id: l._id.toString(),
    borrowerId: l.borrowerId.toString(),
    collateral: l.collateral ? {
      ...l.collateral,
      referenceId: l.collateral.referenceId?.toString()
    } : undefined
  }));

  return (
    <div className="h-full w-full bg-surface">
      <LoanDashboardClient eligibility={eligibility} loans={loans} />
    </div>
  );
}
