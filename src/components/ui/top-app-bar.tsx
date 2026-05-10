"use client";

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';

export function TopAppBar() {
  const { language, setLanguage, t } = useTranslation();

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'kn', label: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'tulu', label: 'ತುಳು' },
  ] as const;

  return (
    <header className="bg-surface dark:bg-background border-b border-outline-variant dark:border-outline flex justify-between items-center w-full px-4 h-14 sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <img 
          src="/krishihub.png" 
          alt="Krishi Hub Logo" 
          className="size-8 object-contain"
        />
        <h1 className="font-h1-mobile text-h1-mobile font-bold text-primary dark:text-primary-fixed-dim tracking-tight">
          {t('dashboard.title')}
        </h1>
      </Link>
      
      <div className="flex items-center gap-1 ml-auto">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`px-2 py-1 rounded-lg text-xs font-black transition-all ${
              language === lang.code
                ? 'bg-primary text-white shadow-sm'
                : 'text-primary hover:bg-primary/10'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </header>
  );
}
