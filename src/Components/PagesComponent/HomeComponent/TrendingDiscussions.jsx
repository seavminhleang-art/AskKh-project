import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChatBubbleLeftIcon, ArrowUpIcon } from "@heroicons/react/24/outline";

export default function TrendingDiscussions({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();

  const discussions = [
    {
      tags: ["#React", "#ISTAD"],
      tagColors: [
        darkMode 
          ? "bg-blue-950/80 text-blue-400 border border-blue-800" 
          : "bg-blue-50 text-blue-600",
        darkMode 
          ? "bg-zinc-800 text-slate-300 border border-zinc-700" 
          : "bg-gray-100 text-gray-600"
      ],
      title: t("disc1Title"),
      excerpt: t("disc1Excerpt"),
      author: t("disc1Author"),
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      answers: t("disc1Answers"),
      votes: "24",
      hoverText: t("disc1Hover"),
    },
    {
      tags: ["#Database", "#SQL"],
      tagColors: [
        darkMode 
          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" 
          : "bg-emerald-50 text-emerald-600",
        darkMode 
          ? "bg-zinc-800 text-slate-300 border border-zinc-700" 
          : "bg-gray-100 text-gray-600"
      ],
      title: t("disc2Title"),
      excerpt: t("disc2Excerpt"),
      author: t("disc2Author"),
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      answers: t("disc2Answers"),
      votes: "42",
      hoverText: t("disc2Hover"),
    },
    {
      tags: ["#Career", "#Internship"],
      tagColors: [
        darkMode 
          ? "bg-amber-950/80 text-amber-400 border border-amber-800" 
          : "bg-amber-50 text-amber-600",
        darkMode 
          ? "bg-zinc-800 text-slate-300 border border-zinc-700" 
          : "bg-gray-100 text-gray-600"
      ],
      title: t("disc3Title"),
      excerpt: t("disc3Excerpt"),
      author: t("disc3Author"),
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      answers: t("disc3Answers"),
      votes: "24",
      hoverText: t("disc3Hover"),
    },
  ];

  return (
    <section className="mt-28 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-block text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 shadow-sm ${
            darkMode 
              ? "bg-red-950/80 text-red-400 border border-red-900" 
              : "bg-[#fde0e0]/90 text-[#f44336]"
          }`}
        >
          {t("discBadge")}
        </motion.div>

        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
          darkMode ? "text-red-400" : "text-[#f44336]"
        }`}>
          {t("discTitle")}
        </h2>

        <div className="flex justify-end max-w-7xl mx-auto px-2">
          <motion.a whileHover={{ x: 4 }} href="#" className="text-[#0056ff] font-semibold text-sm flex items-center gap-1 hover:underline cursor-pointer">
            {t("discViewAll")} →
          </motion.a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {discussions.map((discussion, idx) => (
          <motion.div
            key={idx}
            onMouseEnter={() => { setCursorText(discussion.hoverText); setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-md rounded-3xl shadow-sm p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
              darkMode 
                ? "bg-zinc-900/90 border border-zinc-800 text-slate-100" 
                : "bg-white/95 border border-gray-100 text-gray-800"
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                {discussion.tags.map((tag, tIdx) => (
                  <span key={tIdx} className={`text-xs font-semibold px-3 py-1 rounded-full ${discussion.tagColors[tIdx]}`}>
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className={`text-base font-bold mb-2 leading-snug ${
                darkMode ? "text-slate-100" : "text-gray-900"
              }`}>
                {discussion.title}
              </h3>
              <p className={`text-xs md:text-sm leading-relaxed mb-6 ${
                darkMode ? "text-slate-400" : "text-gray-600"
              }`}>
                {discussion.excerpt}
              </p>
            </div>

            <div className={`flex items-center justify-between pt-4 border-t text-xs ${
              darkMode ? "border-zinc-800 text-slate-400" : "border-gray-100 text-gray-500"
            }`}>
              <div className="flex items-center gap-2">
                <img src={discussion.avatar} alt={discussion.author} className={`w-7 h-7 rounded-full object-cover border ${
                  darkMode ? "border-zinc-700" : "border-gray-200"
                }`} />
                <span className={`font-medium ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                  {discussion.author}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`flex items-center gap-1.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  <ChatBubbleLeftIcon className={`w-4 h-4 ${darkMode ? "text-slate-500" : "text-gray-400"}`} />
                  {discussion.answers}
                </span>
                <span className={`flex items-center gap-1 font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                  <ArrowUpIcon className={`w-4 h-4 stroke-[2.5] ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                  {discussion.votes}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}