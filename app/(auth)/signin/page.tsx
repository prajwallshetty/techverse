import { SignInForm } from "@/features/auth/signin-form";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Sign In | Krishi Hub",
  description: "Sign in to Krishi Hub — Your agricultural intelligence partner",
};

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-10">
      {/* Dynamic Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-96 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-secondary/10 blur-[100px] animate-pulse delay-700" />
        <div className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[80px]" />
      </div>

      <AuthCard 
        title="Welcome Back" 
        subtitle="Log in to manage your agricultural operations"
      >
        <SignInForm />
      </AuthCard>
    </main>
  );
}
