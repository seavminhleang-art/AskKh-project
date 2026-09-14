<<<<<<< HEAD
import * as React from "react";
import { cn } from "@/lib/utils";
=======
import * as React from 'react';
import { cn } from '@/lib/utils';
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
    <table
      ref={ref}
<<<<<<< HEAD
      className={cn("w-full caption-bottom text-lg text-left", className)}
=======
      className={cn('w-full caption-bottom text-sm text-left', className)}
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
      {...props}
    />
  </div>
));
<<<<<<< HEAD
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-slate-50 border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 text-lg uppercase font-semibold text-slate-500 dark:text-slate-400",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";
=======
Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-slate-50 border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
<<<<<<< HEAD
    className={cn(
      "divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900",
      className,
    )}
    {...props}
  />
));
TableBody.displayName = "TableBody";
=======
    className={cn('divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
<<<<<<< HEAD
      "transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 data-[state=selected]:bg-slate-100",
      className,
=======
      'transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50 data-[state=selected]:bg-slate-100',
      className
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
    )}
    {...props}
  />
));
<<<<<<< HEAD
TableRow.displayName = "TableRow";
=======
TableRow.displayName = 'TableRow';
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
<<<<<<< HEAD
      "h-11 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0",
      className,
=======
      'h-11 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0',
      className
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208
    )}
    {...props}
  />
));
<<<<<<< HEAD
TableHead.displayName = "TableHead";
=======
TableHead.displayName = 'TableHead';
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
<<<<<<< HEAD
    className={cn(
      "p-4 align-middle text-slate-700 dark:text-slate-200 [&:has([role=checkbox])]:pr-0",
      className,
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";
=======
    className={cn('p-4 align-middle text-slate-700 dark:text-slate-200 [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';
>>>>>>> c95dceb8fc3302d5c22d01ba74f656f25fb65208

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
export default Table;
