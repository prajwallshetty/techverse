import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBid extends Document {
  bookingId: mongoose.Types.ObjectId;
  traderId: mongoose.Types.ObjectId;
  amount: number; // Price per Ton
  maxAutoBid?: number; // Optional max bid for auto-bidding
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema: Schema<IBid> = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    traderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    maxAutoBid: { type: Number },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Bid: Model<IBid> =
  mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);
