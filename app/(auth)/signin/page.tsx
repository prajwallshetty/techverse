import { SignInForm } from "@/features/auth/signin-form";

export const metadata = {
  title: "Sign In",
  description: "Sign in to AgriHold AI — Agricultural intelligence platform",
};

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 size-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 size-60 -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Form */}
      <div className="relative z-10 w-full max-w-md">
        <SignInForm />

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted">
          Protected by AgriHold AI Security Stack
        </p>
      </div>
    </main>
  );
}
