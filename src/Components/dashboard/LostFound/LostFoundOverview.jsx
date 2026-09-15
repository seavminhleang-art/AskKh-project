import React from "react";
import { Package, AlertTriangle } from "lucide-react";
import LostFoundStats from "./LostFoundStats";
import RecentLostFound from "./RecentLostFound";
import { useTranslation } from "../../../hooks/useTranslation";

export default function LostFoundOverview({
  summary,
  items = [],
  isLoading = false,
  isError = false,
  isComingSoon = true,
}) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-brand-primary dark:text-blue-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {t("lf_title")}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
                {t("lf_in_dev")}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t("lf_subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Dev Mock Notice Banner */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300 leading-snug">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <span>{t("lf_dev_notice")}</span>
      </div>

      {/* 4 Cards: Lost, Found, Possible Matches, Resolved */}
      <LostFoundStats
        summary={summary}
        isLoading={isLoading}
        isComingSoon={isComingSoon}
      />

      {/* Recent Lost & Found Items */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <RecentLostFound
          items={items}
          isLoading={isLoading}
          isError={isError}
          isComingSoon={isComingSoon}
          isEmpty={items.length === 0}
        />
      </div>
    </div>
  );
}
