import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
  bidId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  cropId: mongoose.Types.ObjectId;
  amount: number;
  paymentStatus: "pending" | "completed" | "failed";
  fulfillmentStatus: "pending" | "transit" | "delivered";
  transactionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema<ITransaction> = new Schema(
  {
    bidId: { type: Schema.Types.ObjectId, ref: "Bid", required: true },
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    cropId: { type: Schema.Types.ObjectId, ref: "Crop", required: true },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },
    fulfillmentStatus: {
      type: String,
      enum: ["pending", "transit", "delivered"],
      default: "pending",
    },
    transactionDate: { type: Date },
  },
  { timestamps: true }
);

export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
