import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes/AppRoutes';
import { useAppSelector } from './hooks/useAppStore';
import { useAuthInit } from './hooks/useAuthInit';

export default function App() {
  const theme = useAppSelector((state) => state.theme.mode);
  useAuthInit();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme={theme}
      />
    </BrowserRouter>
  );
}
