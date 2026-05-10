'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOutAction } from '@/lib/auth/actions';
import { useSession } from 'next-auth/react';
import type { UserRole } from '@/types/domain';

/* ── Per-role nav configs ─────────────────────────────────────────── */
const navByRole: Record<
  UserRole,
  { label: string; icon: string; href: string }[]
> = {
  farmer: [
    { label: 'Dashboard',     icon: 'home',           href: '/dashboard/farmer' },
    { label: 'Warehouses',    icon: 'warehouse',      href: '/dashboard/farmer/warehouses' },
    { label: 'Apply for Loan',icon: 'payments',       href: '/dashboard/farmer/loans' },
    { label: 'My Bookings',   icon: 'calendar_month', href: '/dashboard/farmer/bookings' },
  ],
  warehouse_owner: [
    { label: 'Dashboard',     icon: 'home',          href: '/dashboard/warehouse' },
    { label: 'Bookings',      icon: 'calendar_month',href: '/dashboard/warehouse?tab=bookings' },
    { label: 'Map View',      icon: 'map',           href: '/dashboard/warehouse?tab=map' },
    { label: 'Inventory',     icon: 'inventory_2',   href: '/dashboard/warehouse?tab=inventory' },
  ],
  trader: [
    { label: 'Dashboard',     icon: 'home',          href: '/dashboard/trader' },
    { label: 'Marketplace',   icon: 'storefront',    href: '/dashboard/trader/marketplace' },
    { label: 'Market Prices', icon: 'trending_up',   href: '/dashboard/trader?tab=prices' },
    { label: 'Active Trades', icon: 'swap_horiz',    href: '/dashboard/trader?tab=trades' },
  ],
  admin: [
    { label: 'Dashboard',     icon: 'home',          href: '/dashboard/admin' },
    { label: 'IVR Analytics', icon: 'phone_in_talk', href: '/dashboard/admin/ivr' },
    { label: 'Users',         icon: 'group',         href: '/dashboard/admin?tab=users' },
    { label: 'Analytics',     icon: 'bar_chart',     href: '/dashboard/admin?tab=analytics' },
    { label: 'Settings',      icon: 'settings',      href: '/dashboard/admin?tab=settings' },
  ],
};

const portalLabel: Record<UserRole, string> = {
  farmer:          'Farmer Portal',
  warehouse_owner: 'Warehouse Portal',
  trader:          'Trader Portal',
  admin:           'Admin Portal',
};

const homeHref: Record<UserRole, string> = {
  farmer:          '/dashboard/farmer',
  warehouse_owner: '/dashboard/warehouse',
  trader:          '/dashboard/trader',
  admin:           '/dashboard/admin',
};

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user?.role as UserRole) ?? 'farmer';
  const initials = user?.name
    ? user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'KH';

  const navItems = navByRole[role] ?? navByRole.farmer;
  const rootHref = homeHref[role];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="size-10 flex items-center justify-center">
            <img 
              src="/krishihub.png" 
              alt="Krishi Hub Logo" 
              className="size-full object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-black text-foreground tracking-tight block leading-none">
              Krishi Hub
            </span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
              {portalLabel[role]}
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted px-3 pt-2 pb-3">
          Navigation
        </p>
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-muted hover:bg-surface-muted hover:text-foreground'
              }`}
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + Sign out */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{user?.name ?? 'User'}</p>
            <p className="text-[11px] text-muted truncate">{user?.email ?? ''}</p>
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl font-semibold text-sm text-danger hover:bg-danger/10 transition-all"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
