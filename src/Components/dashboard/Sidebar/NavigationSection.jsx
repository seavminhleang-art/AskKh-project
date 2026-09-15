import React from 'react';
import NavigationItem from './NavigationItem';
import { isNavItemActive } from '../../../constants/navigation';
import { useLanguage } from '../../../hooks/useLanguage';

export default function NavigationSection({
  title,
  sectionKey,
  items = [],
  activeItem,
  location,
  onSelect,
}) {
  const { t } = useLanguage();
  const displayTitle = sectionKey ? t(sectionKey) : title;

  return (
    <div className="space-y-0.5">
      {displayTitle && (
        <p className="px-3 pt-3 pb-1 text-[16px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
          {displayTitle}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = location
            ? isNavItemActive(location.pathname, item)
            : activeItem === (item.id || item.label);

          const displayLabel = item.labelKey ? t(item.labelKey) : item.label;

          return (
            <NavigationItem
              key={item.id || item.label}
              label={displayLabel}
              icon={item.icon}
              to={item.to}
              active={isActive}
              badge={item.badge}
              badgeColor={item.badgeColor}
              onClick={() => onSelect && onSelect(item.id || item.label)}
            />
          );
        })}
      </div>
    </div>
  );
}
