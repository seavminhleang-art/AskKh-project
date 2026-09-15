import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Laptop,
  User,
  Settings,
  Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppStore";
import { setTheme } from "../../../store/slices/themeSlice";
import { useLanguage } from "../../../hooks/useLanguage";
import { useCurrentUser } from "../../../features/dashboard/hooks/useDashboardData";

export default function HeaderActions() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme?.mode || "system");
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated } = useCurrentUser();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const displayName =
    isAuthenticated && (user?.displayName || user?.name)
      ? user.displayName || user.name
      : t("auth.guestUser");

  const initials = displayName
    ? displayName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "GU";

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
      {/* 1. Theme Selector (Light / Dark / System) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setThemeMenuOpen((prev) => !prev)}
          className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer select-none"
          aria-label="Toggle theme mode"
          title={`Theme: ${themeMode}`}
        >
          {themeMode === "dark" ? (
            <Moon className="w-3.5 h-3.5 text-blue-400" />
          ) : themeMode === "light" ? (
            <Sun className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Laptop className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          )}
        </button>

        {themeMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1 z-40 text-lg space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-100">
            <button
              type="button"
              onClick={() => {
                dispatch(setTheme("light"));
                setThemeMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                themeMode === "light"
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t("settings.light")}</span>
              </div>
              {themeMode === "light" && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                dispatch(setTheme("dark"));
                setThemeMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                themeMode === "dark"
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span>{t("settings.dark")}</span>
              </div>
              {themeMode === "dark" && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                dispatch(setTheme("system"));
                setThemeMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                themeMode === "system"
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Laptop className="w-3.5 h-3.5 text-slate-500" />
                <span>{t("settings.system")}</span>
              </div>
              {themeMode === "system" && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* 2. Language Button [ 🇬🇧 EN ▼ ] or [ 🇰🇭 KH ▼ ] */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setLangMenuOpen((prev) => !prev)}
          className="h-8 px-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-lg font-medium select-none"
          title={t("settings.displayLanguage")}
          aria-label="Change language"
          aria-expanded={langMenuOpen}
        >
          <span className="text-sm leading-none" role="img" aria-label="Flag">
            {language === "km" ? "🇰🇭" : "🇬🇧"}
          </span>
          <span className="text-[16px] font-bold text-slate-700 dark:text-slate-200 tracking-wide">
            {language === "km" ? "KH" : "EN"}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {langMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1 z-40 animate-in fade-in slide-in-from-top-1 duration-100 text-lg space-y-0.5">
            <button
              type="button"
              onClick={() => {
                setLanguage("en");
                setLangMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition-colors ${
                language === "en"
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🇬🇧</span>
                <span>English</span>
              </div>
              {language === "en" && (
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage("km");
                setLangMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left cursor-pointer transition-colors ${
                language === "km"
                  ? "bg-blue-50 text-blue-700 font-semibold dark:bg-blue-950/60 dark:text-blue-300"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🇰🇭</span>
                <span className="font-khmer">ខ្មែរ</span>
              </div>
              {language === "km" && (
                <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* 3. Notification Button with small red notification badge */}
      <Link
        to="/notifications"
        className="relative w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer select-none"
        aria-label={t("navigation.notifications")}
        title={t("navigation.notifications")}
      >
        <Bell className="w-3.5 h-3.5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
      </Link>

      {/* 4. User Avatar + Name + Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setUserMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800 cursor-pointer"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover border border-blue-200 dark:border-blue-800"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold text-[16px] flex items-center justify-center border border-blue-200 dark:border-blue-800">
              {initials}
            </div>
          )}
          <span className="hidden sm:inline text-lg font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
            {displayName}
          </span>
          <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {userMenuOpen && (
          <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 z-40 text-lg space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-100">
            <Link
              to="/profile"
              onClick={() => setUserMenuOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t("navigation.profile")}</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setUserMenuOpen(false)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{t("navigation.settings")}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
