import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICallLog extends Document {
  callerId: string; // Phone number
  farmerId?: mongoose.Types.ObjectId;
  serviceRequested: "WAREHOUSE" | "PRICES" | "LOANS" | "MARKETPLACE" | "UNKNOWN";
  digitsPressed: string;
  durationSeconds: number;
  status: "completed" | "dropped" | "failed";
  timestamp: Date;
}

const CallLogSchema: Schema<ICallLog> = new Schema(
  {
    callerId: { type: String, required: true, index: true },
    farmerId: { type: Schema.Types.ObjectId, ref: "User" },
    serviceRequested: {
      type: String,
      enum: ["WAREHOUSE", "PRICES", "LOANS", "MARKETPLACE", "UNKNOWN"],
      default: "UNKNOWN",
    },
    digitsPressed: { type: String },
    durationSeconds: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["completed", "dropped", "failed"],
      default: "completed",
    },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const CallLog: Model<ICallLog> =
  mongoose.models.CallLog || mongoose.model<ICallLog>("CallLog", CallLogSchema);
