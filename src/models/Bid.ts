import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBid extends Document {
  cropId: mongoose.Types.ObjectId;
  traderId: mongoose.Types.ObjectId;
  amountPerTon: number;
  totalAmount: number;
  status: "pending" | "accepted" | "rejected" | "fulfilled";
  counterOffer?: {
    proposedAmountPerTon: number;
    proposedBy: "farmer" | "trader";
    createdAt: Date;
  };
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BidSchema: Schema<IBid> = new Schema(
  {
    cropId: { type: Schema.Types.ObjectId, ref: "Crop", required: true },
    traderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amountPerTon: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "fulfilled"],
      default: "pending",
      index: true,
    },
    counterOffer: {
      proposedAmountPerTon: Number,
      proposedBy: { type: String, enum: ["farmer", "trader"] },
      createdAt: Date,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Compound index to quickly find a specific trader's bids for a crop
BidSchema.index({ cropId: 1, traderId: 1 });

export const Bid: Model<IBid> =
  mongoose.models.Bid || mongoose.model<IBid>("Bid", BidSchema);
