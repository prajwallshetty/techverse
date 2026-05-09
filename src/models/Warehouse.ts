import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWarehouse extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  location: string;
  capacityTons: number;
  currentStockTons: number;
  availableCapacity: number; // Virtual field
  certifications?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema: Schema<IWarehouse> = new Schema(
  {
    ownerId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    name: { type: String, required: true },
    location: { type: String, required: true, index: true },
    capacityTons: { type: Number, required: true, min: 0 },
    currentStockTons: { 
      type: Number, 
      default: 0, 
      min: 0,
      validate: {
        validator: function (this: any, v: number) {
          if (!this || this.capacityTons === undefined) return true;
          return v <= this.capacityTons;
        },
        message: "Current stock cannot exceed total capacity.",
      }
    },
    certifications: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

WarehouseSchema.virtual("availableCapacity").get(function () {
  return this.capacityTons - this.currentStockTons;
});

export const Warehouse: Model<IWarehouse> =
  mongoose.models.Warehouse || mongoose.model<IWarehouse>("Warehouse", WarehouseSchema);
