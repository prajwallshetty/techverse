import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function mapApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError("Invalid request payload.", 400);
  }

  return apiError("Unable to process request right now.", 500);
}
