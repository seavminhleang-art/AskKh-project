import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

export default function LostFoundStats({ summary, isLoading = false, isComingSoon = false }) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 space-y-1.5"
          >
            <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-8 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const {
    activeLost = isComingSoon ? '--' : 0,
    activeFound = isComingSoon ? '--' : 0,
    possibleMatches = isComingSoon ? '--' : 0,
    resolved = isComingSoon ? '--' : 0,
  } = summary || {};

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {/* 1. Active Lost Items */}
      <div className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <span className="text-[16px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          {t('lf_lost')}
        </span>
        <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
          {activeLost}
        </p>
      </div>

      {/* 2. Active Found Items */}
      <div className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <span className="text-[16px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
          {t('lf_found')}
        </span>
        <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
          {activeFound}
        </p>
      </div>

      {/* 3. Possible Matches */}
      <div className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <span className="text-[16px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          {t('lf_possible_matches')}
        </span>
        <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
          {possibleMatches}
        </p>
      </div>

      {/* 4. Resolved Items */}
      <div className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <span className="text-[16px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          {t('lf_resolved')}
        </span>
        <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight mt-0.5">
          {resolved}
        </p>
      </div>
    </div>
  );
}

