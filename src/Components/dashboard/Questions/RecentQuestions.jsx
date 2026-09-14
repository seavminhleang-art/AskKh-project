import React from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  ThumbsUp,
  Tag,
  Clock,
  MessageSquarePlus,
  AlertCircle,
  Eye,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";

export default function RecentQuestions({
  questions = [],
  isLoading = false,
  isError = false,
  isEmpty = false,
  onRetry,
}) {
  const { t } = useLanguage();

  const totalCount = questions.length;
  const answeredCount = questions.filter((q) => q.answersCount > 0).length;
  const unansweredCount = questions.filter((q) => q.answersCount === 0).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {t("dashboard.recentForum")}
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t("dashboard.recentForumDescription")}
            </p>
          </div>
        </div>
        <Link
          to="/questions"
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          {t("common.viewAll")}
        </Link>
      </div>

      {/* Compact Metrics Row */}
      <div className="grid grid-cols-3 gap-2 py-1">
        <div className="p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase block">
            {t("common.all")}
          </span>
          <span className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
            {isLoading ? "--" : totalCount}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/70 dark:border-emerald-900/30 text-center">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase block">
            {t("qa.answers")}
          </span>
          <span className="text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {isLoading ? "--" : answeredCount}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/70 dark:border-rose-900/30 text-center">
          <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase block">
            {t("qa.unanswered")}
          </span>
          <span className="text-base sm:text-lg font-bold text-rose-700 dark:text-rose-300">
            {isLoading ? "--" : unansweredCount}
          </span>
        </div>
      </div>

      {/* 1. Loading State */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-2"
            >
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : isError ? (
        /* 2. Error State */
        <div className="p-3.5 rounded-lg border border-rose-100 dark:border-rose-950/50 bg-rose-50/50 dark:bg-rose-950/20 text-center space-y-1.5">
          <AlertCircle className="w-4 h-4 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t("common.retry")}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1 px-2.5 py-1 text-xs font-medium rounded-md bg-rose-600 text-white hover:bg-rose-700 transition-colors"
            >
              {t("common.retry")}
            </button>
          )}
        </div>
      ) : isEmpty || questions.length === 0 ? (
        /* 3. Empty State */
        <div className="text-center py-6 px-3 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg space-y-2.5">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {t("qa.noQuestions")}
          </p>
          <Link
            to="/questions/ask"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>{t("qa.askFirstQuestion")}</span>
          </Link>
        </div>
      ) : (
        /* 4. Real Data List */
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {questions.slice(0, 5).map((q) => (
            <div key={q.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
              <div className="flex items-start justify-between gap-3">
                <Link
                  to={`/questions/${q.id}`}
                  className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 transition-colors leading-snug"
                >
                  {q.title}
                </Link>

                <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  <ThumbsUp className="w-3 h-3 text-slate-500" />
                  <span>{q.score}</span>
                </div>
              </div>

              {q.body && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-1 leading-relaxed">
                  {q.body.replace(/<[^>]+>/g, "")}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400 dark:text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-600 dark:text-slate-400">
                    {q.author}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(q.creationDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {Array.isArray(q.tags) && q.tags.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-medium">
                      <Tag className="w-2.5 h-2.5" />
                      {q.tags[0]}
                    </span>
                  )}
                  {q.views !== undefined && (
                    <span className="flex items-center gap-1 font-medium">
                      <Eye className="w-3 h-3" />
                      <span>{q.views}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-1 font-medium">
                    <MessageSquare className="w-3 h-3" />
                    <span>
                      {q.answersCount}{" "}
                      {q.answersCount === 1 ? t("qa.answer") : t("qa.answers")}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
