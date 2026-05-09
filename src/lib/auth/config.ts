import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { getMongoClientPromise } from "@/lib/db/mongodb";
import { env } from "@/lib/env";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const authConfig = {
  adapter: MongoDBAdapter(getMongoClientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const isDemoUser =
          parsed.data.email === env.DEMO_EMAIL &&
          (await bcrypt.compare(
            parsed.data.password,
            await bcrypt.hash(env.DEMO_PASSWORD, 10),
          ));

        if (!isDemoUser) {
          return null;
        }

        return {
          id: "demo-founder",
          email: env.DEMO_EMAIL,
          name: "AgriHold Founder",
          role: "founder",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = "founder";
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "demo-founder";
        session.user.role = String(token.role ?? "operator");
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
