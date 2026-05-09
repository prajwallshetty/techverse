import { SignInForm } from "@/features/auth/signin-form";
import Link from "next/link";

export const metadata = {
  title: "Sign In | Krishi Hub",
  description: "Sign in to Krishi Hub — Your agricultural intelligence partner",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel - branding (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/warehouse.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[120px]" />
        
        <Link href="/" className="relative z-10 flex items-center gap-3 group">
          <div className="bg-white rounded-xl p-2 shadow-lg group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-primary text-2xl">agriculture</span>
          </div>
          <span className="text-2xl font-black text-white tracking-tight uppercase">Krishi Hub</span>
        </Link>

        <div className="relative z-10 mb-10">
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Welcome back to your <br /> agricultural workspace.
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-md">
            Log in to manage your inventory, monitor market prices, and secure instant credit.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-flex bg-primary rounded-xl p-2.5 shadow-xl shadow-primary/20 mb-6 active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-white text-3xl">agriculture</span>
            </Link>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Sign In</h2>
            <p className="text-on-surface-variant font-medium mt-2">Enter your credentials to access your account</p>
          </div>

          <SignInForm />
          
          <p className="text-center text-xs font-bold text-on-surface-variant/40 uppercase tracking-[0.2em] pt-8">
            Secured by Krishi Hub Cloud
          </p>
        </div>
      </div>
    </div>
  );
}
