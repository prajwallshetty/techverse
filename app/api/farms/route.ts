import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { farmsCollection } from "@/lib/db/collections";
import { apiError, apiOk, mapApiError } from "@/lib/api/responses";

export const dynamic = "force-dynamic";

const farmSchema = z.object({
  name: z.string().min(2),
  region: z.string().min(2),
  acreage: z.coerce.number().positive(),
  primaryCrop: z.string().min(2),
  soilHealthScore: z.coerce.number().min(0).max(100),
  irrigationCoverage: z.coerce.number().min(0).max(100),
  risk: z.enum(["low", "medium", "high"]),
});

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return apiError("Authentication required.", 401);
  }

  try {
    const farms = await (await farmsCollection())
      .find({ ownerId: session.user.id })
      .sort({ updatedAt: -1 })
      .limit(50)
      .toArray();

    return apiOk(farms);
  } catch (error) {
    return mapApiError(error);
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return apiError("Authentication required.", 401);
  }

  try {
    const payload = farmSchema.parse(await request.json());
    const now = new Date();
    const result = await (await farmsCollection()).insertOne({
      ...payload,
      ownerId: session.user.id,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { data: { id: result.insertedId.toString(), ...payload } },
      { status: 201 },
    );
  } catch (error) {
    return mapApiError(error);
  }
}
