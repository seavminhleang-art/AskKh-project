import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoteControl({ score = 0, onUpvote, onDownvote, disabled = false, upvoted = false, downvoted = false, className }) {
  return (
    <div className={cn('flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 sm:flex-col', className)} aria-label={`Score: ${score}`}>
      <button type="button" disabled={disabled || !onUpvote} onClick={onUpvote} aria-label="Upvote" className={cn('rounded-lg p-1 text-slate-500 hover:bg-brand-primary-light hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-[#102A56]/50 dark:hover:text-[#B8D0F0]', upvoted && 'bg-brand-primary text-white hover:bg-brand-primary')}>
        <ChevronUp className="h-4 w-4" />
      </button>
      <output className="min-w-6 text-center text-lg font-bold text-slate-800 dark:text-slate-100">{score}</output>
      <button type="button" disabled={disabled || !onDownvote} onClick={onDownvote} aria-label="Downvote" className={cn('rounded-lg p-1 text-slate-500 hover:bg-brand-secondary-light hover:text-brand-secondary disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-300', downvoted && 'bg-brand-secondary text-white hover:bg-brand-secondary')}>
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  );
}
