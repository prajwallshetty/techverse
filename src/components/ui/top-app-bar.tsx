'use client';

import Link from 'next/link';

export function TopAppBar() {
  return (
    <header className="bg-surface dark:bg-background border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-4 h-14 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        <img 
          src="/krishihub.png" 
          alt="Krishi Hub Logo" 
          className="size-8 object-contain"
        />
        <h1 className="font-h1-mobile text-h1-mobile font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
          Krishi Hub
        </h1>
      </Link>
      
      <div className="flex items-center gap-2">
        <button className="text-primary dark:text-primary-fixed-dim font-bold text-lg hover:bg-surface-container-low transition-colors px-2 py-1 rounded-lg active:scale-95 duration-150">
          English
        </button>
      </div>
    </header>
  );
}
