import { NextResponse } from "next/server";
import { TwiML } from "@/lib/twilio/twiml";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://techverse-mu-five.vercel.app";

export async function POST(request: Request) {
  const twiml = new TwiML();

  try {
    // Parse Twilio's x-www-form-urlencoded body
    const body = await request.text();
    const params = new URLSearchParams(body);
    const callSid = params.get("CallSid") || "unknown";
    const from = params.get("From") || "unknown";

    console.log(`[IVR] Incoming call: CallSid=${callSid}, From=${from}`);

    // Log the call to DB (non-blocking, non-fatal)
    try {
      const { default: dbConnect } = await import("@/lib/db/mongoose");
      await dbConnect();
      const { IvrCall } = await import("@/models/IvrCall");
      await IvrCall.findOneAndUpdate(
        { callSid },
        { callSid, callerPhone: from, actionTaken: "menu_navigated" },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.error("[IVR] DB log error (non-fatal):", dbErr);
    }

    // Build the IVR menu
    const gather = twiml.gather({
      numDigits: 1,
      action: `${BASE_URL}/api/twilio/handle-input`,
      method: "POST",
      timeout: 10,
    });

    gather.say(
      "Welcome to Krishi Hub. " +
      "Press 1 for warehouse details. " +
      "Press 2 to hear crop prices. " +
      "Press 3 to book storage slots. " +
      "Press 4 to check booking status.",
      { language: "en-IN", voice: "Polly.Aditi" }
    );

    // If no input, replay menu
    twiml.redirect(`${BASE_URL}/api/twilio/ivr`);

  } catch (error) {
    console.error("[IVR] Fatal error:", error);
    twiml.say("We are experiencing technical difficulties. Please try again later.");
    twiml.hangup();
  }

  return new NextResponse(twiml.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "Cache-Control": "no-cache, no-store",
    },
  });
}

// GET handler for Twilio webhook validation & browser testing
export async function GET() {
  const twiml = new TwiML();
  twiml.say("AgriHold IVR is online. This endpoint requires a POST request from Twilio.");
  return new NextResponse(twiml.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}
