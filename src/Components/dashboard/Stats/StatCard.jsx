import React from 'react';

const iconBgStyles = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400',
  emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400',
};

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  growth = '↑ 20%',
  growthText = 'from last month',
  colorScheme = 'blue',
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between min-h-[118px] transition-all hover:shadow-xs hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            {value}
          </p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {subtitle}
          </p>
        </div>

        {Icon && (
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              iconBgStyles[colorScheme] || iconBgStyles.blue
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px]">
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {growth}
        </span>
        <span className="text-slate-400 dark:text-slate-500 text-[10px]">
          {growthText}
        </span>
      </div>
    </div>
  );
}
