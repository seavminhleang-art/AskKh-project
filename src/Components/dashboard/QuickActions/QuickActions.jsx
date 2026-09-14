import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquarePlus,
  FileQuestion,
  PackageCheck,
  Zap,
} from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";

export default function QuickActions({
  onAskQuestion,
  onReportLost,
  onReportFound,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("dashboard.quickActions")}
          </h3>
        </div>
        <span className="text-[16px] font-medium text-slate-400 dark:text-slate-500">
          {t("dashboard.shortcuts")}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5">
        {/* 1. Ask Question */}
        <Link
          to="/questions/ask"
          onClick={onAskQuestion}
          className="flex items-center sm:flex-col lg:flex-row sm:justify-center lg:justify-start p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800/60 transition-all gap-3 sm:gap-2 lg:gap-3 text-left sm:text-center lg:text-left group shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <MessageSquarePlus className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 sm:w-full lg:w-auto">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight block truncate">
              {t("dashboard.askQuestion")}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 block truncate mt-0.5">
              {t("dashboard.askQuestionDesc")}
            </span>
          </div>
        </Link>

        {/* 2. Report Lost Item */}
        <Link
          to="/lost-found/report?type=LOST"
          onClick={onReportLost}
          className="flex items-center sm:flex-col lg:flex-row sm:justify-center lg:justify-start p-3 rounded-xl border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-100/60 dark:hover:bg-rose-900/30 hover:border-rose-200 dark:hover:border-rose-800/60 transition-all gap-3 sm:gap-2 lg:gap-3 text-left sm:text-center lg:text-left group shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <FileQuestion className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 sm:w-full lg:w-auto">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight block truncate">
              {t("dashboard.reportLostItem")}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 block truncate mt-0.5">
              {t("dashboard.reportLostItemDesc")}
            </span>
          </div>
        </Link>

        {/* 3. Report Found Item */}
        <Link
          to="/lost-found/report?type=FOUND"
          onClick={onReportFound}
          className="flex items-center sm:flex-col lg:flex-row sm:justify-center lg:justify-start p-3 rounded-xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800/60 transition-all gap-3 sm:gap-2 lg:gap-3 text-left sm:text-center lg:text-left group shadow-2xs"
        >
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1 sm:w-full lg:w-auto">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight block truncate">
              {t("dashboard.reportFoundItem")}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 block truncate mt-0.5">
              {t("dashboard.reportFoundItemDesc")}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
