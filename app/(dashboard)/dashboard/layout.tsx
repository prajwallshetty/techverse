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
import { ROLE_LABELS, ROLE_DASHBOARD } from "@/types/domain";
import type { UserRole } from "@/types/domain";

const navByRole: Record<
  UserRole,
  { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
> = {
  farmer: [
    { label: "Overview", href: "/dashboard/farmer", icon: BarChart3 },
    { label: "My Farms", href: "/dashboard/farmer", icon: Map },
    { label: "Crop AI", href: "/dashboard/farmer", icon: Sprout },
  ],
  warehouse_owner: [
    { label: "Overview", href: "/dashboard/warehouse", icon: BarChart3 },
    { label: "Inventory", href: "/dashboard/warehouse", icon: Warehouse },
    { label: "Shipments", href: "/dashboard/warehouse", icon: Map },
  ],
  trader: [
    { label: "Overview", href: "/dashboard/trader", icon: BarChart3 },
    { label: "Markets", href: "/dashboard/trader", icon: LineChart },
    { label: "Trades", href: "/dashboard/trader", icon: TrendingUp },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: BarChart3 },
    { label: "Users", href: "/dashboard/admin", icon: ShieldCheck },
    { label: "Analytics", href: "/dashboard/admin", icon: LineChart },
  ],
};

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
  const roleLabel = ROLE_LABELS[role] ?? role;
  const links = navByRole[role] ?? navByRole.farmer;

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
        <nav className="mt-10 space-y-1">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

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
                <p className="text-sm font-medium text-muted">
                  {roleLabel} Dashboard
                </p>
                <h2 className="text-lg font-bold lg:text-xl">AgriHold AI</h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
