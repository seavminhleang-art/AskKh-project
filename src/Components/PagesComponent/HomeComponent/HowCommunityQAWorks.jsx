import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  HelpCircle,
  ThumbsUp,
  Tag,
  ShieldCheck,
  Award,
  Search,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";

export default function HowCommunityQAWorks({ darkMode }) {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t("step1Title", { defaultValue: "Ask & Tag Query" }),
      desc: t("step1Desc", {
        defaultValue:
          "Submit your question, attach code/images, and tag precise subjects or rooms. Use scope selectors for target audiences.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-16 h-16 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/30">
                <PlusCircle className="w-9 h-9 text-white" />
              </div>
              <div className="absolute -top-1 -right-2 bg-[var(--color-brand-secondary)] text-white p-1 rounded-full shadow">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[var(--home-secondary-text)]" />
                <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  {t("tagTopic", { defaultValue: "Topic: React" })}
                </span>
              </div>
              <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--home-secondary-text)]" />
                <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  {t("tagScope", { defaultValue: "Scope: ISTAD" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: t("step2Title", { defaultValue: "Collaborate & Search" }),
      desc: t("step2Desc", {
        defaultValue:
          "Search with keywords, tags, or titles. Filter by scope, date, or type. System returns ranked and filtered results by relevance or recency.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 w-full max-w-[200px] flex flex-col gap-2.5">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5 shadow flex items-center gap-2">
              <Search className="w-4 h-4 text-[var(--home-secondary-text)]" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 bg-slate-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-2 bg-slate-100 dark:bg-zinc-600 rounded w-1/2" />
              </div>
              <Tag className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-500" />
            </div>
            <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-secondary-light)] dark:bg-red-950 flex items-center justify-center text-[var(--home-secondary-text)] font-bold text-base">
                  U1
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-slate-200 dark:bg-zinc-700 rounded w-5/6" />
                  <div className="h-2 bg-slate-100 dark:bg-zinc-600 rounded w-1/3" />
                </div>
              </div>
              <div className="pl-10 space-y-1.5">
                <div className="h-2.5 bg-slate-100 dark:bg-zinc-700/50 rounded w-full" />
                <div className="h-2 bg-slate-100 dark:bg-zinc-700/50 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: t("step3Title", { defaultValue: "Vote & Earn Achievements" }),
      desc: t("step3Desc", {
        defaultValue:
          "Like or unlike questions and answers. Like and upvote verified solutions to unlock badges. Activity is awarded badges based on reputation.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-full p-2.5 shadow-md flex items-center gap-2.5 mb-3.5">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-base font-bold">
                  {t("likesCount", { defaultValue: "532 Likes" })}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-base font-bold">
                  {t("solutionsCount", { defaultValue: "12 Solutions" })}
                </span>
              </div>
            </div>
            <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-xl p-3 shadow text-center flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {t("badgeTitle", {
                    defaultValue: "Knowledge Helper Badges Awarded",
                  })}
                </p>
                <p className="text-base text-slate-400 dark:text-slate-400">
                  {t("badgeDesc", {
                    defaultValue: "Awarded for 100+ solution upvotes",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="text-center mt-24 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        className={`inline-block text-base font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 cursor-pointer ${
          darkMode
            ? "bg-zinc-800 text-[var(--home-primary-text)]"
            : "bg-[var(--color-brand-primary-light)] text-[var(--home-primary-text)]"
        }`}
      >
        {t("qaBadge", { defaultValue: "Community Architecture" })}
      </motion.div>

      <h2 className="text-5xl md:text-5xl font-bold text-[var(--home-primary-text)] mb-3">
        {t("qaSectionTitle", { defaultValue: "How Community Q&A Works" })}
      </h2>

      <p
        className={`max-w-xl mx-auto text-base md:text-base mb-12 leading-relaxed ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}
      >
        {t("qaSectionDescription", {
          defaultValue:
            "Our three-step framework connects queries directly to answers, encourages collaborative discussion, and builds reputation.",
        })}
      </p>

      <div className="grid md:grid-cols-3 gap-8 text-left">
        {steps.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
              darkMode
                ? "bg-zinc-900/90 text-slate-100"
                : "bg-white/95 text-gray-800"
            }`}
          >
            <div>
              <div
                className={`h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 ${darkMode ? "bg-zinc-950" : "bg-gray-900/5"}`}
              >
                {item.graphic}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 bg-[var(--color-brand-primary)] text-white font-bold text-base rounded-md flex items-center justify-center shrink-0 shadow">
                  {item.id}
                </span>
                <h3
                  className={`text-lg font-bold ${darkMode ? "text-slate-100" : "text-gray-900"}`}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className={`text-base leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-600"}`}
              >
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
