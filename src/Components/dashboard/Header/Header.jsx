import React from 'react';
import { Menu } from 'lucide-react';
import SearchBar from './SearchBar';
import HeaderActions from './HeaderActions';

export default function Header({ onToggleMobileMenu }) {
  return (
    <header className="h-[50px] px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 sticky top-0 z-20 transition-colors">
      {/* Left: Hamburger/menu button inside a light gray rounded square */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer select-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Center/large area: Search input */}
      <div className="flex-1 flex justify-center max-w-[440px] mx-auto">
        <SearchBar />
      </div>

      {/* Right: Actions */}
      <HeaderActions />
    </header>
  );
}
