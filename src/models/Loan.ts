import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILoan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  interestRate: number;
  termMonths: number;
  status: "applied" | "approved" | "active" | "closed" | "defaulted";
  collateral?: {
    type: "crop" | "warehouse_receipt" | "land";
    referenceId: mongoose.Types.ObjectId;
    estimatedValue: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema<ILoan> = new Schema(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    interestRate: { type: Number, required: true, min: 0 },
    termMonths: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["applied", "approved", "active", "closed", "defaulted"],
      default: "applied",
      index: true,
    },
    collateral: {
      type: { type: String, enum: ["crop", "warehouse_receipt", "land"] },
      referenceId: { type: Schema.Types.ObjectId },
      estimatedValue: { type: Number },
    },
  },
  { timestamps: true }
);

export const Loan: Model<ILoan> =
  mongoose.models.Loan || mongoose.model<ILoan>("Loan", LoanSchema);
