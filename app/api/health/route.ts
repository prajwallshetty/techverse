import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "AgriHold AI",
    services: {
      mongodb: Boolean(env.MONGODB_URI),
      auth: Boolean(env.AUTH_SECRET || env.NEXTAUTH_SECRET),
    },
    timestamp: new Date().toISOString(),
  });
}
