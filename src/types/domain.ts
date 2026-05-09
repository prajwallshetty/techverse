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
