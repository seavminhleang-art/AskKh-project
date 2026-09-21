import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function PlatformArchitecture({ darkMode }) {
  const { t } = useTranslation();

  const cards = [
    {
      title: t("archCard1Title"),
      desc: t("archCard1Desc"),
      img: "https://i.pinimg.com/736x/98/6b/5b/986b5b1b38ead08bcc8ef2c7c2608959.jpg",
    },
    {
      title: t("archCard2Title"),
      desc: t("archCard2Desc"),
      img: "src/assets/Website/Gemini_Generated_Image_6kpehf6kpehf6kpe.jpg",
    },
    {
      title: t("archCard3Title"),
      desc: t("archCard3Desc"),
      img: "https://i.pinimg.com/736x/37/46/9a/37469a0f02d084ef19d3cf0b052af250.jpg",
    },
  ];

  return (
    <section className="text-center mt-24 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05 }}
        className={`inline-block text-sm font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 cursor-pointer ${
          darkMode
            ? "bg-zinc-800 text-[var(--home-primary-text)]"
            : "bg-[var(--color-brand-primary-light)] text-[var(--home-primary-text)]"
        }`}
      >
        {t("archBadge")}
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-bold text-[var(--home-primary-text)] mb-3">
        {t("archTitle")}
      </h2>

      <p className={`max-w-xl mx-auto text-sm md:text-base mb-12 leading-relaxed ${
        darkMode ? "text-slate-400" : "text-gray-600"
      }`}>
        {t("archSubtitle")}
      </p>

      <div className="grid md:grid-cols-3 gap-8 text-left">
        {cards.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-md rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
              darkMode
                ? "bg-zinc-900/90 text-slate-100"
                : "bg-white/95 text-gray-800"
            }`}
          >
            <div>
              <div className={`h-48 rounded-2xl overflow-hidden mb-6 ${darkMode ? "bg-zinc-950" : "bg-gray-900"}`}>
                <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-90 hover:scale-110 transition duration-500" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                {item.title}
              </h3>
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