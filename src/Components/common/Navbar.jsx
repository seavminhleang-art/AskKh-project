import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import NexaLogo from './NexaLogo';
import ThemeToggle from './ThemeToggle';
import NotificationButton from './NotificationButton';
import LanguageSwitcher from './LanguageSwitcher';
import { useAppSelector } from '../../hooks/useAppStore';

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleGetStarted = () => {
    setMobileMenuOpen(false);
    navigate('/dashboard');
  };

  const navLinkClasses = ({ isActive }) =>
    `px-3.5 py-2 text-[15px] font-medium transition-colors select-none rounded-lg ${
      isActive
        ? 'text-[#155EEF] font-semibold'
        : 'text-[#111827] dark:text-slate-200 hover:text-[#155EEF] dark:hover:text-blue-400'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-slate-950 border-b border-[#E5E7EB] dark:border-slate-800 transition-colors">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-[84px] flex items-center justify-between">
        
        {/* ================= LEFT: NEXA LOGO ================= */}
        <div className="flex items-center shrink-0">
          <NexaLogo />
        </div>

        {/* ================= CENTER: MAIN NAVIGATION ================= */}
        <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-4 flex-1 max-w-xl mx-auto">
          <NavLink to="/dashboard" className={navLinkClasses}>
            Dashboard
          </NavLink>
        </nav>

        {/* ================= RIGHT: UTILITY CONTROLS ================= */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* 1. Theme Toggle */}
          <ThemeToggle />

          {/* 2. Notification Button */}
          <NotificationButton />

          {/* 3. Language Switcher */}
          <LanguageSwitcher />

          {/* 4. Get Started Button */}
          <button
            type="button"
            onClick={handleGetStarted}
            className="h-10 px-5 rounded-xl bg-[#155EEF] hover:bg-[#124bbf] active:scale-[0.98] text-white text-[14.5px] font-semibold transition-all shadow-xs flex items-center justify-center cursor-pointer select-none"
          >
            Get Started
          </button>
        </div>

        {/* ================= MOBILE / TABLET MENU TOGGLE ================= */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="sm:flex" />
          <NotificationButton />
          
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-10 h-10 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#111827] dark:text-slate-200 flex items-center justify-center cursor-pointer select-none ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* ================= MOBILE NAVIGATION DRAWER ================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                  isActive
                    ? 'text-[#155EEF] font-semibold bg-blue-50/70 dark:bg-blue-950/40'
                    : 'text-[#111827] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              Dashboard
            </NavLink>
          </nav>

          {/* Mobile Utility & CTA */}
          <div className="pt-3 border-t border-[#E5E7EB] dark:border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-[#667085] dark:text-slate-400">Language:</span>
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={handleGetStarted}
              className="w-full h-11 rounded-xl bg-[#155EEF] hover:bg-[#124bbf] active:scale-[0.98] text-white text-[15px] font-semibold transition-all shadow-xs flex items-center justify-center cursor-pointer select-none"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
