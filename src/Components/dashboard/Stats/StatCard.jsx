import React from "react";

const iconBgStyles = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40",
  amber:
    "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40",
};

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  growth,
  growthText,
  colorScheme = "blue",
  isMock = false,
  isLoading = false,
  isError = false,
}) {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs animate-pulse flex flex-col justify-between min-h-[128px]">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-7 w-14 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-2.5 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between min-h-[128px] transition-all hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300 truncate">
              {title}
            </p>
            {isMock ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
                Dev Mock
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                Live API
              </span>
            )}
          </div>

          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mt-1">
            {isError ? "--" : value}
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
            {subtitle}
          </p>
        </div>

        {Icon && (
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              iconBgStyles[colorScheme] || iconBgStyles.blue
            }`}
          >
            <Icon className="w-4 h-4 stroke-[2.2]" />
          </div>
        )}
      </div>

      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1.5">
          {growth && (
            <span
              className={`font-bold ${
                colorScheme === "rose"
                  ? "text-rose-600 dark:text-rose-400"
                  : colorScheme === "amber"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {growth}
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
            {growthText}
          </span>
        </div>
      </div>
    </div>
  );
}
