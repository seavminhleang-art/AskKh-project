import React from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";

export default function RecentMatches({
  matches = [],
  isAuthenticated = false,
  isLoading = false,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("dashboard.matchSummary")}
              </h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t("matchCenter.description")}
            </p>
          </div>
        </div>
        <Link
          to="/match-center"
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          {t("common.viewAll")}
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2.5 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="h-3.5 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-2.5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : !isAuthenticated || matches.length === 0 ? (
        /* Empty state strictly relevant to current user */
        <div className="text-center py-6 px-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-4 h-4" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t("dashboard.noMatches")}
          </p>
          <Link
            to="/match-center"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline pt-1"
          >
            <span>{t("navigation.matchCenter")}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      ) : (
        /* Matches List */
        <div className="space-y-2.5">
          {matches.map((item) => {
            const IconComponent = item.icon || ShieldCheck;
            const isHighConfidence = (item.confidence || 0) >= 80;
            return (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60 ${
                      item.iconColor ||
                      "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {item.foundDate || item.date}
                    </p>
                    {item.location && (
                      <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                      isHighConfidence
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60"
                        : "bg-amber-50 text-amber-600 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60"
                    }`}
                  >
                    {item.confidence ? `${item.confidence}%` : item.status}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{item.time || "recent"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
