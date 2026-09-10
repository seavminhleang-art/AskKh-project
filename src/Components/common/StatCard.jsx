import React from 'react';
import Card from '../ui/Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendDirection = 'up',
  colorScheme = 'blue',
  className = '',
}) {
  const colorStyles = {
    blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    rose: 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
  };

  return (
    <Card className={cn('p-5 overflow-hidden relative', className)} hover>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h4>
        </div>

        {Icon && (
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs', colorStyles[colorScheme] || colorStyles.blue)}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-bold',
                trendDirection === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {trendDirection === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 dark:text-slate-400 truncate">{subtitle}</span>}
        </div>
      )}
    </Card>
  );
}
