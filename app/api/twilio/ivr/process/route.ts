import { NextResponse } from "next/server";
import { VoiceResponse } from "@/lib/twilio/client";
import dbConnect from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Warehouse } from "@/models/Warehouse";
import { Booking } from "@/models/Booking";
import { IvrCall } from "@/models/IvrCall";
import { pusherServer } from "@/lib/pusher/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const digits = formData.get("Digits") as string;
    const callSid = formData.get("CallSid") as string;
    const from = formData.get("From") as string; // Usually +91...

    await dbConnect();
    const twiml = new VoiceResponse();

    // Try to find farmer by phone
    const farmer = await User.findOne({ phone: from, role: "farmer" });

    switch (digits) {
      case "1": {
        // Nearest Warehouse Search
        await IvrCall.updateOne({ callSid }, { actionTaken: "search_warehouse" });
        const warehouse = await Warehouse.findOne({ isActive: true });
        
        if (warehouse) {
          twiml.say(
            { language: "en-IN", voice: "Polly.Aditi" },
            `The nearest warehouse is ${warehouse.name} in ${warehouse.location}. It currently has ${warehouse.capacityTons - warehouse.currentStockTons} tons of available capacity.`
          );
        } else {
          twiml.say("Sorry, no active warehouses found in your region.");
        }
        break;
      }
      
      case "2": {
        // Check Storage Availability
        await IvrCall.updateOne({ callSid }, { actionTaken: "search_warehouse" });
        const warehouse = await Warehouse.findOne({ isActive: true });
        if (warehouse) {
          twiml.say(
            { language: "en-IN", voice: "Polly.Aditi" },
            `The cold storage zone at ${warehouse.name} has available slots. Dry storage is currently full.`
          );
        } else {
          twiml.say("No storage availability data is currently accessible.");
        }
        break;
      }

      case "3": {
        // Hear crop prices
        await IvrCall.updateOne({ callSid }, { actionTaken: "price_check" });
        twiml.say(
          { language: "en-IN", voice: "Polly.Aditi" },
          "Today's market prices are: Wheat is 2450 rupees per quintal. Paddy is 2100 rupees per quintal. Prices are trending upwards."
        );
        break;
      }

      case "4": {
        // Book storage slot (Simplified 1-step booking for MVP)
        await IvrCall.updateOne({ callSid }, { actionTaken: "booking_created" });
        const warehouse = await Warehouse.findOne({ isActive: true });
        
        if (!farmer) {
          twiml.say("We could not find a registered farmer account for this phone number. Please register via the website to make a booking.");
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
              isAutoSellEnabled: false
            });

            // Sync with frontend
            await pusherServer.trigger("ivr-channel", "new-ivr-booking", {
              bookingId: booking._id,
              warehouse: warehouse.name,
              farmerPhone: from,
              tons: 1
            });

            twiml.say(
              { language: "en-IN", voice: "Polly.Aditi" },
              `Success! Your booking for 1 ton of Wheat at ${warehouse.name} is confirmed. You will receive an SMS shortly.`
            );
          } else {
            twiml.say("Sorry, the warehouse is currently full. Booking could not be completed.");
          }
        }
        break;
      }

      case "5": {
        // Booking status
        await IvrCall.updateOne({ callSid }, { actionTaken: "status_check" });
        if (!farmer) {
          twiml.say("No farmer account found for this phone number.");
        } else {
          const bookings = await Booking.find({ farmerId: farmer._id, status: "confirmed" });
          if (bookings.length > 0) {
            const totalTons = bookings.reduce((acc, b) => acc + b.quantityTons, 0);
            twiml.say(`You currently have ${totalTons} tons of crops stored in our warehouses.`);
          } else {
            twiml.say("You have no active bookings at the moment.");
          }
        }
        break;
      }

      default:
        twiml.say("Invalid input.");
        break;
    }

    twiml.pause({ length: 1 });
    twiml.say("Thank you for using AgriHold A I. Goodbye!");
    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("IVR Process Error:", error);
    const twiml = new VoiceResponse();
    twiml.say("An error occurred processing your request.");
    return new NextResponse(twiml.toString(), { headers: { "Content-Type": "text/xml" } });
  }
}
