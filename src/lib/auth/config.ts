import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { getMongoClientPromise } from "@/lib/db/mongodb";
import { usersCollection, otpsCollection } from "@/lib/db/collections";
import type { UserRole } from "@/types/domain";

/* ─── Validation schemas ─── */

const emailCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["warehouse_owner", "trader", "admin"]),
});

const phoneOtpSchema = z.object({
  phone: z.string().min(10),
  otp: z.string().length(6),
});

/* ─── Auth config ─── */

export const authConfig = {
  adapter: MongoDBAdapter(getMongoClientPromise),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    /* ── Email + Password (Warehouse Owner, Trader, Admin) ── */
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const parsed = emailCredentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const users = await usersCollection();
        const user = await users.findOne({
          email: parsed.data.email.toLowerCase().trim(),
          role: parsed.data.role as UserRole,
          isActive: true,
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

    /* ── Phone OTP (Farmer) ── */
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const parsed = phoneOtpSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const otps = await otpsCollection();
        const otpDoc = await otps.findOne({
          phone: parsed.data.phone,
          code: parsed.data.otp,
          expiresAt: { $gt: new Date() },
        });

        if (!otpDoc) return null;

        // Delete used OTP
        await otps.deleteOne({ _id: otpDoc._id });

        const users = await usersCollection();
        const user = await users.findOne({
          phone: parsed.data.phone,
          role: "farmer",
          isActive: true,
        });

        if (!user) return null;

        return {
          id: user._id!.toString(),
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as UserRole;
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
