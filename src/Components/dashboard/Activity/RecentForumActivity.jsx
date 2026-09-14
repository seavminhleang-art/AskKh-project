import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquarePlus,
  AlertCircle,
  History,
  UserCheck,
} from "lucide-react";
import ActivityItem from "./ActivityItem";
import { useLanguage } from "../../../hooks/useLanguage";

export default function RecentForumActivity({
  activities = [],
  isLoading = false,
  isError = false,
  isEmpty = false,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("dashboard.recentActivity")}
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                <UserCheck className="w-2.5 h-2.5" />
                <span>{t("activity.title")}</span>
              </span>
            </div>
            <p className="text-[16px] text-slate-400 dark:text-slate-500">
              {t("activity.subtitle")}
            </p>
          </div>
        </div>
        <Link
          to="/my-activity"
          className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          {t("common.viewAll")}
        </Link>
      </div>

      {/* 1. Loading State */}
      {isLoading ? (
        <div className="space-y-2.5 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 flex items-start gap-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-2.5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        /* 2. Error State */
        <div className="p-3 rounded-lg border border-rose-100 dark:border-rose-950/50 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-1">
          <AlertCircle className="w-4 h-4 text-rose-500 mx-auto" />
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {t("common.retry")}
          </p>
        </div>
      ) : isEmpty || activities.length === 0 ? (
        /* 3. Empty State */
        <div className="text-center py-6 px-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-2.5">
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            {t("activity.noActivity")}
          </p>
          <p className="text-[16px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
            {t("activity.noActivityDesc")}
          </p>
          <Link
            to="/questions/ask"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{t("dashboard.askQuestion")}</span>
          </Link>
        </div>
      ) : (
        /* 4. Real Data List */
        <div className="space-y-2.5">
          {activities.map((item) => (
            <ActivityItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
