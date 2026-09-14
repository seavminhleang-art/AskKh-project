import React from "react";
import { Link } from "react-router-dom";
import { Plus, MessageSquarePlus, LogIn } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function DashboardHeader({
  user,
  isAuthenticated = false,
  isLoading = false,
  isError = false,
  onOpenAuth,
}) {
  const { t } = useLanguage();

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3.5 w-64 max-w-[70vw] bg-slate-200 dark:bg-slate-800 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-9 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Dynamic Greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t("dashboard.welcomeMorning");
    if (hour >= 12 && hour < 18) return t("dashboard.welcomeAfternoon");
    return t("dashboard.welcomeEvening");
  };

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

  const avatarUrl = user?.avatar || null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Left: Avatar + Greeting + Welcome message */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-primary-light dark:border-slate-700 shadow-2xs"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-brand-primary-light dark:bg-slate-800 text-brand-primary dark:text-blue-300 font-bold text-base flex items-center justify-center border-2 border-brand-primary/20 dark:border-slate-700 shadow-2xs">
                {initials}
              </div>
            )}
            {isAuthenticated && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                title="Online"
              />
            )}
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                {getGreeting()},{" "}
                <span className="text-brand-primary dark:text-blue-400">
                  {displayName}
                </span>
              </h1>
              {!isAuthenticated && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {t("auth.guest")}
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 truncate max-w-xl leading-relaxed">
              {isAuthenticated
                ? t("dashboard.welcomeAuthenticated")
                : t("dashboard.welcomeMessage")}
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {!isAuthenticated && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm sm:text-base font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer select-none"
            >
              <LogIn className="w-4 h-4" />
              <span>{t("auth.signIn")}</span>
            </button>
          )}

          <Link
            to="/questions/ask"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm sm:text-base font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs"
          >
            <MessageSquarePlus className="w-4 h-4 text-brand-primary dark:text-blue-400" />
            <span>{t("dashboard.askQuestion")}</span>
          </Link>

          <Link
            to="/lost-found/report"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm sm:text-base font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t("dashboard.reportLostItem")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
