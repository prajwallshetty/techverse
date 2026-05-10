import Pusher from "pusher-js";

// Workaround for Next.js Turbopack ESM/CJS interop and SSR
const PusherClass = (Pusher as any).default || Pusher;

export const pusherClient = typeof window !== "undefined" 
  ? new PusherClass(
      process.env.NEXT_PUBLIC_PUSHER_KEY || "MOCK_KEY",
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      }
    )
  : (null as any);
