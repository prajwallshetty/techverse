"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { signInWithCredentials } from "@/lib/auth/actions";
import { Mail, Lock, Loader2, Globe } from "lucide-react";
import Link from "next/link";

export function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signInWithCredentials(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl bg-danger/10 p-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              className="w-full rounded-xl border border-border bg-surface px-10 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              minLength={8}
              className="w-full rounded-xl border border-border bg-surface px-10 py-2.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center rounded-xl bg-primary py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted">Or continue with</span>
        </div>
      </div>

      <button
        onClick={() => signIn("google")}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface py-2.5 text-sm font-semibold text-foreground transition-all hover:bg-surface-muted active:scale-[0.98]"
      >
        <Globe className="h-4 w-4 text-primary" />
        Google
      </button>

      <p className="text-center text-sm text-muted pt-2">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
}
