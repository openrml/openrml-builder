import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../../infrastructure/i18n/translations';

type Language = 'en' | 'ua';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  defaultLanguage = 'en' 
}: { 
  children: React.ReactNode; 
  defaultLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(() => {
  const saved = localStorage.getItem('openrml-language');
  // Validate saved language - only accept 'en' or 'ua'
  if (saved === 'en' || saved === 'ua') {
    return saved;
  }
  return defaultLanguage;
});

  useEffect(() => {
    localStorage.setItem('openrml-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
  // Safety check: ensure language exists in translations
  const currentLang = translations[language] ? language : 'en';
  return translations[currentLang]?.[key] || translations.en[key] || key;
};

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}