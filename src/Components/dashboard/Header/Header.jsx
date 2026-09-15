import React, { useState } from 'react';
import { Menu, Search, X } from 'lucide-react';
import SearchBar from './SearchBar';
import HeaderActions from './HeaderActions';

export default function Header({ onToggleMobileMenu }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="h-[50px] px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 sticky top-0 z-20 transition-colors">
      {/* Left: Hamburger button — hidden when mobile search is open */}
      <div className={`flex items-center gap-2 shrink-0 ${mobileSearchOpen ? 'hidden' : 'flex'}`}>
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer select-none"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Search — full bar on sm+, expandable on xs */}
      {mobileSearchOpen ? (
        /* Mobile expanded search */
        <div className="flex-1 flex items-center gap-2 sm:hidden">
          <SearchBar autoFocus />
          <button
            type="button"
            onClick={() => setMobileSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Desktop search bar (sm+) */}
          <div className="hidden sm:flex flex-1 justify-center max-w-[440px] mx-auto">
            <SearchBar />
          </div>
          {/* Mobile search icon (xs only) */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(true)}
            className="sm:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Right: Actions — hidden when mobile search is open */}
      <div className={`shrink-0 ${mobileSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
        <HeaderActions />
      </div>
    </header>
  );
}
