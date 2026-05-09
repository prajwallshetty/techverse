import { NextResponse } from "next/server";
import { VoiceResponse } from "@/lib/twilio/client";
import dbConnect from "@/lib/db/mongoose";
import { IvrCall } from "@/models/IvrCall";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string;

    await dbConnect();

    // Log the incoming call
    if (callSid && from) {
      // Upsert to handle multiple requests in the same call
      await IvrCall.findOneAndUpdate(
        { callSid },
        { callSid, callerPhone: from, actionTaken: "menu_navigated" },
        { upsert: true, new: true }
      );
    }

    const twiml = new VoiceResponse();

    // Multilingual welcome using standard Twilio voice (Hindi/English combined for now)
    // Tulu/Kannada native voices would require pre-recorded MP3s via <Play>.
    
    const gather = twiml.gather({
      numDigits: 1,
      action: "/api/twilio/ivr/process",
      method: "POST",
      timeout: 10,
    });

    gather.say(
      { language: "en-IN", voice: "Polly.Aditi" },
      "Welcome to AgriHold A I. " +
      "Press 1 to search nearest warehouse. " +
      "Press 2 to check storage availability. " +
      "Press 3 to hear current crop prices. " +
      "Press 4 to book storage slots. " +
      "Press 5 to check booking status."
    );

    // If no input, redirect back to menu
    twiml.redirect("/api/twilio/ivr");

    return new NextResponse(twiml.toString(), {
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("IVR Route Error:", error);
    const twiml = new VoiceResponse();
    twiml.say("We are experiencing technical difficulties. Please try again later.");
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
