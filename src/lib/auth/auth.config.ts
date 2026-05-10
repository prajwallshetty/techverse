import type { NextAuthConfig } from "next-auth";

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
        token.role = (user as any).role || null;
        token.phone = (user as any).phone || null;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
        session.user.id = token.sub as string;
        session.user.phone = token.phone as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
