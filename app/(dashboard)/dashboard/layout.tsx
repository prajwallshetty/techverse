import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopAppBar } from "@/components/ui/top-app-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/ui/sidebar";
import { TraderSidebar } from "@/components/ui/trader-sidebar";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const role = session.user.role;

  if (!role) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <Suspense fallback={<div className="w-64 bg-surface border-r border-border h-screen" />}>
        {role === "trader" ? <TraderSidebar /> : <Sidebar />}
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50">
          <TopAppBar />
        </header>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <footer className="lg:hidden">
          <Suspense fallback={<div className="h-16 bg-surface border-t border-border" />}>
            <BottomNav />
          </Suspense>
        </footer>
      </div>
    </div>
  );
}
