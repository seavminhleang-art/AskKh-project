import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function MatchCenterSummary({ summary, isAvailable = false }) {
  const metrics = [
    {
      label: "Potential Matches",
      value:
        isAvailable && summary?.potentialMatches !== undefined
          ? summary.potentialMatches
          : "--",
    },
    {
      label: "High Confidence",
      value:
        isAvailable && summary?.highConfidence !== undefined
          ? summary.highConfidence
          : "--",
    },
    {
      label: "Needs Review",
      value:
        isAvailable && summary?.needsReview !== undefined
          ? summary.needsReview
          : "--",
    },
    {
      label: "Recently Added",
      value:
        isAvailable && summary?.recentlyAdded !== undefined
          ? summary.recentlyAdded
          : "--",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Match Center
          </h3>
        </div>
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
          In Development
        </span>
      </div>

      {/* 4 Summary Metrics */}
      <div className="grid grid-cols-2 gap-2">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850"
          >
            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block truncate">
              {m.label}
            </span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200">
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Supporting text */}
      <p className="text-[16px] text-slate-400 dark:text-slate-500 leading-relaxed">
        Smart matching connects reported lost items with campus found items
        automatically.
      </p>

      {/* Footer Link to /match-center */}
      <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <Link
          to="/match-center"
          className="inline-flex items-center gap-1 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <span>View Match Center</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
