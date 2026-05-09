import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId; // Reference to the stored crop
  cropType: string;
  quantity: number;
  cropValue: number;
  eligibleAmount: number;
  loanStatus: "applied" | "approved" | "active" | "closed" | "defaulted";
  repaymentStatus: "pending" | "paid" | "overdue";
  repaymentDate: Date;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema<ILoan> = new Schema(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    cropType: { type: String, required: true },
    quantity: { type: Number, required: true },
    cropValue: { type: Number, required: true },
    eligibleAmount: { type: Number, required: true },
    loanStatus: {
      type: String,
      enum: ["applied", "approved", "active", "closed", "defaulted"],
      default: "active", // In mock system, auto-approved
      index: true,
    },
    repaymentStatus: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    repaymentDate: { type: Date, required: true },
    transactionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Loan: Model<ILoan> =
  mongoose.models.Loan || mongoose.model<ILoan>("Loan", LoanSchema);
