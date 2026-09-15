import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquarePlus,
  Search,
  X,
  Filter,
  AlertCircle,
  HelpCircle,
  LogIn,
} from "lucide-react";
import { useGetPostsQuery } from "../../features/posts/postApi";
import {
  useGetPopularTagsQuery,
  useGetTagsQuery,
} from "../../features/tags/tagApi";
import { useCurrentUser } from "../../features/dashboard/hooks/useDashboardData";
import { isItemOwnedByUser } from "../../features/activity/hooks/useMyActivity";
import QuestionCard from "../../Components/forum/QuestionCard";
import ForumSidebar from "../../Components/forum/ForumSidebar";
import { useLanguage } from "../../hooks/useLanguage";

export default function ForumHomePage() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useCurrentUser();

  // API Queries
  const {
    data: rawPosts,
    isLoading: postsLoading,
    isError: postsError,
    refetch: refetchPosts,
  } = useGetPostsQuery();

  const { data: popularTagsData } = useGetPopularTagsQuery();
  const { data: allTagsData } = useGetTagsQuery();

  // Local filter and search state
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const posts = useMemo(() => {
    return Array.isArray(rawPosts) ? rawPosts : [];
  }, [rawPosts]);

  // Extract / compile tags list
  const tagsList = useMemo(() => {
    if (Array.isArray(popularTagsData) && popularTagsData.length > 0) {
      return popularTagsData;
    }
    if (Array.isArray(allTagsData) && allTagsData.length > 0) {
      return allTagsData;
    }

    // Fallback: derive tags and frequencies directly from live posts
    const tagCountMap = {};
    posts.forEach((p) => {
      const pTags = Array.isArray(p.tagResponses)
        ? p.tagResponses.map((tr) =>
            typeof tr === "string" ? tr : tr.tagName || tr.name,
          )
        : Array.isArray(p.tags)
          ? p.tags
          : [];
      pTags.forEach((name) => {
        if (name) {
          tagCountMap[name] = (tagCountMap[name] || 0) + 1;
        }
      });
    });

    return Object.entries(tagCountMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [popularTagsData, allTagsData, posts]);

  // Calculate stats
  const communityStats = useMemo(() => {
    const totalQuestions = posts.length;
    let totalAnswers = 0;
    let answeredCount = 0;

    posts.forEach((p) => {
      const answers = Array.isArray(p.comments)
        ? p.comments.length
        : (p.commentCount ?? 0);
      totalAnswers += answers;
      if (answers > 0) answeredCount += 1;
    });

    return {
      totalQuestions,
      totalAnswers,
      answeredCount,
      activeMembers: Math.max(12, Math.round(posts.length * 1.5)),
    };
  }, [posts]);

  // Filter Counts for the 5 required tabs:
  // All Questions, Latest, Popular, Unanswered, My Questions
  const filterCounts = useMemo(() => {
    const myQuestionsCount =
      isAuthenticated && user
        ? posts.filter((p) => isItemOwnedByUser(p, user)).length
        : 0;

    const unansweredCount = posts.filter((p) => {
      const count = Array.isArray(p.comments)
        ? p.comments.length
        : (p.commentCount ?? 0);
      return count === 0;
    }).length;

    const popularCount = posts.filter(
      (p) => (p.score ?? 0) >= 3 || (p.viewCount ?? 0) >= 10,
    ).length;

    return {
      all: posts.length,
      latest: posts.length,
      popular: popularCount,
      unanswered: unansweredCount,
      "my-questions": myQuestionsCount,
    };
  }, [posts, user, isAuthenticated]);

  const filterTabs = [
    { id: "all", label: t("qa.allQuestions"), count: filterCounts.all },
    { id: "latest", label: t("qa.latest"), count: filterCounts.latest },
    { id: "popular", label: t("qa.popular"), count: filterCounts.popular },
    {
      id: "unanswered",
      label: t("qa.unanswered"),
      count: filterCounts.unanswered,
    },
    {
      id: "my-questions",
      label: t("qa.myQuestions"),
      count: filterCounts["my-questions"],
    },
  ];

  // Filtered and Sorted Questions
  const filteredQuestions = useMemo(() => {
    let list = [...posts];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((post) => {
        const titleMatch = post.title?.toLowerCase().includes(q);
        const bodyMatch = post.body?.toLowerCase().includes(q);
        const tagMatch = Array.isArray(post.tagResponses)
          ? post.tagResponses.some((t) => {
              const str = typeof t === "string" ? t : t.tagName || t.name;
              return str?.toLowerCase().includes(q);
            })
          : false;
        const authorMatch = post.ownerDisplayName?.toLowerCase().includes(q);
        return titleMatch || bodyMatch || tagMatch || authorMatch;
      });
    }

    // 2. Selected Tag Filter
    if (selectedTag) {
      const tagQuery = selectedTag.toLowerCase();
      list = list.filter((post) => {
        if (Array.isArray(post.tagResponses)) {
          return post.tagResponses.some((t) => {
            const str = typeof t === "string" ? t : t.tagName || t.name;
            return str?.toLowerCase() === tagQuery;
          });
        }
        if (Array.isArray(post.tags)) {
          return post.tags.some((t) => String(t).toLowerCase() === tagQuery);
        }
        return false;
      });
    }

    // 3. Tab Filter & Sorting
    switch (activeFilter) {
      case "latest":
        list.sort(
          (a, b) =>
            new Date(b.creationDate || 0) - new Date(a.creationDate || 0),
        );
        break;

      case "popular":
        list.sort((a, b) => {
          const scoreA =
            (a.score ?? 0) * 3 + (a.commentCount ?? 0) * 2 + (a.viewCount ?? 0);
          const scoreB =
            (b.score ?? 0) * 3 + (b.commentCount ?? 0) * 2 + (b.viewCount ?? 0);
          return scoreB - scoreA;
        });
        break;

      case "unanswered":
        list = list.filter((p) => {
          const count = Array.isArray(p.comments)
            ? p.comments.length
            : (p.commentCount ?? 0);
          return count === 0;
        });
        list.sort(
          (a, b) =>
            new Date(b.creationDate || 0) - new Date(a.creationDate || 0),
        );
        break;

      case "my-questions":
        if (!isAuthenticated || !user) {
          list = [];
        } else {
          list = list.filter((p) => isItemOwnedByUser(p, user));
          list.sort(
            (a, b) =>
              new Date(b.creationDate || 0) - new Date(a.creationDate || 0),
          );
        }
        break;

      case "all":
      default:
        list.sort(
          (a, b) =>
            new Date(b.creationDate || 0) - new Date(a.creationDate || 0),
        );
        break;
    }

    return list;
  }, [posts, searchQuery, selectedTag, activeFilter, user, isAuthenticated]);

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Header */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-3xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t("qa.title")}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                Community
              </span>
            </div>
            <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {t("qa.description")}
            </p>
          </div>

          <Link
            to="/questions/ask"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{t("qa.askQuestion")}</span>
          </Link>
        </div>
      </header>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("qa_search_placeholder")}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-2xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Filter Tabs (All Questions, Latest, Popular, Unanswered, My Questions) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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

          {/* Active Tag indicator */}
          {selectedTag && (
            <div className="flex items-center gap-1.5 text-lg shrink-0 self-end sm:self-center">
              <span className="text-slate-400">{t("qa_tag_filter")}:</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold text-[16px] border border-blue-200/60 dark:border-blue-800/60">
                {selectedTag}
              </span>
              <button
                type="button"
                onClick={() => setSelectedTag("")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[16px] underline cursor-pointer"
              >
                {t("qa_clear_tag")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Content: Questions List (8 cols on lg) */}
        <main className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">
              {t("qa_showing")} {filteredQuestions.length} {t("qa_discussions")}
            </span>
          </div>

          {/* 1. Loading Skeleton */}
          {postsLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs flex items-start gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : postsError ? (
            /* 2. Error State */
            <div className="p-6 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {t("forum_error")}
              </h3>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                {t("forum_error_sub")}
              </p>
              <button
                type="button"
                onClick={() => refetchPosts?.()}
                className="mt-2 px-3 py-1.5 text-lg font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-2xs"
              >
                {t("forum_retry")}
              </button>
            </div>
          ) : activeFilter === "my-questions" && !isAuthenticated ? (
            /* 3. My Questions Unauthenticated Notice */
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/60">
                <LogIn className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {t("state_401")}
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                  Sign in with your ISTAD scholar account to track your personal
                  questions here.
                </p>
              </div>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t("btn_sign_in")}</span>
              </Link>
            </div>
          ) : filteredQuestions.length === 0 ? (
            /* 4. Empty State */
            <div className="text-center py-14 px-4 bg-white dark:bg-slate-900 border border-dashed border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto border border-slate-200/60 dark:border-slate-700/60">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {activeFilter === "my-questions"
                    ? t("qa_my_questions_empty")
                    : t("qa_no_questions_found")}
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t("qa_no_questions_desc")}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/questions/ask"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>{t("qa_btn_ask")}</span>
                </Link>
              </div>
            </div>
          ) : (
            /* 5. Real Question Cards */
            filteredQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                onTagClick={(tag) => setSelectedTag(tag)}
                isAuthenticated={isAuthenticated}
              />
            ))
          )}
        </main>

        {/* Sidebar / Secondary Content (4 cols on lg) */}
        <div className="hidden lg:block lg:col-span-4">
          <ForumSidebar
            tags={tagsList}
            selectedTag={selectedTag}
            onSelectTag={(tag) => setSelectedTag(tag)}
            stats={communityStats}
            recentQuestions={posts.slice(0, 4)}
          />
        </div>
      </div>
    </div>
  );
}
