import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { getMongoClientPromise } from "@/lib/db/mongodb";
import { usersCollection } from "@/lib/db/collections";
import type { UserRole } from "@/types/domain";

const emailCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(getMongoClientPromise),
  providers: [
    Google({
      clientId: process.env.MAIL_CLIENT_ID,
      clientSecret: process.env.MAIL_CLIENT_SECRET,
      // Don't hardcode role — let the signIn callback handle it
    }),
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = emailCredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const users = await usersCollection();
        const user = await users.findOne({
          email: parsed.data.email.toLowerCase().trim(),
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!isValid) return null;

        return {
          id: user._id!.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    /**
     * signIn callback — runs for ALL providers.
     * For Google: checks if a user with this email already exists in our DB.
     * If yes, we let them through (the jwt callback will pick up their existing role).
     * If no, they're a brand-new user — the adapter will create them, and
     * the jwt callback will detect missing role and flag for onboarding.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const users = await usersCollection();
        const existingUser = await users.findOne({
          email: user.email.toLowerCase().trim(),
        });

        if (existingUser) {
          // Merge: link Google account to existing user by updating their record
          // This prevents duplicate users for same email
          await users.updateOne(
            { email: user.email.toLowerCase().trim() },
            {
              $set: {
                image: user.image || existingUser.image,
                updatedAt: new Date(),
              },
              $setOnInsert: { createdAt: new Date() },
            }
          );
        }
        // If no existing user, the MongoDBAdapter will create one (without role)
      }
      return true;
    },

    /**
     * JWT callback — always resolves role from MongoDB.
     * This ensures Google and Credentials users get identical tokens.
     */
    async jwt({ token, user, trigger }) {
      // On initial sign-in, attach role from the user object (credentials provider)
      if (user) {
        token.role = (user as any).role || null;
        token.phone = (user as any).phone ?? null;
      }

      // Always re-fetch role from DB to stay in sync
      // (handles role changes, onboarding completion, etc.)
      if (token.email) {
        try {
          const users = await usersCollection();
          const dbUser = await users.findOne({
            email: (token.email as string).toLowerCase().trim(),
          });
          if (dbUser) {
            token.role = dbUser.role || null;
            token.sub = dbUser._id!.toString();
            token.phone = dbUser.phone ?? null;
          }
        } catch (err) {
          console.error("[Auth] JWT role lookup error:", err);
        }
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole) ?? null;
        session.user.phone = (token.phone as string) ?? null;
      }
      return session;
    },
  },
});
