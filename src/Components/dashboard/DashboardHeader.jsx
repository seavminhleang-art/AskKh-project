import React from 'react';

export default function DashboardHeader({
  title = 'Dashboard Overview',
  subtitle = "Welcome back, Sovannrith! Here's what's happening today.",
}) {
  return (
    <div className="space-y-0.5">
      <h1 className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}
