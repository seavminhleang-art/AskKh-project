import React from 'react';
import { Search } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
        <Search className="w-4 h-4 stroke-[2.5]" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
          AskKH
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate">
          Lost & Found Platform
        </span>
      </div>
    </div>
  );
}
