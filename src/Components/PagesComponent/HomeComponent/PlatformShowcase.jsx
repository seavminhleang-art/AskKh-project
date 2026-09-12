import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function PlatformShowcase({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();

  const cards = [
    {
      label: t("showcaseCard1Label"),
      labelColor: darkMode 
        ? "bg-zinc-800 text-[var(--color-brand-primary)] border border-zinc-700" 
        : "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)]",
      text: t("showcaseCard1Text"),
      img: "https://i.pinimg.com/1200x/ed/7a/c1/ed7ac18f0a66acd81f8a54a9846aa975.jpg",
      hoverLabel: t("showcaseCard1Hover"),
    },
    {
      label: t("showcaseCard2Label"),
      labelColor: darkMode 
        ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800" 
        : "bg-emerald-50 text-[var(--color-brand-accent)]",
      text: t("showcaseCard2Text"),
      img: "https://i.pinimg.com/736x/4d/ba/61/4dba6191ebd18650c52de2ed5fb47f7d.jpg",
      hoverLabel: t("showcaseCard2Hover"),
    },
    {
      label: t("showcaseCard3Label"),
      labelColor: darkMode 
        ? "bg-zinc-800 text-[var(--color-brand-secondary)] border border-zinc-700" 
        : "bg-[var(--color-brand-secondary-light)] text-[var(--color-brand-secondary)]",
      text: t("showcaseCard3Text"),
      img: "https://i.pinimg.com/1200x/05/34/f7/0534f7df0b08edc70592d10d4bd908c0.jpg",
      hoverLabel: t("showcaseCard3Hover"),
    },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-8 mb-20 relative z-10 font-[family-name:var(--font-brand)]">
      <motion.div 
        onMouseEnter={() => { setCursorText(t("showcaseMainHover")); setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className={`md:col-span-2 backdrop-blur-md rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
          darkMode 
            ? "bg-zinc-900/90 border border-zinc-800 text-slate-100" 
            : "bg-white/95 border border-gray-100 text-gray-800"
        }`}
      >
        <div className="relative text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition duration-700"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/1200x/d5/4a/00/d54a0076d493ce9c0d95d99a16ecec15.jpg')",
            }}
          ></div>
          <div className={`absolute inset-0 transition-opacity duration-300 ${darkMode ? "bg-zinc-950/60" : "bg-black/40"}`}></div>

          <div className="relative z-10 text-center py-16 px-6">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-md">
              {t("showcaseBadge")}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              {t("showcaseTitle")}
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
              {t("showcaseSubtitle")}
            </p>
          </div>
        </div>

        <div className="p-8">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
            darkMode 
              ? "bg-zinc-800 text-[var(--color-brand-primary)] border border-zinc-700" 
              : "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)]"
          }`}>
            {t("showcaseCoreFeatureTag")}
          </span>
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
            {t("showcaseCoreHeading")}
          </h3>
          <p className={`mb-6 text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
            {t("showcaseCoreDesc")}
          </p>
          <div className={`flex justify-between items-center text-sm pt-4 border-t ${
            darkMode ? "border-zinc-800 text-slate-400" : "border-gray-100 text-gray-600"
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-xl p-2 rounded-xl ${
                darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-[var(--color-brand-primary-light)]"
              }`}>👥</span>
              <div>
                <p className={`font-medium ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                  {t("showcaseTeamName")}
                </p>
                <p className={`text-xs ${darkMode ? "text-slate-500" : "text-gray-500"}`}>
                  {t("brand")}
                </p>
              </div>
            </div>
            <motion.a whileHover={{ x: 5 }} href="#" className="text-[var(--color-brand-primary)] font-semibold flex items-center gap-1">
              {t("showcaseExploreMore")} →
            </motion.a>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onMouseEnter={() => { setCursorText(card.hoverLabel); setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02, x: 4 }}
            transition={{ duration: 0.2 }}
            className={`backdrop-blur-md rounded-3xl shadow-sm p-5 flex items-center justify-between cursor-pointer transition-colors duration-300 ${
              darkMode 
                ? "bg-zinc-900/90 border border-zinc-800 text-slate-100" 
                : "bg-white/95 border border-gray-100 text-gray-800"
            }`}
          >
            <div className="flex-1 pr-4">
              <span className={`inline-block ${card.labelColor} text-xs font-semibold px-3 py-1 rounded-full mb-2`}>
                {card.label}
              </span>
              <p className={`font-medium text-sm leading-snug ${darkMode ? "text-slate-200" : "text-gray-900"}`}>
                {card.text}
              </p>
            </div>
            <div className={`w-28 h-20 flex-shrink-0 overflow-hidden rounded-2xl ${darkMode ? "border border-zinc-800" : ""}`}>
              <img src={card.img} alt={card.label} className="w-full h-full object-cover transform hover:scale-110 transition duration-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}