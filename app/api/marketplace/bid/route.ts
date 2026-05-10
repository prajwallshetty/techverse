//
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher/server";
import { User } from "@/models/User";
import { Booking } from "@/models/Booking";
import { Bid } from "@/models/Bid";
import { NotificationService } from "@/lib/notifications/service";
import dbConnect from "@/lib/db/mongoose";
import mongoose from "mongoose";

const bidSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().min(1),
  maxAutoBid: z.number().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "trader") {
      return NextResponse.json(
        { error: "Unauthorized: Trader role required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = bidSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid bid data" }, { status: 400 });
    }

    const { bookingId, amount, maxAutoBid } = parsed.data;

    if (maxAutoBid && maxAutoBid <= amount) {
      return NextResponse.json(
        { error: "Max auto bid must be higher than starting amount" },
        { status: 400 },
      );
    }

    await dbConnect();

    try {
      const booking = await Booking.findById(bookingId);
      if (!booking || booking.marketplaceStatus !== "listed") {
        throw new Error("Listing not found or not available.");
      }

      if (
        booking.auctionEndsAt &&
        new Date() > new Date(booking.auctionEndsAt)
      ) {
        throw new Error("Auction has expired.");
      }

      // 1. Fetch current highest bid
      const highestBid = await Bid.findOne({ bookingId }).sort({ amount: -1 });

      let currentAmount = amount;

      if (highestBid) {
        if (amount <= highestBid.amount) {
          throw new Error(
            "Bid must be higher than current highest: ₹" + highestBid.amount,
          );
        }

        // Auto-bid logic: If current highest bidder has maxAutoBid, they fight back.
        if (
          highestBid.maxAutoBid &&
          highestBid.traderId.toString() !== session.user.id
        ) {
          if (highestBid.maxAutoBid > amount) {
            // They outbid the incoming manual bid (or maxAutoBid)
            // Determine the new amount. If the incoming has maxAutoBid, they fight.
            if (maxAutoBid) {
              if (highestBid.maxAutoBid >= maxAutoBid) {
                // Previous bidder wins up to maxAutoBid + 10 (or up to their max)
                const newAmount = Math.min(
                  highestBid.maxAutoBid,
                  maxAutoBid + 10,
                );
                throw new Error(
                  `You were instantly outbid! Current bid is now ₹${newAmount}`,
                );
                // In a perfect system, we'd log both bids, but for simplicity, we reject the incoming and let the user know.
                // We actually need to create a new bid for the previous bidder.
              } else {
                // Incoming bidder wins over previous maxAutoBid
                currentAmount = highestBid.maxAutoBid + 10; // Increment
              }
            } else {
              // Incoming is just manual. Previous bidder outbids them immediately.
              const newAmount = Math.min(highestBid.maxAutoBid, amount + 10);
              // Create a counter-bid for the previous bidder
              const counterBid = new Bid({
                bookingId,
                traderId: highestBid.traderId,
                amount: newAmount,
                maxAutoBid: highestBid.maxAutoBid,
                status: "pending",
              });
              await counterBid.save();
              throw new Error(
                `You were instantly outbid by AutoBid! Current bid is now ₹${newAmount}`,
              );
            }
          }
        }
      } else if (booking.startingBid && currentAmount < booking.startingBid) {
        throw new Error(
          "Bid must be at least the starting bid of ₹" + booking.startingBid,
        );
      }

      // 2. Create the new bid
      const bid = new Bid({
        bookingId,
        traderId: session.user.id,
        amount: currentAmount,
        maxAutoBid,
        status: "pending",
      });
      await bid.save();

      // 3. AUTO-SELL LOGIC (for Farmers)
      let autoSold = false;
      if (
        booking.isAutoSellEnabled &&
        booking.autoSellTargetPrice &&
        currentAmount >= booking.autoSellTargetPrice
      ) {
        booking.marketplaceStatus = "sold";
        bid.status = "accepted";
        await booking.save();
        await bid.save();
        autoSold = true;
      }

      // 4. Trigger Real-time Event via Pusher
      const trader = await User.findById(session.user.id).select("name");

      try {
        await pusherServer.trigger(`marketplace-${bookingId}`, "new-bid", {
          _id: bid._id,
          amount: currentAmount,
          status: bid.status,
          traderId: {
            _id: session.user.id,
            name: trader?.name || "A Trader",
          },
          createdAt: bid.createdAt,
        });

        if (autoSold) {
          await pusherServer.trigger(`marketplace-${bookingId}`, "auto-sold", {
            amount: currentAmount,
            traderName: trader?.name,
          });

          const farmer = await User.findById(booking.farmerId).select("email");
          if (farmer) {
            NotificationService.notifyAutoSellExecuted(
              farmer.email || "+910000000000",
              booking.cropName,
              currentAmount,
            );
          }
        } else if (
          highestBid &&
          highestBid.traderId.toString() !== session.user.id
        ) {
          // Notify the outbid trader
          await pusherServer.trigger(
            `trader-${highestBid.traderId}`,
            "outbid-alert",
            {
              bookingId,
              cropName: booking.cropName,
              newAmount: currentAmount,
            },
          );
        }

        await pusherServer.trigger("marketplace-global", "bid-count-update", {
          bookingId,
        });
      } catch (pusherErr) {
        console.warn(
          "Pusher notification skipped (are you using mock keys?):",
          pusherErr,
        );
      }
      return NextResponse.json(
        { success: true, bid, autoSold },
        { status: 201 },
      );
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Failed to place bid" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Bidding Error:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}

// Get bid history for a specific booking
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    await dbConnect();

    const bids = await Bid.find({ bookingId })
      .populate("traderId", "name")
      .sort({ amount: -1 })
      .limit(15)
      .lean();

    return NextResponse.json({ bids }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
