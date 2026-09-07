import React from 'react';

export default function NavigationItem({
  label,
  icon: Icon,
  active = false,
  badge = null,
  badgeColor = 'rose',
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer select-none group ${
        active
          ? 'bg-blue-50/90 text-blue-600 font-semibold dark:bg-blue-950/50 dark:text-blue-400'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 font-medium'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              active
                ? 'text-blue-600 dark:text-blue-400 stroke-[2.2]'
                : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 stroke-[1.8]'
            }`}
          />
        )}
        <span className="truncate text-[12px]">{label}</span>
      </div>

      {badge !== null && badge !== undefined && (
        <span
          className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold leading-none ${
            badgeColor === 'rose'
              ? 'bg-rose-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
