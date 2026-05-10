import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: "login" | "view_price_alert" | "check_booking" | "marketplace_view" | "referral";
  metadata?: any;
  createdAt: Date;
}

const UserActivitySchema: Schema<IUserActivity> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { 
      type: String, 
      enum: ["login", "view_price_alert", "check_booking", "marketplace_view", "referral"],
      required: true,
      index: true
    },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const UserActivity: Model<IUserActivity> =
  mongoose.models.UserActivity || mongoose.model<IUserActivity>("UserActivity", UserActivitySchema);
