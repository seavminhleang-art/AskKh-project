import React from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch, FileQuestion, PackageCheck, ExternalLink } from 'lucide-react';
import LostFoundPreviewCard from './LostFoundPreviewCard';

export default function RecentLostFound({
  items = [],
  isLoading = false,
  isError = false,
  isEmpty = false,
  isComingSoon = false,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Lost & Found Items
          </h4>
          {isComingSoon && (
            <span className="px-1.5 py-0.5 rounded text-[16px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              Coming Soon
            </span>
          )}
        </div>
        <Link
          to="/lost-found"
          className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <span>View all</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-2.5 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 w-full">
                <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isComingSoon ? (
        /* Professional Unavailable / Coming Soon State */
        <div className="text-center py-7 px-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-850/40 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/60">
            <PackageSearch className="w-5 h-5" />
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Lost & Found services are coming soon.
            </p>
            <p className="text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Campus item tracking, property recovery, and automated matching features are currently in development.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Link
              to="/lost-found"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-lg font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
            >
              <FileQuestion className="w-3.5 h-3.5 text-rose-500" />
              <span>Report Lost Item</span>
            </Link>
            <Link
              to="/lost-found"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-lg font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
            >
              <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Report Found Item</span>
            </Link>
            <Link
              to="/lost-found"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
            >
              <span>View Lost & Found</span>
            </Link>
          </div>
        </div>
      ) : isError ? (
        <div className="text-center py-6 text-lg text-slate-400">
          Unable to load recent reports.
        </div>
      ) : isEmpty || items.length === 0 ? (
        <div className="text-center py-6 text-lg text-slate-400">
          No reports found. Help others by reporting found items!
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <LostFoundPreviewCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
