import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  farmerId: mongoose.Types.ObjectId;
  warehouseId: mongoose.Types.ObjectId;
  cropName: string;
  quantityTons: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "expired" | "cancelled" | "completed";
  qrCodeDataUrl?: string;
  marketplaceStatus: "none" | "listed" | "sold";
  autoSellTargetPrice?: number;
  isAutoSellEnabled: boolean;
  auctionEndsAt?: Date;
  startingBid?: number;
  basePrice?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema(
  {
    farmerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true, index: true },
    cropName: { type: String, required: true },
    quantityTons: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "expired", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    qrCodeDataUrl: { type: String },
    marketplaceStatus: {
      type: String,
      enum: ["none", "listed", "sold"],
      default: "listed", // Default to listed for demo purposes
      index: true,
    },
    autoSellTargetPrice: { type: Number },
    isAutoSellEnabled: { type: Boolean, default: false },
    auctionEndsAt: { type: Date },
    startingBid: { type: Number },
    basePrice: { type: Number },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
