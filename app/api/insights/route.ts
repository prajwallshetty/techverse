import { auth } from "@/lib/auth";
import { apiError, apiOk } from "@/lib/api/responses";
import type { Insight } from "@/types/domain";

export const dynamic = "force-dynamic";

const insights: Insight[] = [
  {
    id: "yield-forecast",
    label: "Yield forecast",
    value: "+18.4%",
    trend: "Projected uplift from irrigation timing and nutrient plan.",
    status: "low",
  },
  {
    id: "water-risk",
    label: "Water stress",
    value: "23 plots",
    trend: "Satellite anomaly indicates intervention window within 6 days.",
    status: "medium",
  },
  {
    id: "market-signal",
    label: "Market signal",
    value: "Hold",
    trend: "Regional mandi prices are trending upward for late harvest lots.",
    status: "low",
  },
];

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return apiError("Authentication required.", 401);
  }

  return apiOk(insights);
}
