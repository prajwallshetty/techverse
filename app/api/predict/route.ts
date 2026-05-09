import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePrediction } from "@/lib/ai/predict";

const predictRequestSchema = z.object({
  crop: z.string().min(1),
  currentPrice: z.number().positive(),
  quantityTons: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = predictRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request format. Require crop, currentPrice, and quantityTons." },
        { status: 400 }
      );
    }

    const prediction = generatePrediction(parsed.data);

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate AI prediction." },
      { status: 500 }
    );
  }
}
