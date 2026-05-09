import { NextResponse } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/db/mongoose";
import { Loan } from "@/models/Loan";
import { Booking } from "@/models/Booking";
import { auth } from "@/lib/auth";
import { CreditEngine } from "@/lib/loans/credit-engine";

// Validation for checking eligibility
const checkSchema = z.object({
  bookingId: z.string().min(1),
  cropType: z.string().min(1),
  quantity: z.number().min(0.1),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = checkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const { bookingId, cropType, quantity } = parsed.data;

    // 1. Calculate values using our Smart Credit Engine
    const cropValue = CreditEngine.calculateCropValue(cropType, quantity);
    const eligibleAmount = CreditEngine.estimateLoanAmount(cropValue);
    const repaymentDate = CreditEngine.calculateRepaymentDate();
    const transactionId = CreditEngine.generateTransactionId();

    await dbConnect();

    // 2. Save the loan document (Simulating instant payout/approval)
    const loan = new Loan({
      borrowerId: session.user.id,
      bookingId,
      cropType,
      quantity,
      cropValue,
      eligibleAmount,
      loanStatus: "active",
      repaymentStatus: "pending",
      repaymentDate,
      transactionId,
    });

    await loan.save();

    return NextResponse.json({
      success: true,
      message: "₹" + eligibleAmount.toLocaleString() + " credited successfully.",
      loan: {
        id: loan._id,
        eligibleAmount,
        transactionId,
        repaymentDate: repaymentDate.toISOString(),
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error("Loan API Error:", error);
    return NextResponse.json({ error: "Failed to process loan request" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch existing loans for the farmer
    const loans = await Loan.find({ borrowerId: session.user.id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ loans }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
