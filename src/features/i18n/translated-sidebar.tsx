"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { 
  BarChart3, 
  Map, 
  Sprout, 
  Warehouse, 
  LineChart, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";
import type { UserRole } from "@/types/domain";

const icons = {
  overview: BarChart3,
  my_farms: Map,
  crop_ai: Sprout,
  inventory: Warehouse,
  shipments: Map,
  markets: LineChart,
  trades: TrendingUp,
  users: ShieldCheck,
  analytics: LineChart,
};

const navByRole: Record<UserRole, { key: string; href: string; iconKey: keyof typeof icons }[]> = {
  farmer: [
    { key: "overview", href: "/dashboard/farmer", iconKey: "overview" },
    { key: "my_farms", href: "/dashboard/farmer", iconKey: "my_farms" },
    { key: "crop_ai", href: "/dashboard/farmer", iconKey: "crop_ai" },
  ],
  warehouse_owner: [
    { key: "overview", href: "/dashboard/warehouse", iconKey: "overview" },
    { key: "inventory", href: "/dashboard/warehouse", iconKey: "inventory" },
    { key: "shipments", href: "/dashboard/warehouse", iconKey: "shipments" },
  ],
  trader: [
    { key: "overview", href: "/dashboard/trader", iconKey: "overview" },
    { key: "markets", href: "/dashboard/trader", iconKey: "markets" },
    { key: "trades", href: "/dashboard/trader", iconKey: "trades" },
  ],
  admin: [
    { key: "overview", href: "/dashboard/admin", iconKey: "overview" },
    { key: "users", href: "/dashboard/admin", iconKey: "users" },
    { key: "analytics", href: "/dashboard/admin", iconKey: "analytics" },
  ],
};

export function TranslatedSidebar({ role }: { role: UserRole }) {
  const { t } = useTranslation();
  const links = navByRole[role] || navByRole.farmer;

  return (
    <nav className="mt-10 space-y-1">
      {links.map((item) => {
        const Icon = icons[item.iconKey];
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
          >
            <Icon className="size-4" />
            {t(`common.nav.${item.key}`)}
          </Link>
        );
      })}
    </nav>
  );
}
