import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIvrCall extends Document {
  callSid: string;
  callerPhone: string;
  durationSeconds?: number;
  actionTaken: "menu_navigated" | "search_warehouse" | "price_check" | "booking_created" | "status_check" | "failed";
  language: "en" | "hi" | "kn" | "tu";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IvrCallSchema: Schema<IIvrCall> = new Schema(
  {
    callSid: { type: String, required: true, unique: true },
    callerPhone: { type: String, required: true, index: true },
    durationSeconds: { type: Number },
    actionTaken: { 
      type: String, 
      enum: ["menu_navigated", "search_warehouse", "price_check", "booking_created", "status_check", "failed"],
      required: true,
      default: "menu_navigated"
    },
    language: {
      type: String,
      enum: ["en", "hi", "kn", "tu"],
      default: "en"
    },
    notes: { type: String }
  },
  { timestamps: true }
);

export const IvrCall: Model<IIvrCall> =
  mongoose.models.IvrCall || mongoose.model<IIvrCall>("IvrCall", IvrCallSchema);
