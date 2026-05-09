import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  role: "farmer" | "warehouse_owner" | "trader" | "admin";
  isActive: boolean;
  trustScore: number;
  location?: string;
  farmDetails?: {
    region?: string;
    acreage?: number;
    primaryCrop?: string;
  };
  warehouseDetails?: {
    location?: string;
    capacityTons?: number;
    warehouseCode?: string;
  };
  traderDetails?: {
    licenseNumber?: string;
    tradingRegions?: string[];
  };
  emailVerified?: Date;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}


const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { 
      type: String, 
      unique: true, 
      sparse: true, 
      lowercase: true, 
      trim: true 
    },
    phone: { 
      type: String, 
      unique: true, 
      sparse: true 
    },
    passwordHash: { type: String },
    role: {
      type: String,
      enum: ["farmer", "warehouse_owner", "trader", "admin"],
      required: true,
      index: true,
    },
    isActive: { type: Boolean, default: true },
    trustScore: { type: Number, default: 80, min: 0, max: 100 },
    location: { type: String },
    farmDetails: {
      region: String,
      acreage: Number,
      primaryCrop: String,
    },
    warehouseDetails: {
      location: String,
      capacityTons: Number,
      warehouseCode: String,
    },
    traderDetails: {
      licenseNumber: String,
      tradingRegions: [String],
    },
    emailVerified: { type: Date },
    verificationToken: { type: String },
  },
  { timestamps: true }
);


export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
