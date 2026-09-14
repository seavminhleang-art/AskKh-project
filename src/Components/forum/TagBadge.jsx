import React from 'react';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TagBadge({ children, className, ...props }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-lg border border-[#C9D8EF] bg-brand-primary-light px-2 py-1 text-lg font-semibold text-brand-primary dark:border-[#315789] dark:bg-[#102A56]/50 dark:text-[#B8D0F0]', className)} {...props}>
      <Tag className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}
