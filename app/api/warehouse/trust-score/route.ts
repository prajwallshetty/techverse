import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Warehouse } from "@/models/Warehouse";
import { UserActivity } from "@/models/UserActivity";
import { calculateOwnerTrustScore } from "@/lib/ai/gemini";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "warehouse_owner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const ownerId = session.user.id;
    const [owner, warehouse] = await Promise.all([
      User.findById(ownerId),
      Warehouse.findOne({ ownerId }),
    ]);

    // If user is missing from DB (e.g. wiped during testing), we just use dummy data
    // instead of throwing a 404, keeping the dashboard UI working seamlessly.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [activities, bookings] = await Promise.all([
      UserActivity.find({ userId: ownerId, createdAt: { $gte: thirtyDaysAgo } }),
      warehouse ? Booking.find({ warehouseId: warehouse._id }) : Promise.resolve([]),
    ]);

    // Build raw data payload for the AI engine
    const rawData = {
      owner_id: ownerId,
      metadata: {
        name: owner?.name || "Demo User",
        registration_date: owner?.createdAt || new Date(),
        warehouse_name: warehouse?.name || "Not Set",
        warehouse_location: warehouse?.location || "Unknown",
      },
      pillars_raw_data: {
        // Pillar 1: Platform Presence
        active_days_last_30: activities.length > 0
          ? new Set(activities.map(a => new Date(a.createdAt).toDateString())).size
          : 0,
        fast_response: false, // Not tracked yet — will default to a neutral value
        
        // Pillar 2: Booking Fulfillment
        bookings: {
          total_received: bookings.length,
          completed: bookings.filter(b => b.status === "completed").length,
          cancelled_by_owner: 0, // No cancel-by-owner tracking yet
          disputes: 0,
        },

        // Pillar 3: Facility Compliance
        certifications: {
          fssai: (warehouse?.certifications || []).some((c: string) => c.toLowerCase().includes("fssai")),
          iso: (warehouse?.certifications || []).some((c: string) => c.toLowerCase().includes("iso")),
          fire_safety: (warehouse?.certifications || []).some((c: string) => c.toLowerCase().includes("fire")),
          pest_control: (warehouse?.certifications || []).some((c: string) => c.toLowerCase().includes("pest")),
          cold_chain: (warehouse?.certifications || []).some((c: string) => c.toLowerCase().includes("cold")),
          insurance: (warehouse?.certifications || []).some((c: string) => c.toLowerCase().includes("insurance")),
          all_certifications: warehouse?.certifications || [],
        },

        // Pillar 4: Farmer Feedback (No review model yet — neutral)
        reviews: {
          count: 0,
          average_rating: null,
          disputes_resolved: 0,
        },

        // Pillar 5: Capacity & Transparency
        transparency: {
          no_overbooking_events: true,
          price_listed: !!warehouse?.pricePerTonPerWeek,
          photos_uploaded: false, // No photo model yet
          gps_verified: !!(warehouse?.latitude && warehouse?.longitude),
          certifications_uploaded: (warehouse?.certifications || []).length > 0,
          inquiry_response_rate: 0,
        },
      },
      activity_log: activities.map(a => ({ type: a.type, date: a.createdAt })),
    };

    const trustData = await calculateOwnerTrustScore(rawData);

    // Persist computed score back to the Warehouse so the farmer gallery can sort/display it
    if (warehouse && trustData?.score?.total !== undefined) {
      await Warehouse.findByIdAndUpdate(warehouse._id, {
        trustScore: trustData.score.total,
        trustTier: trustData.score.tier,
        trustUpdatedAt: new Date(),
      });
    }

    return NextResponse.json(trustData);
  } catch (error: any) {
    console.error("Owner Trust Score Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
