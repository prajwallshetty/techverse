/* ─── Roles ─── */
export type UserRole = "farmer" | "warehouse_owner" | "trader" | "admin";

export const USER_ROLES: readonly UserRole[] = [
  "farmer",
  "warehouse_owner",
  "trader",
  "admin",
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  farmer: "Farmer",
  warehouse_owner: "Warehouse Owner",
  trader: "Trader",
  admin: "Admin",
};

export const ROLE_DASHBOARD: Record<UserRole, string> = {
  farmer: "/dashboard/farmer",
  warehouse_owner: "/dashboard/warehouse",
  trader: "/dashboard/trader",
  admin: "/dashboard/admin",
};

/* ─── User Document ─── */
export type User = {
  _id?: string;
  name: string;
  email?: string;
  image?: string;
  phone?: string;
  passwordHash?: string;
  role?: UserRole;
  isActive: boolean;
  /* Role-specific metadata – scalable via optional sub-documents */
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
  emailVerified?: Date | null;
  verificationToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
};




/* ─── Legacy domain types (existing) ─── */
export type CropRisk = "low" | "medium" | "high";

export type FarmHolding = {
  _id?: string;
  ownerId?: string;
  name: string;
  region: string;
  acreage: number;
  primaryCrop: string;
  soilHealthScore: number;
  irrigationCoverage: number;
  risk: CropRisk;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Insight = {
  id: string;
  label: string;
  value: string;
  trend: string;
  status: CropRisk;
};
