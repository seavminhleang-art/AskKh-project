import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while processing the request. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 my-4 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-xs">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mb-6">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="default" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry Request
        </Button>
      )}
    </div>
  );
}
