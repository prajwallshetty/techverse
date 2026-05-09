import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopAppBar } from "@/components/ui/top-app-bar";
import { BottomNav } from "@/components/ui/bottom-nav";
import { Sidebar } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-50">
          <TopAppBar />
        </header>
        
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        <footer className="lg:hidden">
          <BottomNav />
        </footer>
      </div>
    </div>
  );
}
