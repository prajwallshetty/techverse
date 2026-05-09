'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Home', icon: 'home', href: '/dashboard/farmer' },
  { label: 'Warehouses', icon: 'warehouse', href: '/dashboard/farmer/warehouses' },
  { label: 'Prices', icon: 'trending_up', href: '/dashboard/farmer/prices' },
  { label: 'Loans', icon: 'payments', href: '/dashboard/farmer/loans' },
  { label: 'Profile', icon: 'person', href: '/dashboard/farmer/profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-1 h-16 bg-surface dark:bg-surface-container-lowest shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] border-t border-outline-variant">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all active:scale-90 duration-200 ${
              isActive 
                ? 'bg-primary-container text-on-primary-container shadow-md' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-label-sm ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
