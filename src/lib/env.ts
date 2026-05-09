import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  MONGODB_URI: z.string().min(1).optional(),
  MONGODB_DB: z.string().min(1).default("agrihold-ai"),
  DEMO_EMAIL: z.email().default("founder@agrihold.ai"),
  DEMO_PASSWORD: z.string().min(8).default("AgriHoldAI2026"),
});

export const env = envSchema.parse(process.env);

export function getRequiredEnv(key: keyof typeof env) {
  const value = env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}
