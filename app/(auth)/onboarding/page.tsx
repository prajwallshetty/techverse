import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ROLE_DASHBOARD } from "@/types/domain";
import type { UserRole } from "@/types/domain";
import { RoleSelector } from "@/features/auth/role-selector";

export const metadata = {
  title: "Choose Your Role | Krishi Hub",
  description: "Select your role to get started with AgriHold AI",
};

export default async function OnboardingPage() {
  const session = await auth();

  // Not logged in → signin
  if (!session?.user) {
    redirect("/signin");
  }

  // Already has role → go to dashboard
  if (session.user.role) {
    const dashboard = ROLE_DASHBOARD[session.user.role as UserRole] ?? "/dashboard/farmer";
    redirect(dashboard);
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/warehouse.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute -left-[10%] -top-[10%] w-[40%] h-[40%] rounded-full bg-white/10 blur-[120px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="size-10 flex items-center justify-center">
            <img 
              src="/krishihub.png" 
              alt="Krishi Hub Logo" 
              className="size-full object-contain"
            />
          </div>
          <span className="text-2xl font-black text-white tracking-tight uppercase">Krishi Hub</span>
        </div>

        <div className="relative z-10 mb-10">
          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Welcome aboard, <br />{session.user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-md">
            Tell us your role so we can personalize your agricultural workspace.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden inline-flex mb-6">
              <img 
                src="/krishihub.png" 
                alt="Krishi Hub Logo" 
                className="size-12 object-contain"
              />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">Choose Your Role</h2>
            <p className="text-muted font-medium mt-2">This determines your dashboard and available tools.</p>
          </div>

          <RoleSelector userName={session.user.name || "User"} />
        </div>
      </div>
    </div>
  );
}
