'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/lib/auth/actions';
import { useTranslation } from '@/lib/i18n/context';

export function TraderSidebar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();

  const navItems = [
    { label: t('dashboard.sidebar.dashboard'),     icon: 'dashboard', href: '/dashboard/trader' },
    { label: t('dashboard.sidebar.marketplace'),   icon: 'storefront', href: '/dashboard/trader/marketplace' },
    { label: t('dashboard.sidebar.active_trades'), icon: 'gavel', href: '/dashboard/trader/bids' },
    { label: t('dashboard.sidebar.inventory'),     icon: 'shopping_cart', href: '/dashboard/trader/purchases' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-surface border-r border-outline-variant h-screen sticky top-0">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="size-10 flex items-center justify-center">
            <img 
              src="/krishihub.png" 
              alt="Krishi Hub Logo" 
              className="size-full object-contain group-hover:scale-110 transition-transform"
            />
          </div>
          <div>
            <span className="text-xl font-black text-primary tracking-tight block leading-none">{t('dashboard.title')}</span>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{t('dashboard.portals.trader')}</span>
          </div>
        </Link>

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

      <div className="mt-auto p-8 border-t border-outline-variant space-y-6">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl font-bold text-error hover:bg-error/10 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            {t('auth.logout')}
          </button>
        </form>
      </div>
    </aside>
  );
}
