"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "kn" | "hi" | "tulu";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [translations, setTranslations] = useState<any>({});

  useEffect(() => {
    const savedLang = localStorage.getItem("agrihold_lang") as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const res = await fetch(`/api/i18n?lang=${language}`);
        const data = await res.json();
        setTranslations(data);
      } catch (err) {
        console.error("Failed to load translations");
      }
    };
    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("agrihold_lang", lang);
    // Optionally sync with server
    fetch("/api/user/language", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredLanguage: lang }),
    });
  };

  const t = (path: string, replacements?: Record<string, string>) => {
    const keys = path.split(".");
    let value = translations;
    for (const key of keys) {
      value = value?.[key];
    }
    
    if (typeof value !== "string") return path;

    if (replacements) {
      Object.entries(replacements).forEach(([key, val]) => {
        value = (value as string).replace(`{{${key}}}`, val);
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
}
