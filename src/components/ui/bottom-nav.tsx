'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { UserRole } from '@/types/domain';

/* ── Per-role bottom nav (max 4 items for mobile) ─────────────────── */
const navByRole: Record<
  UserRole,
  { label: string; icon: string; href: string }[]
> = {
  farmer: [
    { label: 'Home',      icon: 'home',           href: '/dashboard/farmer' },
    { label: 'Warehouses',icon: 'warehouse',      href: '/dashboard/farmer/warehouses' },
    { label: 'Loans',     icon: 'payments',       href: '/dashboard/farmer/loans' },
    { label: 'Bookings',  icon: 'calendar_month', href: '/dashboard/farmer/bookings' },
  ],
  warehouse_owner: [
    { label: 'Home',      icon: 'home',           href: '/dashboard/warehouse' },
    { label: 'Bookings',  icon: 'calendar_month', href: '/dashboard/warehouse?tab=bookings' },
    { label: 'Map',       icon: 'map',            href: '/dashboard/warehouse?tab=map' },
    { label: 'Inventory', icon: 'inventory_2',    href: '/dashboard/warehouse?tab=inventory' },
  ],
  trader: [
    { label: 'Home',      icon: 'home',           href: '/dashboard/trader' },
    { label: 'Market',    icon: 'storefront',     href: '/dashboard/trader/marketplace' },
    { label: 'Prices',    icon: 'trending_up',    href: '/dashboard/trader?tab=prices' },
    { label: 'Trades',    icon: 'swap_horiz',     href: '/dashboard/trader?tab=trades' },
  ],
  admin: [
    { label: 'Home',      icon: 'home',           href: '/dashboard/admin' },
    { label: 'Users',     icon: 'group',          href: '/dashboard/admin?tab=users' },
    { label: 'Analytics', icon: 'bar_chart',      href: '/dashboard/admin?tab=analytics' },
    { label: 'Settings',  icon: 'settings',       href: '/dashboard/admin?tab=settings' },
  ],
};

const homeHref: Record<UserRole, string> = {
  farmer:          '/dashboard/farmer',
  warehouse_owner: '/dashboard/warehouse',
  trader:          '/dashboard/trader',
  admin:           '/dashboard/admin',
};

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const role = (session?.user?.role as UserRole) ?? 'farmer';
  const navItems = navByRole[role] ?? navByRole.farmer;
  const rootHref = homeHref[role];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-1 h-16 bg-surface border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const itemUrl = new URL(item.href, 'http://localhost:3000');
        const itemPath = itemUrl.pathname;
        const itemTab = itemUrl.searchParams.get('tab');
        const currentTab = searchParams.get('tab');

        const isActive = pathname === itemPath && itemTab === currentTab;

        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 px-4 py-1.5 rounded-xl transition-all active:scale-90 duration-200 ${
              isActive ? 'text-primary' : 'text-muted hover:text-foreground'
            }`}
          >
            <span
              className="material-symbols-outlined text-2xl"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
