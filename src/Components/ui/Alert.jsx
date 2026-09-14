import React from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const alertStyles = {
  info: 'border-[#C9D8EF] bg-brand-primary-light text-brand-primary dark:border-[#315789] dark:bg-[#102A56]/50 dark:text-[#B8D0F0]',
  success: 'border-emerald-200 bg-brand-accent-light text-brand-accent dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300',
  warning: 'border-amber-200 bg-brand-warning-light text-brand-warning dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300',
  error: 'border-rose-200 bg-brand-secondary-light text-brand-secondary dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300',
};

const alertIcons = { info: Info, success: CheckCircle2, warning: TriangleAlert, error: AlertCircle };

export default function Alert({ variant = 'info', title, children, className, ...props }) {
  const Icon = alertIcons[variant] || Info;
  return (
    <div role="alert" className={cn('flex gap-3 rounded-2xl border p-4 text-sm', alertStyles[variant], className)} {...props}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title && <h2 className="font-bold">{title}</h2>}
        {children && <div className={cn(title && 'mt-1', 'leading-relaxed')}>{children}</div>}
      </div>
    </div>
  );
}
