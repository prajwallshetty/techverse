import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: "bid" | "system" | "alert" | "transaction";
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["bid", "system", "alert", "transaction"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false, index: true },
    link: { type: String },
  },
  { timestamps: true }
);

// TTL index to automatically delete notifications after 90 days (7776000 seconds)
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
