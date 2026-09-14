import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, LogOut, User, Settings, LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppStore";
import { logout } from "../../../store/slices/authSlice";
import { useLanguage } from "../../../hooks/useLanguage";

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useLanguage();
  const user = useAppSelector((state) => state.auth?.user);
  const isAuthenticated = useAppSelector(
    (state) => state.auth?.isAuthenticated,
  );

  const displayName =
    isAuthenticated && (user?.displayName || user?.name)
      ? user.displayName || user.name
      : t("auth.guestUser");

  const subtitle =
    isAuthenticated && user?.email ? user.email : t("auth.guestAccessDesc");

  const initials = displayName
    ? displayName
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "GU";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left select-none cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold text-lg flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-slate-900 dark:text-white truncate leading-tight">
            {displayName}
          </p>
          <p className="text-[16px] text-slate-400 dark:text-slate-500 truncate leading-tight">
            {subtitle}
          </p>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-1.5 space-y-0.5 z-30 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{t("navigation.profile")}</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>{t("navigation.settings")}</span>
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  dispatch(logout());
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("navigation.logOut")}</span>
              </button>
            </>
          ) : (
            <div className="p-2 text-center">
              <p className="text-[16px] text-slate-500 dark:text-slate-400 mb-2">
                {t("auth.signInPrompt")}
              </p>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-lg font-semibold text-white bg-[#102A56] hover:bg-[#102A56]/90 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t("auth.signIn")}</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
