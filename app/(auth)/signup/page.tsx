import { SignUpForm } from "@/features/auth/signup-form";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Sign Up | Krishi Hub",
  description: "Join Krishi Hub — Your agricultural intelligence partner",
};

export default function SignUpPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      {/* Hand-crafted background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
        <div className="absolute -right-[10%] -bottom-[10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex bg-primary rounded-2xl p-2.5 shadow-xl shadow-primary/20 mb-6">
            <span className="material-symbols-outlined text-white text-3xl">agriculture</span>
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight uppercase mb-2">Krishi Hub</h1>
          <p className="text-on-surface-variant font-medium">Join 1.2M+ farmers securing their future</p>
        </div>

        <AuthCard 
          title="Create Account" 
          subtitle="Get started with secure storage and credit"
          className="shadow-2xl border-outline-variant/30"
        >
          <SignUpForm />
        </AuthCard>
        
        <p className="mt-12 text-center text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em]">
          Powered by Bharat Agri Stack
        </p>
      </div>
    </main>
  );
}
