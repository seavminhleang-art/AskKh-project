import React from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  BarChart2,
  Clock,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

export default function ForumSidebar({
  tags = [],
  selectedTag = "",
  onSelectTag,
  stats = {
    totalQuestions: 0,
    totalAnswers: 0,
    answeredCount: 0,
    activeMembers: 0,
  },
  recentQuestions = [],
}) {
  const { t } = useTranslation();

  return (
    <aside className="space-y-4">
      {/* 1. Community Statistics */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
          <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold uppercase tracking-wider">
            {t("qa_community_stats")}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-lg font-black text-slate-900 dark:text-white block">
              {stats.totalQuestions}
            </span>
            <span className="text-[16px] text-slate-400 uppercase font-medium">
              {t("qa_stat_questions")}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="text-lg font-black text-slate-900 dark:text-white block">
              {stats.totalAnswers}
            </span>
            <span className="text-[16px] text-slate-400 uppercase font-medium">
              {t("qa_stat_answers")}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30">
            <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 block">
              {stats.answeredCount}
            </span>
            <span className="text-[16px] text-emerald-600 dark:text-emerald-400 uppercase font-medium">
              {t("qa_stat_answered")}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30">
            <span className="text-lg font-black text-blue-700 dark:text-blue-300 block">
              {stats.activeMembers || 12}
            </span>
            <span className="text-[16px] text-blue-600 dark:text-blue-400 uppercase font-medium">
              {t("qa_stat_members")}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Popular Tags */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
            <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-lg font-bold uppercase tracking-wider">
              {t("qa_popular_tags")}
            </h3>
          </div>
          {selectedTag && (
            <button
              type="button"
              onClick={() => onSelectTag?.("")}
              className="text-[16px] text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              {t("qa_clear_tag")}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.length === 0 ? (
            <span className="text-lg text-slate-400">No tags available</span>
          ) : (
            tags.slice(0, 15).map((tItem) => {
              const tagName =
                typeof tItem === "string" ? tItem : tItem.tagName || tItem.name;
              const tagCount =
                typeof tItem === "object" ? tItem.count : undefined;
              const isSelected =
                selectedTag.toLowerCase() === tagName.toLowerCase();

              return (
                <button
                  key={tagName}
                  type="button"
                  onClick={() => onSelectTag?.(isSelected ? "" : tagName)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-lg font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-primary text-white shadow-2xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 border border-slate-200/50 dark:border-slate-700/50"
                  }`}
                >
                  <span>{tagName}</span>
                  {tagCount !== undefined && (
                    <span className="text-[16px] opacity-70 font-normal">
                      ({tagCount})
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* 3. Recent Questions (Mini / visually smaller) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
          <Clock className="w-4 h-4 text-amber-500" />
          <h3 className="text-lg font-bold uppercase tracking-wider">
            {t("qa_recent_questions")}
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {recentQuestions.slice(0, 4).map((q) => (
            <div key={q.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
              <Link
                to={`/questions/${q.id}`}
                className="text-lg font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2 transition-colors leading-snug block"
              >
                {q.title}
              </Link>
              <div className="flex items-center justify-between text-[16px] text-slate-400 dark:text-slate-500">
                <span className="truncate max-w-[120px]">
                  {q.ownerDisplayName || q.author?.name || "ISTAD Member"}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-2.5 h-2.5" />
                  <span>
                    {Array.isArray(q.comments)
                      ? q.comments.length
                      : (q.commentCount ?? 0)}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Advice Card */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <CheckCircle2 className="w-4 h-4" />
          <h4 className="text-lg font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Community Advice
          </h4>
        </div>
        <p className="text-[16px] text-slate-500 dark:text-slate-400 leading-relaxed">
          Be concise in your title and include code snippets or logs to help
          your peers troubleshoot quickly.
        </p>
      </section>
    </aside>
  );
}
