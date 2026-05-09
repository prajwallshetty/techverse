import { NextResponse } from "next/server";
import { TwiML } from "@/lib/twilio/twiml";

export async function POST(request: Request) {
  const twiml = new TwiML();

  try {
    // Parse Twilio's x-www-form-urlencoded body
    const body = await request.text();
    const params = new URLSearchParams(body);
    const digits = params.get("Digits") || "";
    const callSid = params.get("CallSid") || "unknown";
    const from = params.get("From") || "unknown";

    console.log(`[IVR:handle-input] Digits=${digits}, CallSid=${callSid}, From=${from}`);

    // Connect to DB
    const { default: dbConnect } = await import("@/lib/db/mongoose");
    await dbConnect();

    const { User } = await import("@/models/User");
    const { Warehouse } = await import("@/models/Warehouse");
    const { Booking } = await import("@/models/Booking");
    const { IvrCall } = await import("@/models/IvrCall");

    // Try to find farmer by phone
    const farmer = await User.findOne({ phone: from, role: "farmer" });

    switch (digits) {
      case "1": {
        // Warehouse details
        try { await IvrCall.updateOne({ callSid }, { actionTaken: "search_warehouse" }); } catch (_) {}

        const warehouse = await Warehouse.findOne({ isActive: true });
        if (warehouse) {
          const available = warehouse.capacityTons - warehouse.currentStockTons;
          twiml.say(
            `The nearest warehouse is ${warehouse.name} in ${warehouse.location}. It currently has ${available} tons of available capacity. Cold storage slots are available.`,
            { language: "en-IN", voice: "Polly.Aditi" }
          );
        } else {
          twiml.say("Sorry, no active warehouses found in your region.", { language: "en-IN", voice: "Polly.Aditi" });
        }
        break;
      }

      case "2": {
        // Crop prices
        try { await IvrCall.updateOne({ callSid }, { actionTaken: "price_check" }); } catch (_) {}

        twiml.say(
          "Today's market prices are: Wheat is 2450 rupees per quintal. Paddy is 2100 rupees per quintal. Onion is 92 rupees per kilogram. Prices are trending upwards.",
          { language: "en-IN", voice: "Polly.Aditi" }
        );
        break;
      }

      case "3": {
        // Book storage slot
        try { await IvrCall.updateOne({ callSid }, { actionTaken: "booking_created" }); } catch (_) {}

        const warehouse = await Warehouse.findOne({ isActive: true });

        if (!farmer) {
          twiml.say(
            "We could not find a registered farmer account for this phone number. Please register via the website to make a booking.",
            { language: "en-IN", voice: "Polly.Aditi" }
          );
        } else if (warehouse) {
          // Atomic reservation
          const updatedWarehouse = await Warehouse.findOneAndUpdate(
            { _id: warehouse._id, currentStockTons: { $lte: warehouse.capacityTons - 1 } },
            { $inc: { currentStockTons: 1 } },
            { new: true }
          );

          if (updatedWarehouse) {
            const booking = await Booking.create({
              farmerId: farmer._id,
              warehouseId: warehouse._id,
              cropName: "Wheat",
              quantityTons: 1,
              totalPrice: warehouse.pricePerTonPerWeek,
              status: "confirmed",
              source: "ivr",
              isAutoSellEnabled: false,
            });

            // Realtime sync (non-blocking, non-fatal)
            try {
              const { pusherServer } = await import("@/lib/pusher/server");
              await pusherServer.trigger("ivr-channel", "new-ivr-booking", {
                bookingId: booking._id,
                warehouse: warehouse.name,
                farmerPhone: from,
                tons: 1,
              });
            } catch (pushErr) {
              console.error("[IVR] Pusher sync error (non-fatal):", pushErr);
            }

            twiml.say(
              `Success! Your booking for 1 ton of Wheat at ${warehouse.name} is confirmed. You will receive an SMS shortly.`,
              { language: "en-IN", voice: "Polly.Aditi" }
            );
          } else {
            twiml.say("Sorry, the warehouse is currently full. Booking could not be completed.", { language: "en-IN", voice: "Polly.Aditi" });
          }
        } else {
          twiml.say("Sorry, no active warehouses are available for booking at the moment.", { language: "en-IN", voice: "Polly.Aditi" });
        }
        break;
      }

      case "4": {
        // Booking status
        try { await IvrCall.updateOne({ callSid }, { actionTaken: "status_check" }); } catch (_) {}

        if (!farmer) {
          twiml.say("No farmer account found for this phone number. Please register on our website.", { language: "en-IN", voice: "Polly.Aditi" });
        } else {
          const bookings = await Booking.find({ farmerId: farmer._id, status: "confirmed" });
          if (bookings.length > 0) {
            const totalTons = bookings.reduce((acc, b) => acc + b.quantityTons, 0);
            twiml.say(
              `You currently have ${totalTons} tons of crops stored across our warehouses in ${bookings.length} active bookings.`,
              { language: "en-IN", voice: "Polly.Aditi" }
            );
          } else {
            twiml.say("You have no active bookings at the moment.", { language: "en-IN", voice: "Polly.Aditi" });
          }
        }
        break;
      }

      default:
        twiml.say("Invalid input. Please call back and try again.", { language: "en-IN", voice: "Polly.Aditi" });
        break;
    }

    twiml.pause(1);
    twiml.say("Thank you for using AgriHold A I. Goodbye!", { language: "en-IN", voice: "Polly.Aditi" });
    twiml.hangup();

  } catch (error) {
    console.error("[IVR:handle-input] Fatal error:", error);
    twiml.say("Sorry, something went wrong. Please try again later.");
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
