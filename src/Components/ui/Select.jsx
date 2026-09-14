import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ className, children, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2 pr-9 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100',
          error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/30 dark:border-rose-500',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
export default Select;
