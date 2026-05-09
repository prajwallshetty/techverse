import "next-auth";
import type { UserRole } from "@/types/domain";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      phone?: string | null;
      image?: string | null;
      role?: UserRole;
    };
  }

  interface User {
    role?: UserRole;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    phone?: string | null;
  }
}
