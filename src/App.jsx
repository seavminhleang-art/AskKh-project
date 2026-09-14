import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';
import { useAppSelector } from './hooks/useAppStore';
import { useAuthInit } from './hooks/useAuthInit';

import { useLanguage } from './hooks/useLanguage';
import { applyThemeToDocument, getSystemTheme } from './store/slices/themeSlice';

export default function App() {
  const theme = useAppSelector((state) => state.theme?.mode || 'system');
  const { language } = useLanguage();
  useAuthInit();

  // Sync theme with DOM and listen to OS preference if mode is 'system'
  useEffect(() => {
    applyThemeToDocument(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        applyThemeToDocument('system');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Sync html lang and font class
  useEffect(() => {
    document.documentElement.lang = language === 'km' ? 'km' : 'en';
    if (language === 'km') {
      document.documentElement.classList.add('font-khmer');
    } else {
      document.documentElement.classList.remove('font-khmer');
    }
  }, [language]);

  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={effectiveTheme}
      />
    </BrowserRouter>
  );
}
