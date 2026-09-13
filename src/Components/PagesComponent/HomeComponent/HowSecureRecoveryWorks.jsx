import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Search, ShieldCheck } from "lucide-react";

export default function HowSecureRecoveryWorks({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t("recoveryStep1Title", { defaultValue: "Report & Tag" }),
      description: t("recoveryStep1Desc", {
        defaultValue:
          "Submit details, upload a photo, and pin the exact ISTAD room or building where the item was lost or found.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-[var(--color-brand-primary)] rounded-3xl flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/30 transform -rotate-6">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-4 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-full text-xs font-bold text-[var(--color-brand-secondary)] shadow-md border border-[var(--color-brand-secondary-light)]">
                {t("tagScope", { defaultValue: "ISTAD" })}
              </div>
            </div>
            <div className="mt-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-zinc-700 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {t("recoveryLocationTagged", { defaultValue: "Location Tagged" })}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: t("recoveryStep2Title", { defaultValue: "Smart Match Engine" }),
      description: t("recoveryStep2Desc", {
        defaultValue:
          "Our platform automatically cross-references lost logs with items handed into security custody using matching score metrics.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="relative z-10 w-full max-w-[220px]">
            <div className="bg-slate-900 rounded-xl p-3 shadow-xl">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-rose-500 block uppercase">
                    {t("recoveryLostLog", { defaultValue: "LOST LOG" })}
                  </span>
                  <span className="text-sm font-extrabold text-white mt-1 block">92%</span>
                  <span className="text-[9px] text-slate-400">
                    {t("recoveryMatchScore", { defaultValue: "Match Score" })}
                  </span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-amber-500 block uppercase">
                    {t("recoveryFoundItem", { defaultValue: "FOUND ITEM" })}
                  </span>
                  <span className="text-sm font-extrabold text-white mt-1 block">92%</span>
                  <span className="text-[9px] text-slate-400">
                    {t("recoveryMatchScore", { defaultValue: "Match Score" })}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg py-1 px-2 flex items-center justify-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-semibold text-emerald-400">
                  {t("recoveryMatchedAsset", { defaultValue: "Matched Asset" })}
                </span>
              </div>
            </div>
            <div className="w-12 h-3 bg-slate-700 mx-auto rounded-b-md" />
            <div className="w-20 h-1.5 bg-slate-800 mx-auto rounded-full" />
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: t("recoveryStep3Title", { defaultValue: "Verify & Collect" }),
      description: t("recoveryStep3Desc", {
        defaultValue:
          "Answer unique security verification queries (e.g., serial code, wallpaper) and pick up your asset from the building office.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/30 mb-3">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg shadow-md border border-slate-100 dark:border-zinc-700 text-center">
              <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                {t("recoverySecVerification", { defaultValue: "Security Verification" })}
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-400">
                {t("recoverySecRequirement", { defaultValue: "Provide Serial Code / Wallpaper" })}
              </p>
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
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-brand-primary)_1px,transparent_1px)] [background-size:24px_24px] rounded-3xl" />

      {/* Pill Header Badge & Titles */}
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
            {t("recoveryBadge", { defaultValue: "Lost&Found ARCHITECTURE" })}
          </span>
        </motion.div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-[var(--color-brand-primary)]">
          {t("recoverySectionTitle", { defaultValue: "How Secure Recovery Works" })}
        </h2>

        <p
          className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors ${
            darkMode ? "text-slate-300" : "text-[#333333]"
          }`}
        >
          {t("recoverySectionDescription", {
            defaultValue:
              "Our three-step framework ensures your misplaced items return safely to your hands without mix-ups.",
          })}
        </p>
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative z-10">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => {
              if (setIsHovered) setIsHovered(true);
              if (setCursorText) setCursorText(t("cursorStep", { defaultValue: `Step ${step.id}`, id: step.id }));
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
            {/* Top Illustration Container */}
            <div className="w-full h-52 sm:h-56 mb-6 transition-transform group-hover:scale-[1.03] duration-500">
              {step.graphic}
            </div>

            {/* Bottom Content Area */}
            <div className="mt-auto">
              <div className="flex items-center gap-3 mb-3 relative">
                <div className="absolute -top-12 left-3.5 h-12 w-0.5 bg-[var(--color-brand-secondary)]/30 group-hover:bg-[var(--color-brand-secondary)] transition-colors" />

                <span className="w-7 h-7 bg-[var(--color-brand-primary)] text-white font-bold text-sm rounded-md flex items-center justify-center shrink-0 shadow">
                  {step.id}
                </span>
                <h3
                  className={`text-xl font-bold transition-colors ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {step.title}
                </h3>
              </div>
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