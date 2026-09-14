import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPin, Search, ShieldCheck } from "lucide-react";

export default function HowSecureRecoveryWorks({ darkMode }) {
  const { t } = useTranslation();

  const steps = [
    {
      id: 1,
      title: t("recoveryStep1Title", { defaultValue: "Report & Tag" }),
      desc: t("recoveryStep1Desc", {
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
              <div className="absolute -top-2 -right-4 bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-full text-xs font-bold text-[var(--color-brand-secondary)] shadow-md">
                {t("tagScope", { defaultValue: "ISTAD" })}
              </div>
            </div>
            <div className="mt-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
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
      desc: t("recoveryStep2Desc", {
        defaultValue:
          "Our platform automatically cross-references lost logs with items handed into security custody using matching score metrics.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="relative z-10 w-full max-w-[220px]">
            <div className="bg-slate-900 rounded-xl p-3 shadow-xl">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-rose-500/10 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-rose-500 block uppercase">
                    {t("recoveryLostLog", { defaultValue: "LOST LOG" })}
                  </span>
                  <span className="text-sm font-extrabold text-white mt-1 block">92%</span>
                  <span className="text-[9px] text-slate-400">
                    {t("recoveryMatchScore", { defaultValue: "Match Score" })}
                  </span>
                </div>
                <div className="bg-amber-500/10 rounded-lg p-2 text-center">
                  <span className="text-[10px] font-bold text-amber-500 block uppercase">
                    {t("recoveryFoundItem", { defaultValue: "FOUND ITEM" })}
                  </span>
                  <span className="text-sm font-extrabold text-white mt-1 block">92%</span>
                  <span className="text-[9px] text-slate-400">
                    {t("recoveryMatchScore", { defaultValue: "Match Score" })}
                  </span>
                </div>
              </div>
              <div className="bg-emerald-500/20 rounded-lg py-1 px-2 flex items-center justify-center gap-1.5">
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
      desc: t("recoveryStep3Desc", {
        defaultValue:
          "Answer unique security verification queries (e.g., serial code, wallpaper) and pick up your asset from the building office.",
      }),
      graphic: (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-secondary-light)]/40 to-indigo-50/20 rounded-2xl p-4 overflow-hidden">
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--color-brand-primary)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--color-brand-primary)]/30 mb-3">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <div className="bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg shadow-md text-center">
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
    <section className="text-center mt-24 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        className={`inline-block text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 shadow-sm cursor-pointer ${
          darkMode 
            ? "bg-zinc-800 text-[var(--color-brand-primary)]" 
            : "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)]"
        }`}
      >
        {t("recoveryBadge", { defaultValue: "Lost&Found ARCHITECTURE" })}
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-primary)] mb-3">
        {t("recoverySectionTitle", { defaultValue: "How Secure Recovery Works" })}
      </h2>

      <p className={`max-w-xl mx-auto text-sm md:text-base mb-12 leading-relaxed ${
        darkMode ? "text-slate-400" : "text-gray-600"
      }`}>
        {t("recoverySectionDescription", {
          defaultValue: "Our three-step framework ensures your misplaced items return safely to your hands without mix-ups.",
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
              <div className={`h-52 sm:h-56 rounded-2xl overflow-hidden mb-6 ${darkMode ? "bg-zinc-950" : "bg-gray-900/5"}`}>
                {item.graphic}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-6 h-6 bg-[var(--color-brand-primary)] text-white font-bold text-xs rounded-md flex items-center justify-center shrink-0 shadow">
                  {item.id}
                </span>
                <h3 className={`text-lg font-bold ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                  {item.title}
                </h3>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}