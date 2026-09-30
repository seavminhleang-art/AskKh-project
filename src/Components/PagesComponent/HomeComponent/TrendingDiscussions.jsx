import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChatBubbleLeftIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { useGetPostsQuery } from "@/features/posts/postApi";
import { rowsOf, mapPost } from "@/features/qa/model";

export default function TrendingDiscussions({ darkMode }) {
  const { t } = useTranslation();
  const { data: postsData } = useGetPostsQuery();

  const apiPosts = rowsOf(postsData)
    .slice(0, 3)
    .map((p) => mapPost(p));

  const fallbackDiscussions = [
    {
      id: 101,
      tags: ["#React", "#ISTAD", "#SpringBoot"],
      tagColors: [
        darkMode ? "bg-blue-950/80 text-blue-400" : "bg-blue-50 text-blue-600",
        darkMode ? "bg-zinc-800 text-slate-300" : "bg-gray-100 text-gray-600",
        darkMode
          ? "bg-indigo-950/80 text-indigo-400"
          : "bg-indigo-50 text-indigo-600",
      ],
      title: t("disc1Title"),
      excerpt: t("disc1Excerpt"),
      author: "Sokcheat Srorng",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      answers: "12 Answers",
      votes: 48,
    },
    {
      id: 102,
      tags: ["#Database", "#PostgreSQL", "#SQL"],
      tagColors: [
        darkMode
          ? "bg-emerald-950/80 text-emerald-400"
          : "bg-emerald-50 text-emerald-600",
        darkMode ? "bg-zinc-800 text-slate-300" : "bg-gray-100 text-gray-600",
        darkMode ? "bg-teal-950/80 text-teal-400" : "bg-teal-50 text-teal-600",
      ],
      title: t("disc2Title"),
      excerpt: t("disc2Excerpt"),
      author: "Seavminh Leang",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      answers: "25 Answers",
      votes: 42,
    },
    {
      id: 103,
      tags: ["#Career", "#Internship", "#Frontend"],
      tagColors: [
        darkMode
          ? "bg-amber-950/80 text-amber-400"
          : "bg-amber-50 text-amber-600",
        darkMode ? "bg-zinc-800 text-slate-300" : "bg-gray-100 text-gray-600",
        darkMode ? "bg-rose-950/80 text-rose-400" : "bg-rose-50 text-rose-600",
      ],
      title: t("disc3Title"),
      excerpt: t("disc3Excerpt"),
      author: "Lisa Mom",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      answers: "8 Answers",
      votes: 35,
    },
  ];

  const discussions =
    apiPosts.length >= 3
      ? apiPosts.map((post, idx) => ({
          id: post.id,
          tags:
            post.tags?.length > 0
              ? post.tags.map((t) => `#${t}`)
              : ["#Community", "#ISTAD"],
          tagColors: [
            darkMode
              ? "bg-blue-950/80 text-blue-400"
              : "bg-blue-50 text-blue-600",
            darkMode
              ? "bg-zinc-800 text-slate-300"
              : "bg-gray-100 text-gray-600",
            darkMode
              ? "bg-indigo-950/80 text-indigo-400"
              : "bg-indigo-50 text-indigo-600",
          ],
          title: post.title,
          excerpt:
            post.body?.length > 130
              ? post.body.slice(0, 130) + "…"
              : post.body || "Join the conversation on AskKh.",
          author: post.ownerDisplayName || "Community Member",
          avatar:
            post.ownerProfileImage ||
            fallbackDiscussions[idx % fallbackDiscussions.length].avatar,
          answers: `${post.commentCount ?? 0} Answers`,
          votes: post.score ?? 0,
        }))
      : fallbackDiscussions;

  return (
    <section className="mt-28 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          className={`inline-block text-base font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 cursor-pointer ${
            darkMode
              ? "bg-red-950/80 text-red-400"
              : "bg-[#fde0e0]/90 text-[var(--home-secondary-text)]"
          }`}
        >
          {t("discBadge")}
        </motion.div>

        <h2
          className={`text-5xl md:text-5xl font-bold mb-4 ${
            darkMode ? "text-red-400" : "text-[var(--home-secondary-text)]"
          }`}
        >
          {t("discTitle")}
        </h2>

        <div className="flex justify-end max-w-7xl mx-auto px-2">
          <Link
            to="/community/qa"
            className="text-[var(--home-link-text)] font-semibold text-base flex items-center gap-1 hover:underline cursor-pointer"
          >
            {t("discViewAll")} →
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {discussions.map((discussion, idx) => (
          <Link
            to="/community/qa"
            key={discussion.id || idx}
            className="no-underline block"
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`h-full backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between transition-colors duration-300 ${
                darkMode
                  ? "bg-zinc-900/90 text-slate-100 hover:border-zinc-700"
                  : "bg-white/95 text-gray-800 hover:shadow-lg"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {discussion.tags.slice(0, 3).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-base font-semibold px-2.5 py-1 rounded-full ${
                        discussion.tagColors[tIdx] || discussion.tagColors[0]
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3
                  className={`text-base font-bold mb-2 leading-snug line-clamp-2 ${
                    darkMode ? "text-slate-100" : "text-gray-900"
                  }`}
                >
                  {discussion.title}
                </h3>
                <p
                  className={`text-base leading-relaxed mb-6 line-clamp-3 ${
                    darkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {discussion.excerpt}
                </p>
              </div>

              <div
                className={`flex items-center justify-between pt-4 border-t text-base ${
                  darkMode
                    ? "border-zinc-800 text-slate-400"
                    : "border-gray-100 text-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={discussion.avatar}
                    alt={discussion.author}
                    className={`w-7 h-7 rounded-full object-cover border ${
                      darkMode ? "border-zinc-700" : "border-gray-200"
                    }`}
                  />
                  <span
                    className={`font-medium text-base sm:text-base truncate max-w-[110px] ${
                      darkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    {discussion.author}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-1 text-base ${
                      darkMode ? "text-slate-400" : "text-gray-500"
                    }`}
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    {discussion.answers}
                  </span>
                  <span
                    className={`flex items-center gap-1 font-semibold text-base ${
                      darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    <ArrowUpIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                    {discussion.votes}
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
