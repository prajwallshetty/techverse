import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { signOutAction } from "@/lib/auth/actions";
import {
  Leaf,
  LogOut,
  BarChart3,
  Map,
  Sprout,
  LineChart,
  ShieldCheck,
  Warehouse,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/antigravity/badge";
import type { UserRole } from "@/types/domain";
import { TranslatedSidebar } from "@/features/i18n/translated-sidebar";
import { TranslatedHeader } from "@/features/i18n/translated-header";
import { LanguageSwitcher } from "@/features/i18n/language-switcher";

const navByRole = null; // Replaced by TranslatedSidebar

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const role = (session.user.role as UserRole) ?? "farmer";
  const roleLabel = (session.user.role as string)?.charAt(0).toUpperCase() + (session.user.role as string)?.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-surface px-5 py-6 lg:flex lg:flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted">AgriHold</p>
            <h1 className="text-xl font-bold">AI Ops</h1>
          </div>
        </div>

        {/* Navigation */}
        <TranslatedSidebar role={role} />

        {/* User info at bottom */}
        <div className="mt-auto border-t border-border pt-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-semibold truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-muted truncate">
                {session.user.email ?? session.user.phone}
              </p>
            </div>
          </div>
          <form action={signOutAction} className="mt-3">
            <button
              type="submit"
              className="flex h-9 w-full items-center justify-center gap-2 rounded-md border border-border text-xs font-semibold text-muted transition hover:bg-surface-muted hover:text-danger"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile logo */}
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground lg:hidden">
                <Leaf className="size-4" />
              </div>
              <div>
                <TranslatedHeader roleLabel={roleLabel} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Badge>{roleLabel}</Badge>
              <form action={signOutAction} className="lg:hidden">
                <button
                  type="submit"
                  className="flex size-9 items-center justify-center rounded-md border border-border text-muted transition hover:text-danger"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}
      </main>
    </div>
  );
}
