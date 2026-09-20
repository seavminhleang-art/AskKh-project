import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useGetPostsByScoreQuery, useGetPostsQuery } from "../../../features/posts/postApi";

export default function TrendingDiscussions({ darkMode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: scorePosts, isLoading: isScoreLoading, isError: isScoreError, refetch } = useGetPostsByScoreQuery();
  const { data: allPosts, isLoading: isAllLoading } = useGetPostsQuery(undefined, { skip: !isScoreError && !!scorePosts?.length });

  const rawPosts = (scorePosts && scorePosts.length > 0) ? scorePosts : (allPosts || []);
  const discussions = rawPosts.slice(0, 3);
  const isLoading = isScoreLoading && isAllLoading;

  return (
    <section className="mt-28 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className={`inline-block text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 cursor-pointer ${
            darkMode
              ? "bg-red-950/80 text-red-400"
              : "bg-[#fde0e0]/90 text-[var(--home-secondary-text)]"
          }`}
        >
          {t("discBadge")}
        </motion.div>

        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
          darkMode ? "text-red-400" : "text-[var(--home-secondary-text)]"
        }`}>
          {t("discTitle")}
        </h2>

        <div className="flex justify-end max-w-7xl mx-auto px-2">
          <Link to="/community/qa" className="text-[var(--home-link-text)] font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer">
            {t("discViewAll")} →
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`animate-pulse rounded-3xl p-6 flex flex-col justify-between h-64 ${
                darkMode ? "bg-zinc-900/60" : "bg-white/80"
              }`}
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                  <div className="h-5 w-20 bg-gray-300 dark:bg-zinc-800 rounded-full" />
                </div>
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-zinc-800 rounded-lg" />
                <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800/80 rounded" />
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-800/80 rounded" />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-zinc-800" />
                  <div className="h-4 w-24 bg-gray-300 dark:bg-zinc-800 rounded" />
                </div>
                <div className="h-4 w-12 bg-gray-300 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isScoreError && (!rawPosts || rawPosts.length === 0) ? (
        <div className={`rounded-3xl p-8 text-center border ${
          darkMode ? "bg-zinc-900/60 border-zinc-800 text-zinc-400" : "bg-white border-gray-100 text-gray-500"
        }`}>
          <p className="text-sm mb-3">Unable to load discussions at the moment.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : discussions.length === 0 ? (
        <div className={`rounded-3xl p-8 text-center border ${
          darkMode ? "bg-zinc-900/60 border-zinc-800 text-zinc-400" : "bg-white border-gray-100 text-gray-500"
        }`}>
          <p className="text-sm">No trending discussions yet. Be the first to start a conversation!</p>
          <Link
            to="/community/qa"
            className="mt-3 inline-block px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Go to Q&A Community
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {discussions.map((discussion, idx) => {
            const tags = discussion.tagResponses?.length
              ? discussion.tagResponses.map((t) => `#${t.tagName}`)
              : ['#Community', '#ISTAD'];
            const excerpt = discussion.body
              ? discussion.body.slice(0, 110) + (discussion.body.length > 110 ? '...' : '')
              : '';
            const authorName = discussion.ownerDisplayName || 'Scholar';
            const answersCount = discussion.comments?.length || 0;
            const scoreCount = discussion.score ?? 0;

            return (
              <motion.div
                key={discussion.id || idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate('/community/qa')}
                className={`backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
                  darkMode
                    ? "bg-zinc-900/90 text-slate-100"
                    : "bg-white/95 text-gray-800"
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          darkMode ? "bg-blue-950/80 text-blue-400" : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className={`text-base font-bold mb-2 leading-snug line-clamp-2 ${
                    darkMode ? "text-slate-100" : "text-gray-900"
                  }`}>
                    {discussion.title}
                  </h3>
                  <p className={`text-xs md:text-sm leading-relaxed mb-6 line-clamp-3 ${
                    darkMode ? "text-slate-400" : "text-gray-600"
                  }`}>
                    {excerpt}
                  </p>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t text-xs ${
                  darkMode ? "border-zinc-800 text-slate-400" : "border-gray-100 text-gray-500"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <span className={`font-medium truncate max-w-[120px] ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      {authorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                      <ChatBubbleLeftIcon className={`w-4 h-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
                      {answersCount}
                    </span>
                    <span className={`flex items-center gap-1 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                      <ArrowUpIcon className={`w-4 h-4 stroke-[2.5] ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                      {scoreCount}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}