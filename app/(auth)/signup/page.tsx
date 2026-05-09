import { SignUpForm } from "@/features/auth/signup-form";
import Link from "next/link";

export const metadata = {
  title: "Sign Up | Krishi Hub",
  description: "Join Krishi Hub — Your agricultural intelligence partner",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-secondary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/farmer.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[120px]" />
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <span className="material-symbols-outlined text-secondary text-2xl">agriculture</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight uppercase">Krishi Hub</span>
        </div>

        <div className="relative z-10 mb-10">
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Join 1.2M+ farmers <br /> securing their future.
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-md">
            Create an account to securely store crops, get instant microloans, and trade directly.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center lg:text-left">
            <div className="lg:hidden inline-flex bg-primary rounded-xl p-2.5 shadow-xl shadow-primary/20 mb-6">
              <span className="material-symbols-outlined text-white text-3xl">agriculture</span>
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Create Account</h2>
            <p className="text-on-surface-variant font-medium mt-1">Get started with secure storage and credit</p>
          </div>

          <SignUpForm />
          
          <p className="text-center text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] pt-4">
            Powered by Bharat Agri Stack
          </p>
        </div>
      </div>
    </div>
  );
}
