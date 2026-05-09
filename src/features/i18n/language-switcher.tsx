"use client";

import { Globe, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useState } from "react";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "tulu", name: "Tulu", native: "ತುಳು" }
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface hover:bg-surface-muted transition-colors"
      >
        <Globe className="size-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider">
          {languages.find(l => l.code === language)?.native}
        </span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-20" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-2xl shadow-2xl z-30 py-2 animate-in fade-in zoom-in-95 duration-200">
            <p className="px-4 py-2 text-[10px] font-black uppercase text-muted tracking-widest border-b border-border mb-1">
              Select Language
            </p>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-primary/5 ${
                  language === lang.code ? "text-primary font-bold" : "text-muted font-medium hover:text-foreground"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="text-[13px]">{lang.native}</span>
                  <span className="text-[10px] opacity-60 uppercase">{lang.name}</span>
                </div>
                {language === lang.code && <Check className="size-4" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
