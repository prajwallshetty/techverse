import { NextResponse } from "next/server";
import { z } from "zod";
import { usersCollection, otpsCollection } from "@/lib/db/collections";

const sendOtpSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = sendOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid phone number." },
        { status: 400 },
      );
    }

    const { phone } = parsed.data;

    // Check if farmer exists
    const users = await usersCollection();
    const farmer = await users.findOne({
      phone,
      role: "farmer",
      isActive: true,
    });

    if (!farmer) {
      return NextResponse.json(
        { error: "No farmer account found with this phone number." },
        { status: 404 },
      );
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP (upsert so repeated requests replace the old OTP)
    const otps = await otpsCollection();
    await otps.updateOne(
      { phone },
      {
        $set: {
          code,
          expiresAt,
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );

    // In production, send SMS via Twilio / AWS SNS / etc.
    // For development, we return the OTP in the response
    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
      ...(isDev ? { otp: code } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 },
    );
  }
}
