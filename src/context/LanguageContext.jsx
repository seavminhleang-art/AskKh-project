import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import i18n from '../i18n';
import { en } from '../constants/translations/en';
import { km } from '../constants/translations/km';

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key, fallback) => fallback || key,
  isKhmer: false,
});

const STORAGE_KEY = 'askkh-language';

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'km') return saved;
    // Handle legacy storage keys or uppercase values if present
    if (saved === 'EN') return 'en';
    if (saved === 'KH') return 'km';
    const legacy = localStorage.getItem('askkh_lang');
    if (legacy === 'KH' || legacy === 'km') return 'km';
    if (legacy === 'EN' || legacy === 'en') return 'en';

    // Check browser language
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (browserLang.startsWith('km')) {
      return 'km';
    }
  } catch {
    // Fallback on error
  }
  return 'en';
};

const dictionaries = { en, km };

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((newLang) => {
    const normalized = newLang === 'km' || newLang === 'KH' ? 'km' : 'en';
    setLanguageState(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
      localStorage.setItem('askkh_lang', normalized === 'km' ? 'KH' : 'EN');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'km' : 'en');
  }, [language, setLanguage]);

  // Sync HTML lang attribute, font styling, and i18n engine
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language === 'km' ? 'km' : 'en';
      if (language === 'km') {
        document.documentElement.classList.add('font-khmer');
      } else {
        document.documentElement.classList.remove('font-khmer');
      }
    }
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(language);
    }
  }, [language]);

  /**
   * Helper function supporting nested keys (e.g. "navigation.dashboard", "dashboard.quickActions")
   * Falls back to English, then optional fallback param, then key itself.
   */
  const t = useCallback(
    (keyPath, fallback = '') => {
      if (!keyPath || typeof keyPath !== 'string') return fallback || '';

      const currentDict = dictionaries[language] || dictionaries.en;
      const fallbackDict = dictionaries.en;

      const resolveKey = (dict, path) => {
        if (!dict) return undefined;
        // Direct property check first (for flat keys or direct properties)
        if (dict[path] !== undefined && typeof dict[path] === 'string') {
          return dict[path];
        }
        // Nested path navigation
        const parts = path.split('.');
        let current = dict;
        for (const part of parts) {
          if (current === null || current === undefined) return undefined;
          current = current[part];
        }
        return typeof current === 'string' ? current : undefined;
      };

      const resolved = resolveKey(currentDict, keyPath);
      if (resolved !== undefined) return resolved;

      const englishResolved = resolveKey(fallbackDict, keyPath);
      if (englishResolved !== undefined) return englishResolved;

      return fallback || keyPath;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      isKhmer: language === 'km',
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

