import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { toggleTheme } from '../../store/slices/themeSlice';

export default function ThemeToggle({ className = '' }) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className={`w-10 h-10 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#667085] hover:text-[#111827] dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-center cursor-pointer select-none ${className}`}
      aria-label="Toggle theme"
      title="Toggle Light / Dark Mode"
    >
      {theme === 'dark' ? (
        <Sun className="w-[18px] h-[18px] text-amber-400" />
      ) : (
        <Moon className="w-[18px] h-[18px]" />
      )}
    </button>
  );
}
