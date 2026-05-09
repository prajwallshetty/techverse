import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStorageSlot extends Document {
  warehouseId: mongoose.Types.ObjectId;
  slotNumber: string;
  zone: "A" | "B" | "C"; // A: Cold, B: Dry, C: Grains
  cropTypeRestrictions?: string[];
  capacityKg: number;
  status: "available" | "occupied" | "reserved" | "locked";
  priceMultiplier: number;
  lastLockedAt?: Date;
  lockedBy?: mongoose.Types.ObjectId;
}

const StorageSlotSchema: Schema<IStorageSlot> = new Schema(
  {
    warehouseId: { type: Schema.Types.ObjectId, ref: "Warehouse", required: true, index: true },
    slotNumber: { type: String, required: true },
    zone: { type: String, enum: ["A", "B", "C"], default: "B" },
    cropTypeRestrictions: [{ type: String }],
    capacityKg: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["available", "occupied", "reserved", "locked"], 
      default: "available",
      index: true 
    },
    priceMultiplier: { type: Number, default: 1.0 },
    lastLockedAt: { type: Date },
    lockedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

// Index for unique slot numbers within a warehouse
StorageSlotSchema.index({ warehouseId: 1, slotNumber: 1 }, { unique: true });

export const StorageSlot: Model<IStorageSlot> =
  mongoose.models.StorageSlot || mongoose.model<IStorageSlot>("StorageSlot", StorageSlotSchema);
