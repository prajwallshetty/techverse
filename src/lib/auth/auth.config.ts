import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/domain";

export const authConfig = {
  providers: [], // Providers are defined in index.ts to avoid Edge runtime issues
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user.role || "farmer") as UserRole;
        token.phone = user.phone ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role as UserRole;
        session.user.phone = (token.phone as string) ?? null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
