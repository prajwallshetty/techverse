import { NextResponse } from "next/server";
import { IVRService } from "@/lib/ivr/service";
import dbConnect from "@/lib/db/mongoose";
import { CallLog } from "@/models/CallLog";

const responseXML = (message: string) => `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say>${message}</Say>
    <Say>Thank you for using Agri Hold AI. Goodbye.</Say>
    <Hangup />
</Response>`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const digits = formData.get("Digits");
    const callerId = formData.get("From") as string || "unknown";

    let message = "Invalid input. Please try again.";

    // 1. Identify User
    const user = await IVRService.identifyUser(callerId);

    // 2. Route based on Keypad Input
    switch (digits) {
      case "1":
        message = await IVRService.getNearbyWarehouse();
        break;
      case "2":
        message = IVRService.getLatestPrices();
        break;
      case "3":
        if (!user) message = "You are not a registered farmer. Please register on our website to check loan eligibility.";
        else message = await IVRService.getLoanEligibility(user._id.toString());
        break;
      case "4":
        if (!user) message = "Please register to track your marketplace listings.";
        else message = await IVRService.getMarketplaceStatus(user._id.toString());
        break;
    }

    // 3. Record the interaction for Admin Monitoring
    await dbConnect();
    await CallLog.create({
      callerId,
      farmerId: user?._id,
      digitsPressed: digits?.toString() || "0",
      serviceRequested: 
        digits === "1" ? "WAREHOUSE" : 
        digits === "2" ? "PRICES" : 
        digits === "3" ? "LOANS" : 
        digits === "4" ? "MARKETPLACE" : "UNKNOWN",
      status: "completed",
      timestamp: new Date()
    });

    return new NextResponse(responseXML(message), {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    return new NextResponse(responseXML("We are experiencing technical difficulties. Please call back later."), {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
