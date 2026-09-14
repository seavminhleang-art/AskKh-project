import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

export default function SidebarItem({ item, isActive, onClick }) {
  const { t } = useLanguage();
  const Icon = item.icon;
  const displayLabel = item.labelKey ? t(item.labelKey) : item.label;

  const baseClasses =
    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-lg transition-all duration-150 cursor-pointer select-none group';

  const stateClasses = isActive
    ? 'bg-blue-50/90 text-[#102A56] font-semibold dark:bg-[#102A56]/50 dark:text-[#B8D0F0]'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60 font-medium';

  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={`${baseClasses} ${stateClasses}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors stroke-[1.9] ${
              isActive
                ? 'text-[#102A56] dark:text-[#B8D0F0]'
                : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
            }`}
          />
        )}
        <span className="truncate text-[12px]">{displayLabel}</span>
      </div>

      {item.badge !== null && item.badge !== undefined && (
        <span
          className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold leading-none ${
            item.badgeColor === 'rose'
              ? 'bg-rose-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}
