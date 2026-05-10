'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { UserRole } from '@/types/domain';

/* ── Per-role bottom nav (max 4 items for mobile) ─────────────────── */
const getNavByRole = (t: any): Record<
  UserRole,
  { label: string; icon: string; href: string }[]
> => ({
  farmer: [
    { label: t('common.bottom_nav.home'),      icon: 'home',           href: '/dashboard/farmer' },
    { label: t('common.bottom_nav.warehouses'),icon: 'warehouse',      href: '/dashboard/farmer/warehouses' },
    { label: t('common.bottom_nav.bookings'),  icon: 'calendar_month', href: '/dashboard/farmer/bookings' },
  ],
  warehouse_owner: [
    { label: t('common.bottom_nav.home'),      icon: 'home',           href: '/dashboard/warehouse' },
    { label: t('common.bottom_nav.bookings'),  icon: 'calendar_month', href: '/dashboard/warehouse?tab=bookings' },
    { label: t('common.bottom_nav.map'),       icon: 'map',            href: '/dashboard/warehouse?tab=map' },
    { label: t('common.bottom_nav.inventory'), icon: 'inventory_2',    href: '/dashboard/warehouse?tab=inventory' },
  ],
  trader: [
    { label: t('common.bottom_nav.overview'), icon: 'dashboard', href: '/dashboard/trader' },
    { label: t('common.bottom_nav.market'), icon: 'storefront', href: '/dashboard/trader/marketplace' },
    { label: t('common.bottom_nav.bids'), icon: 'gavel', href: '/dashboard/trader/bids' },
    { label: t('common.bottom_nav.purchases'), icon: 'shopping_cart', href: '/dashboard/trader/purchases' },
  ],
  admin: [
    { label: t('common.bottom_nav.home'),      icon: 'home',           href: '/dashboard/admin' },
    { label: t('common.bottom_nav.users'),     icon: 'group',          href: '/dashboard/admin?tab=users' },
    { label: t('common.bottom_nav.analytics'), icon: 'bar_chart',      href: '/dashboard/admin?tab=analytics' },
    { label: t('common.bottom_nav.settings'),  icon: 'settings',       href: '/dashboard/admin?tab=settings' },
  ],
});


const homeHref: Record<UserRole, string> = {
  farmer:          '/dashboard/farmer',
  warehouse_owner: '/dashboard/warehouse',
  trader:          '/dashboard/trader',
  admin:           '/dashboard/admin',
};

import { useTranslation } from '@/lib/i18n/context';

export function BottomNav({ role: propRole }: { role?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { t } = useTranslation();
  
  const currentRole = (propRole || session?.user?.role || 'farmer') as UserRole;
  const navByRole = getNavByRole(t);
  const navItems = navByRole[currentRole] ?? navByRole.farmer;

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
