import React, { useState, useRef, useEffect } from "react";
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon, 
  GlobeAltIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronDownIcon,
  ArrowUpRightIcon,
  ChatBubbleBottomCenterTextIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NavBarComponent({ darkMode, setDarkMode }) {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [communityDropdownOpen, setCommunityDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const location = useLocation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "kh" ? "en" : "kh";
    i18n.changeLanguage(nextLang);
  };

  const currentLangCode = i18n.language === "kh" ? "KH" : "EN";

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCommunityDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setCommunityDropdownOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isHomeActive = location.pathname === "/";
  const isCommunityActive = location.pathname.startsWith("/community");
  const isAboutActive = location.pathname === "/about";
  const isLeaderboardActive = location.pathname === "/leaderboard";

  return (
    <nav className={`sticky top-0 z-50 font-[family-name:var(--font-brand)] backdrop-blur-xl transition-colors duration-300 ${
      darkMode ? "bg-[#09090b]/80 border-b border-zinc-800/60 text-slate-100" : "bg-[#f5f5f5]/90 text-gray-900"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group py-0.5 shrink-0">
          <img 
            src="src/assets/Website/download.png" 
            alt={`${t("brand")} Logo`} 
            className="h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
          />
        </Link>

        {/* Desktop Nav Links Container */}
        <div className={`hidden md:flex items-center px-2 py-1.5 rounded-full backdrop-blur-md text-xs font-medium gap-1 ${
          darkMode ? "bg-zinc-900/80 text-slate-300 border border-zinc-800 shadow-inner" : "bg-[#eaeaea] text-gray-600 border border-transparent"
        }`}>
          <Link 
            to="/" 
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              isHomeActive 
                ? "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] font-semibold shadow-xs" 
                : darkMode 
                  ? "hover:bg-zinc-800 hover:text-white" 
                  : "hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)]"
            }`}
          >
            {t("home")}
          </Link>

          <div 
            className="relative" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isCommunityActive 
                ? "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] font-semibold shadow-xs" 
                : darkMode 
                  ? "hover:bg-zinc-800 hover:text-white" 
                  : "hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)]"
            }`}>
              <span>{t("community")}</span>
              <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${communityDropdownOpen ? "rotate-180" : ""}`} />
            </div>

            {communityDropdownOpen && (
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl shadow-2xl p-1.5 flex flex-col gap-1 z-50 ${
                darkMode ? "bg-zinc-900 border border-zinc-800 text-slate-200" : "bg-white border border-gray-200/80 text-gray-700"
              }`}>
                <Link
                  to="/community/qa"
                  onClick={() => setCommunityDropdownOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition ${
                    location.pathname === "/community/qa"
                      ? "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] font-medium"
                      : darkMode 
                        ? "hover:bg-zinc-800 hover:text-white" 
                        : "hover:bg-[var(--color-brand-primary-light)] text-gray-700 hover:text-[var(--color-brand-primary)]"
                  }`}
                >
                  <ChatBubbleBottomCenterTextIcon className="w-4 h-4 text-[var(--color-brand-primary)] shrink-0" />
                  <span>{t("qaCommunity")}</span>
                </Link>
                <Link
                  to="/community/lost-found"
                  onClick={() => setCommunityDropdownOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition ${
                    location.pathname === "/community/lost-found"
                      ? "bg-[var(--color-brand-secondary-light)] text-[var(--color-brand-secondary)] font-medium"
                      : darkMode 
                        ? "hover:bg-zinc-800 hover:text-white" 
                        : "hover:bg-[var(--color-brand-secondary-light)] text-gray-700 hover:text-[var(--color-brand-secondary)]"
                  }`}
                >
                  <MagnifyingGlassIcon className="w-4 h-4 text-[var(--color-brand-secondary)] shrink-0" />
                  <span>{t("lostFoundCommunity")}</span>
                </Link>
              </div>
            )}
          </div>

          <Link 
            to="/about" 
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              isAboutActive 
                ? "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] font-semibold shadow-xs" 
                : darkMode 
                  ? "hover:bg-zinc-800 hover:text-white" 
                  : "hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)]"
            }`}
          >
            {t("about")}
          </Link>

          <Link 
            to="/leaderboard" 
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              isLeaderboardActive 
                ? "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)] font-semibold shadow-xs" 
                : darkMode 
                  ? "hover:bg-zinc-800 hover:text-white" 
                  : "hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)]"
            }`}
          >
            {t("leaderboard")}
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleLanguage}
            type="button"
            className={`flex items-center gap-1 text-xs font-bold px-3 py-2 rounded-full transition shadow-xs cursor-pointer border ${
              darkMode 
                ? "bg-zinc-900 border-zinc-800 text-slate-200 hover:bg-zinc-800 hover:text-white" 
                : "bg-[#eaeaea] border-gray-200 text-gray-700 hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)]"
            }`}
            title="Switch Language / ប្តូរភាសា"
          >
            <GlobeAltIcon className="w-3.5 h-3.5 text-[var(--color-brand-primary)] shrink-0" />
            <span>{currentLangCode}</span>
          </button>

          <button 
            type="button"
            className={`p-2.5 rounded-full transition relative cursor-pointer border ${
              darkMode 
                ? "bg-zinc-900 border-zinc-800 text-slate-200 hover:bg-zinc-800 hover:text-white" 
                : "bg-[#eaeaea] border-gray-200 text-gray-700 hover:bg-[var(--color-brand-primary-light)] hover:text-[var(--color-brand-primary)]"
            }`}
            aria-label={t("notificationLabel")}
          >
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--color-brand-secondary)] rounded-full animate-pulse"></span>
            <BellIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className={`p-2.5 rounded-full transition shadow-xs cursor-pointer border ${
              darkMode 
                ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800" 
                : "bg-[#eaeaea] border-gray-200 text-gray-700 hover:bg-[var(--color-brand-primary-light)]"
            }`}
            aria-label={t("themeLabel")}
          >
            {darkMode ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4 text-[var(--color-brand-primary-dark)]" />
            )}
          </button>

          <Link
            to="/auth"
            className="hidden sm:flex items-center gap-1.5 bg-[var(--color-brand-primary)] text-white font-medium text-xs px-4 py-2 rounded-full border border-transparent transition-transform hover:scale-105 active:scale-95 shadow-sm hover:bg-blue-600 whitespace-nowrap"
          >
            <span>{t("getStarted")}</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 text-white shrink-0" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-full transition cursor-pointer border ${
              darkMode 
                ? "bg-zinc-900 border-zinc-800 text-slate-200 hover:bg-zinc-800" 
                : "bg-[#eaeaea] border-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
            aria-label={t("menuLabel")}
          >
            {mobileMenuOpen ? <XMarkIcon className="w-4 h-4" /> : <Bars3Icon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 w-full backdrop-blur-xl border-b px-6 py-6 shadow-2xl flex flex-col gap-4 ${
          darkMode ? "bg-zinc-950/95 border-zinc-800 text-slate-100" : "bg-[#f5f5f5]/95 text-gray-900"
        }`}>
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-medium ${isHomeActive ? "text-[var(--color-brand-primary)] font-semibold" : darkMode ? "text-slate-300 hover:text-white" : "text-gray-700 hover:text-[var(--color-brand-primary)]"}`}
          >
            {t("home")}
          </Link>
          <div className={`flex flex-col gap-2 pl-3 border-l-2 ${darkMode ? "border-zinc-800" : "border-gray-300"}`}>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t("community")}</span>
            <Link 
              to="/community/qa" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-xs font-medium ${location.pathname === "/community/qa" ? "text-[var(--color-brand-primary)] font-semibold" : darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-[var(--color-brand-primary)]"}`}
            >
              {t("qaCommunity")}
            </Link>
            <Link 
              to="/community/lost-found" 
              onClick={() => setMobileMenuOpen(false)}
              className={`text-xs font-medium ${location.pathname === "/community/lost-found" ? "text-[var(--color-brand-secondary)] font-semibold" : darkMode ? "text-slate-400 hover:text-white" : "text-gray-600 hover:text-[var(--color-brand-secondary)]"}`}
            >
              {t("lostFoundCommunity")}
            </Link>
          </div>
          <Link 
            to="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-medium ${isAboutActive ? "text-[var(--color-brand-primary)] font-semibold" : darkMode ? "text-slate-300 hover:text-white" : "text-gray-700 hover:text-[var(--color-brand-primary)]"}`}
          >
            {t("about")}
          </Link>
          <Link 
            to="/leaderboard" 
            onClick={() => setMobileMenuOpen(false)}
            className={`text-sm font-medium ${isLeaderboardActive ? "text-[var(--color-brand-primary)] font-semibold" : darkMode ? "text-slate-300 hover:text-white" : "text-gray-700 hover:text-[var(--color-brand-primary)]"}`}
          >
            {t("leaderboard")}
          </Link>
          <Link
            to="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-1.5 bg-[var(--color-brand-primary)] text-white font-medium text-xs py-2.5 rounded-full transition shadow-sm mt-2"
          >
            <span>{t("getStarted")}</span>
            <ArrowUpRightIcon className="w-3.5 h-3.5 text-white" />
          </Link>
        </div>
      )}
    </nav>
  );
}