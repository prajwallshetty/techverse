"use client";

import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", name: "English", native: "English" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "tulu", name: "Tulu", native: "ತುಳು" }
];

export function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/50 backdrop-blur-md border border-black/[0.05] hover:border-primary/20 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <div className="size-6 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
          <Globe className="size-3.5" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-muted group-hover:text-foreground transition-colors">
          {currentLang.native}
        </span>
        <ChevronDown className={`size-3 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl border border-black/[0.05] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] py-3 overflow-hidden"
          >
            <div className="px-5 py-2 mb-2">
              <p className="text-[10px] font-black uppercase text-muted tracking-[0.2em]">
                Select Language
              </p>
            </div>
            
            <div className="space-y-1 px-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    language === lang.code 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "hover:bg-primary/5 text-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className={`text-[13px] font-bold ${language === lang.code ? "text-white" : "text-foreground"}`}>
                      {lang.native}
                    </span>
                    <span className={`text-[9px] font-black uppercase tracking-wider opacity-60 ${language === lang.code ? "text-white/80" : "text-muted"}`}>
                      {lang.name}
                    </span>
                  </div>
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="size-5 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
