import React from 'react';
import NavigationItem from './NavigationItem';

export default function NavigationSection({ title, items = [], activeItem, onSelect }) {
  return (
    <div className="space-y-0.5">
      {title && (
        <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
          {title}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavigationItem
            key={item.id || item.label}
            label={item.label}
            icon={item.icon}
            active={activeItem === (item.id || item.label)}
            badge={item.badge}
            badgeColor={item.badgeColor}
            onClick={() => onSelect && onSelect(item.id || item.label)}
          />
        ))}
      </div>
    </div>
  );
}
