import { NextResponse } from "next/server";
import { z } from "zod";
import { otpsCollection } from "@/lib/db/collections";

const verifyOtpSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request. Phone and 6-digit OTP are required." },
        { status: 400 },
      );
    }

    const { phone, otp } = parsed.data;

    const otps = await otpsCollection();
    const otpDoc = await otps.findOne({
      phone,
      code: otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpDoc) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
      phone,
    });
  } catch {
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}
