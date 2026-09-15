import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Clock, Sparkles, XCircle, ShieldCheck } from 'lucide-react';

export default function StatusBadge({ status, className }) {
  const normalized = status ? status.toUpperCase() : '';

  switch (normalized) {
    case 'LOST':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          LOST
        </span>
      );
    case 'FOUND':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
            className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          FOUND
        </span>
      );
    case 'RECOVERED':
    case 'COMPLETED':
    case 'RESOLVED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60',
            className
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          {normalized}
        </span>
      );
    case 'PENDING':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60',
            className
          )}
        >
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          PENDING
        </span>
      );
    case 'APPROVED':
    case 'CONFIRMED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60',
            className
          )}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          {normalized}
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
            className
          )}
        >
          <XCircle className="w-3.5 h-3.5" />
          REJECTED
        </span>
      );
    case 'NEW':
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800/60',
            className
          )}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          NEW MATCH
        </span>
      );
    default:
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
            className
          )}
        >
          {status}
        </span>
      );
  }
}
