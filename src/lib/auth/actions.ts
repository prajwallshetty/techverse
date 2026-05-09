"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROLE_DASHBOARD } from "@/types/domain";
import type { UserRole } from "@/types/domain";

export async function signInWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      role,
      redirect: false,
    });
  } catch {
    return { error: "Invalid email or password. Please try again." };
  }

  const dashboard = ROLE_DASHBOARD[role as UserRole] ?? "/dashboard";
  redirect(dashboard);
}

export async function signInWithOtp(formData: FormData) {
  const phone = formData.get("phone") as string;
  const otp = formData.get("otp") as string;

  try {
    await signIn("phone-otp", {
      phone,
      otp,
      redirect: false,
    });
  } catch {
    return { error: "Invalid or expired OTP. Please try again." };
  }

  redirect(ROLE_DASHBOARD.farmer);
}

export async function signOutAction() {
  await signOut({ redirectTo: "/signin" });
}
