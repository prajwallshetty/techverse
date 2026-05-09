'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/lib/auth/actions';

const navItems = [
  { label: 'Overview', icon: 'dashboard', href: '/dashboard/trader' },
  { label: 'Marketplace', icon: 'storefront', href: '/dashboard/trader/marketplace' },
  { label: 'My Bids', icon: 'gavel', href: '/dashboard/trader/bids' },
  { label: 'Purchases', icon: 'shopping_cart', href: '/dashboard/trader/purchases' },
];

export function TraderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-outline-variant h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-10">
          <span className="material-symbols-outlined text-primary text-3xl">agriculture</span>
          <span className="text-xl font-black text-primary tracking-tight">Trader Hub</span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-outline-variant">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl font-bold text-error hover:bg-error/10 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
