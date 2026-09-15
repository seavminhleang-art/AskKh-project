import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  CheckCircle2,
  FileQuestion,
  PackageCheck,
  ShieldCheck,
  MessageSquare,
  Clock,
  Calendar,
  Filter,
  ArrowRight,
  UserCheck,
  Search,
  ThumbsUp,
  Tag,
  MapPin,
  Eye,
  Plus,
  MessageSquarePlus,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import { useMyActivity } from "../../features/activity/hooks/useMyActivity";

const activityConfig = {
  question: {
    icon: HelpCircle,
    color:
      "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40",
    badge:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60",
  },
  answer: {
    icon: CheckCircle2,
    color:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60",
  },
  comment: {
    icon: MessageSquare,
    color:
      "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40",
    badge:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-800/60",
  },
  lost: {
    icon: FileQuestion,
    color:
      "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-100 dark:border-rose-900/40",
    badge:
      "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200/60 dark:border-rose-800/60",
  },
  found: {
    icon: PackageCheck,
    color:
      "text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-100 dark:border-teal-900/40",
    badge:
      "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200/60 dark:border-teal-800/60",
  },
  claim: {
    icon: ShieldCheck,
    color:
      "text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60",
  },
};

export default function ActivityPage() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { activities, counts, isAuthenticated, isLoading, isError } =
    useMyActivity();

  // 6 Required filter tabs
  const filterTabs = [
    { id: "all", label: t("activity.all"), count: counts.all },
    {
      id: "questions",
      label: t("activity.questions"),
      count: counts.questions,
    },
    { id: "answers", label: t("activity.answers"), count: counts.answers },
    { id: "comments", label: t("activity.comments"), count: counts.comments },
    {
      id: "lost-found",
      label: t("activity.lostFound"),
      count: counts["lost-found"],
    },
    { id: "claims", label: t("activity.claims"), count: counts.claims },
  ];

  // Client-side filtering by category and search query
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      // 1. Category Filter
      if (activeFilter !== "all" && item.category !== activeFilter) {
        return false;
      }

      // 2. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const tagMatch = item.tags?.some((t) =>
          t.toLowerCase().includes(query),
        );
        const typeMatch = item.type?.toLowerCase().includes(query);
        return titleMatch || descMatch || tagMatch || typeMatch;
      }

      return true;
    });
  }, [activities, activeFilter, searchQuery]);

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-3xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("activity.title")}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-lg font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>ISTAD Scholar</span>
              </span>
            </div>
            <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {t("activity.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/questions/ask"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-brand-primary dark:text-blue-400" />
              <span>{t("dashboard.askQuestion")}</span>
            </Link>
            <Link
              to="/lost-found/report"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t("dashboard.reportLostItem")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Error Banner */}
      {isError && (
        <div className="p-3.5 rounded-xl border border-rose-200/70 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 flex items-center gap-2.5 text-lg text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{t("state_error")}</span>
        </div>
      )}

      {/* 3. Unauthenticated Banner */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-xl border border-blue-200/70 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-lg">
          <div className="flex items-center gap-2.5 text-blue-900 dark:text-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{t("activity_sign_in_prompt")}</span>
          </div>
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shrink-0 text-center shadow-2xs"
          >
            {t("nav_sign_in")}
          </Link>
        </div>
      )}

      {/* 4. Search & Filter Bar */}

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* 6 Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1 pr-1 text-slate-400 shrink-0">
              <Filter className="w-3.5 h-3.5" />
            </div>
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-lg font-semibold transition-all shrink-0 cursor-pointer select-none ${
                    isActive
                      ? "bg-brand-primary text-white shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative shrink-0 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your activity..."
              className="w-full pl-8 pr-3 py-1.5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>
      </div>

      {/* 4. Activity Timeline List */}
      <main className="space-y-3">
        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          /* 5. Empty State strictly compliant with prompt: "No activity yet." + Useful actions */
          <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto border border-slate-200/60 dark:border-slate-700/60">
              <Inbox className="w-6 h-6" />
            </div>

            <div className="space-y-1 max-w-sm mx-auto">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t("activity.noActivity")}
              </h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                {t("activity.noActivityDesc")}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Link
                to="/questions/ask"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{t("dashboard.askQuestion")}</span>
              </Link>
              <Link
                to="/lost-found/report"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t("dashboard.reportLostItem")}</span>
              </Link>
            </div>
          </div>
        ) : (
          /* 6. Activity Item Cards */
          filteredActivities.map((act) => {
            const config =
              activityConfig[act.iconType] || activityConfig.question;
            const Icon = config.icon;

            return (
              <article
                key={act.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start gap-3.5 group"
              >
                {/* Activity Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs ${config.color}`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  {/* Top line: Type badge + Date + Time + Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${config.badge}`}
                      >
                        {act.type}
                      </span>
                      <span className="text-[10px] text-slate-400">•</span>
                      <span className="text-[16px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{act.date}</span>
                      </span>
                      {act.time && (
                        <span className="text-[16px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{act.time}</span>
                        </span>
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                      {act.status}
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    to={act.link}
                    className="text-lg sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 block transition-colors leading-snug"
                  >
                    {act.title}
                  </Link>

                  {/* Description */}
                  {act.description && (
                    <p className="text-lg text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {act.description}
                    </p>
                  )}

                  {/* Related content / Tags / Metrics */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[16px] text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {Array.isArray(act.tags) &&
                        act.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                          >
                            <Tag className="w-2.5 h-2.5 opacity-60" />
                            <span>{tag}</span>
                          </span>
                        ))}
                      {act.location && (
                        <span className="inline-flex items-center gap-1 text-[16px] text-slate-500 dark:text-slate-400 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{act.location}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 font-medium shrink-0">
                      {act.score !== undefined && (
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3 text-slate-400" />
                          <span>{act.score}</span>
                        </span>
                      )}
                      {act.views !== undefined && (
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{act.views}</span>
                        </span>
                      )}
                      {act.answersCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-slate-400" />
                          <span>{act.answersCount}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Arrow Right to View */}
                <Link
                  to={act.link}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0 self-center"
                  aria-label="View activity details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })
        )}
      </main>
    </div>
  );
}
