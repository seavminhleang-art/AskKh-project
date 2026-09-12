import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HelpCircle, ThumbsUp, Tag, ShieldCheck, Award, Search, PlusCircle, CheckCircle2 } from "lucide-react";

export default function HowCommunityQAWorks({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();

  // Step definitions with internationalization and responsive graphics
  const steps = [
    {
      id: 1,
      title: t("step1Title", { defaultValue: "Ask & Tag Query" }),
      description: t("step1Desc", {
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
              <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[var(--color-brand-secondary)]" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
                  {t("tagTopic", { defaultValue: "Topic: React" })}
                </span>
              </div>
              <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-brand-secondary)]" />
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">
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
      description: t("step2Desc", {
        defaultValue:
          "Search with keywords, tags, or titles. Filter by scope, date, or type. System returns ranked and filtered results by relevance or recency.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 w-full max-w-[200px] flex flex-col gap-2.5">
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-2.5 shadow flex items-center gap-2">
              <Search className="w-4 h-4 text-[var(--color-brand-secondary)]" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 bg-slate-200 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-2 bg-slate-100 dark:bg-zinc-600 rounded w-1/2" />
              </div>
              <Tag className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-500" />
            </div>

            <div className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-secondary-light)] flex items-center justify-center text-[var(--color-brand-secondary)] font-bold text-xs">
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
      description: t("step3Desc", {
        defaultValue:
          "Like or unlike questions and answers. Like and upvote verified solutions to unlock badges. Activity is awarded badges based on reputation.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-full p-2.5 shadow-md flex items-center gap-2.5 mb-3.5">
              <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-[var(--color-brand-secondary)]">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs font-bold">{t("likesCount", { defaultValue: "532 Likes" })}</span>
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-zinc-700" />
              <button className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-bold">{t("solutionsCount", { defaultValue: "12 Solutions" })}</span>
              </button>
            </div>

            <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm rounded-xl p-3 shadow text-center flex items-center gap-2">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                  {t("badgeTitle", { defaultValue: "Knowledge Helper Badges Awarded" })}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-400">
                  {t("badgeDesc", { defaultValue: "Awarded for 100+ solution upvotes" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl mt-8 font-[family-name:var(--font-brand)]"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:24px_24px] rounded-3xl" />

      {/* Header section with badge, title, and subtitle */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 relative z-10">
        <motion.div
          onMouseEnter={() => {
            if (setCursorText) setCursorText(t("cursorArchitecture", { defaultValue: "Architecture" }));
            if (setIsHovered) setIsHovered(true);
          }}
          onMouseLeave={() => {
            if (setIsHovered) setIsHovered(false);
          }}
          whileHover={{ scale: 1.05 }}
          className="inline-block mb-4 relative cursor-pointer"
        >
          <div className="absolute -inset-1.5 rounded-full blur bg-[var(--color-brand-secondary)]/10 animate-pulse" />
          <span
            className={`relative px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md transition-all ${
              darkMode
                ? "bg-zinc-800/90 text-[var(--color-brand-secondary)] border border-zinc-700"
                : "bg-[var(--color-brand-secondary-light)]/90 text-[var(--color-brand-secondary)]"
            }`}
          >
            {t("qaBadge", { defaultValue: "Community Architecture" })}
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-brand-primary)]">
          {t("qaSectionTitle", { defaultValue: "How Community Q&A Works" })}
        </h2>

        <p
          className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors ${
            darkMode ? "text-slate-300" : "text-[#333333]"
          }`}
        >
          {t("qaSectionDescription", {
            defaultValue:
              "Our three-step framework connects queries directly to answers, encourages collaborative discussion, and builds reputation.",
          })}
        </p>
      </div>

      {/* Grid of interactive step cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              if (setIsHovered) setIsHovered(true);
              if (setCursorText) setCursorText(t("cursorStep", { defaultValue: `Step ${step.id}` }));
            }}
            onMouseLeave={() => {
              if (setIsHovered) setIsHovered(false);
              if (setCursorText) setCursorText("");
            }}
            className={`group rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 backdrop-blur-sm cursor-pointer ${
              darkMode
                ? "bg-zinc-900/90 border border-zinc-800 text-white"
                : "bg-white/80 border border-gray-100 text-slate-900"
            }`}
          >
            {/* Top Graphic Illustration Container */}
            <div className="w-full h-52 sm:h-56 mb-6 transition-transform group-hover:scale-[1.03] duration-500">
              {step.graphic}
            </div>

            {/* Bottom Content Area */}
            <div className="mt-auto">
              <div className="flex items-center gap-3 mb-3 relative">
                {/* Visual Connector Line */}
                <div className="absolute -top-12 left-3.5 h-12 w-0.5 bg-[var(--color-brand-secondary)]/30 group-hover:bg-[var(--color-brand-secondary)] transition-colors" />

                {/* Step Number Badge */}
                <span className="w-7 h-7 bg-[var(--color-brand-primary)] text-white font-bold text-sm rounded-md flex items-center justify-center shrink-0 shadow">
                  {step.id}
                </span>

                {/* Step Title */}
                <h3
                  className={`text-xl font-bold transition-colors ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {step.title}
                </h3>
              </div>

              {/* Step Description */}
              <p
                className={`text-sm leading-relaxed transition-colors ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}