"use server";

import { signIn, signOut, auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { ROLE_DASHBOARD } from "@/types/domain";
import type { UserRole } from "@/types/domain";
import { usersCollection } from "@/lib/db/collections";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["farmer", "warehouse_owner", "trader", "admin"]),
});

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please fill in all fields." };
  }

  // Fetch user role for role-based redirect
  const users = await usersCollection();
  const user = await users.findOne({ email: email.toLowerCase().trim() });
  const dashboard = user ? (ROLE_DASHBOARD[user.role as UserRole] ?? "/dashboard") : "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: dashboard,
    });
  } catch (error) {
    // NextAuth v5 throws NEXT_REDIRECT on successful redirect — re-throw that
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    return { error: "Invalid email or password. Please try again." };
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}

export async function signUpAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = signUpSchema.safeParse(data);

  if (!parsed.success) {
    // Return the first validation error message
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message ?? "Invalid form data. Please check your inputs." };

  }

  const { name, email, phone, password, role } = parsed.data;
  const users = await usersCollection();

  // Check if user already exists by email OR phone
  const existingByEmail = await users.findOne({ email: email.toLowerCase() });
  if (existingByEmail) {
    return { error: "An account with this email already exists." };
  }

  const existingByPhone = await users.findOne({ phone });
  if (existingByPhone) {
    return { error: "An account with this phone number already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomUUID();

  const newUser = {
    name,
    email: email.toLowerCase().trim(),
    phone,
    passwordHash,
    role: role as UserRole,
    isActive: false,
    emailVerified: null,
    verificationToken,
    trustScore: 80,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await users.insertOne(newUser);
  } catch (error) {
    console.error("Sign up DB error:", error);
    return { error: "Failed to create account. Please try again." };
  }

  try {
    await sendVerificationEmail(email, verificationToken);
  } catch (error) {
    console.error("Email send error:", error);
    // Account was created but email failed — still inform the user
    return { success: "Account created! Email verification could not be sent — please contact support." };
  }

  const dashboard = ROLE_DASHBOARD[role as UserRole] ?? "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: dashboard,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Auto-login error:", error);
  }
}

export async function verifyEmailAction(token: string) {
  if (!token || typeof token !== "string") {
    return { error: "Invalid verification token." };
  }

  const users = await usersCollection();
  const user = await users.findOne({ verificationToken: token });

  if (!user) {
    return { error: "Invalid or expired verification token." };
  }

  try {
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          isActive: true,
          emailVerified: new Date(),
        },
        $unset: {
          verificationToken: "",
        },
      }
    );
    return { success: "Email verified successfully! You can now sign in." };
  } catch (error) {
    console.error("Verification error:", error);
    return { error: "Failed to verify email. Please try again." };
  }
}

export async function selectRoleAction(role: UserRole) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const users = await usersCollection();
  try {
    await users.updateOne(
      { email: session.user.email.toLowerCase().trim() },
      { 
        $set: { 
          role, 
          isActive: true, // OAuth users are active immediately
          updatedAt: new Date() 
        } 
      }
    );
  } catch (error) {
    console.error("Role selection error:", error);
    return { error: "Failed to update role. Please try again." };
  }

  const dashboard = ROLE_DASHBOARD[role] ?? "/dashboard";
  redirect(dashboard);
}

