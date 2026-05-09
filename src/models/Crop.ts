import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICrop extends Document {
  farmerId: mongoose.Types.ObjectId;
  warehouseId?: mongoose.Types.ObjectId;
  name: string;
  variety?: string;
  quantityTons: number;
  quality?: "Grade A" | "Grade B" | "Grade C";
  moistureLevel?: number;
  harvestDate?: Date;
  autoSellEnabled: boolean;
  targetPrice?: number;
  status: "growing" | "harvested" | "in_storage" | "sold";
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema: Schema<ICrop> = new Schema(
  {
    farmerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    warehouseId: { 
      type: Schema.Types.ObjectId, 
      ref: "Warehouse" 
    },
    name: { type: String, required: true },
    variety: { type: String },
    quantityTons: { type: Number, required: true, min: 0 },
    quality: { 
      type: String, 
      enum: ["Grade A", "Grade B", "Grade C"],
      index: true 
    },
    moistureLevel: { type: Number },
    harvestDate: { type: Date },
    autoSellEnabled: { type: Boolean, default: false },
    targetPrice: { type: Number },
    status: {
      type: String,
      enum: ["growing", "harvested", "in_storage", "sold"],
      default: "growing",
      index: true
    },
  },
  { timestamps: true }
);

export const Crop: Model<ICrop> =
  mongoose.models.Crop || mongoose.model<ICrop>("Crop", CropSchema);
