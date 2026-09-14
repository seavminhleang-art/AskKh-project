import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Modal({ isOpen, onClose, title, children, className, labelledBy = 'dialog-title' }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => event.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-sm" aria-label="Close dialog" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? labelledBy : undefined}
        className={cn('relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900', className)}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          {title && <h2 id={labelledBy} className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>}
          <button type="button" aria-label="Close dialog" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
