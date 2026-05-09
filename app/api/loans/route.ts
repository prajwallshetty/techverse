import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongoose";
import { Loan } from "@/models/Loan";
import { Booking } from "@/models/Booking";
import { auth } from "@/lib/auth";
import { DecentroAPI } from "@/lib/decentro";

// Fetch eligibility and loan history
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Fetch all 'confirmed' bookings to calculate total collateral
    const activeBookings = await Booking.find({ 
      farmerId: session.user.id,
      status: "confirmed"
    }).lean();

    const totalCollateralValue = activeBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    // 2. Query Decentro API for eligibility based on total collateral
    const eligibility = await DecentroAPI.checkEligibility(totalCollateralValue);

    // 3. Fetch existing loans
    const loans = await Loan.find({ farmerId: session.user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ 
      eligibility: {
        ...eligibility,
        totalCollateralValue
      }, 
      loans 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Apply for a loan
const applySchema = z.object({
  amount: z.number().min(5000),
  totalCollateralValue: z.number().min(0),
});

export async function POST(request: Request) {
  try {
    const sessionToken = await auth();
    if (!sessionToken?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid loan request." }, { status: 400 });
    }

    const { amount, totalCollateralValue } = parsed.data;

    // Verify Eligibility Server-Side
    const eligibility = await DecentroAPI.checkEligibility(totalCollateralValue);
    
    if (!eligibility.isEligible || amount > eligibility.maxEligibleAmount) {
      return NextResponse.json({ error: "Requested amount exceeds eligible limit." }, { status: 400 });
    }

    await dbConnect();

    // In a real scenario, we'd pick a specific Booking ID as collateral. For now, we aggregate.
    const decentroRes = await DecentroAPI.originateLoan(amount, sessionToken.user.id, "AGGREGATED_CROP_VALUE");

    if (!decentroRes.success) {
      throw new Error(decentroRes.message);
    }

    // Save the loan to our MongoDB
    const loan = new Loan({
      borrowerId: sessionToken.user.id,
      amount: amount,
      interestRate: eligibility.interestRate,
      termMonths: 12, // Default term
      status: decentroRes.status === "approved" ? "active" : "applied",
      collateral: {
        type: "crop",
        estimatedValue: totalCollateralValue,
      }
    });

    await loan.save();

    return NextResponse.json({ success: true, loan }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Loan origination failed." }, { status: 500 });
  }
}
