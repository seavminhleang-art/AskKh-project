import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function HelpCard() {
  return (
    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
      <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
        <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <h4 className="text-xs font-bold leading-tight">Need Help?</h4>
      </div>
      <p className="text-[10px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
        Check our FAQ or contact support.
      </p>
      <button
        type="button"
        className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-[11px] font-semibold transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer select-none"
      >
        <span>Help Center</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
