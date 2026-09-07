import React, { useState } from 'react';
import { Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/useAppStore';
import { toggleTheme } from '../../../store/slices/themeSlice';

export default function HeaderActions() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('KH');

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
      {/* 1. Dark/Light Mode Button */}
      <button
        type="button"
        onClick={() => dispatch(toggleTheme())}
        className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer select-none"
        aria-label="Toggle theme"
        title="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="w-3.5 h-3.5 text-amber-400" />
        ) : (
          <Moon className="w-3.5 h-3.5 text-slate-600" />
        )}
      </button>

      {/* 2. Language Button showing Cambodia Flag */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setLangMenuOpen((prev) => !prev)}
          className="h-8 px-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-medium select-none"
          title="Change language"
        >
          <span className="text-sm leading-none" role="img" aria-label="Cambodia flag">
            🇰🇭
          </span>
          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
            {currentLang}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {langMenuOpen && (
          <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-1 z-40 animate-in fade-in slide-in-from-top-1 duration-100 text-xs">
            <button
              type="button"
              onClick={() => {
                setCurrentLang('KH');
                setLangMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer"
            >
              <span>🇰🇭</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">Khmer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentLang('EN');
                setLangMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-left cursor-pointer"
            >
              <span>🇺🇸</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">English</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Notification Button with small red notification badge */}
      <button
        type="button"
        className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer select-none"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
      </button>

      {/* 4. User Avatar + Name + Dropdown */}
      <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold text-[11px] flex items-center justify-center border border-blue-200 dark:border-blue-800">
          SO
        </div>
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Sovannrith
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </div>
    </div>
  );
}
