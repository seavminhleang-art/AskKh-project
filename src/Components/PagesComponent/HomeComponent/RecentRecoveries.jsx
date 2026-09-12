import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MapPinIcon } from "@heroicons/react/24/outline";

export default function RecentRecoveries({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();

  const items = [
    {
      status: t("recStatusLost"),
      statusBg: "bg-[var(--color-brand-secondary)] text-white",
      title: t("rec1Title"),
      desc: t("rec1Desc"),
      location: t("recLocation"),
      date: t("recDate"),
      author: t("recAuthor"),
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      img: "src/assets/Website/kwfinwtieBa9DJNMHRxB63.jpg",
      hoverText: t("recHover")
    },
    {
      status: t("recStatusLost"),
      statusBg: "bg-[var(--color-brand-secondary)] text-white",
      title: t("rec2Title"),
      desc: t("rec2Desc"),
      location: t("recLocation"),
      date: t("recDate"),
      author: t("recAuthor"),
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      img: "src/assets/Website/OIP.webp",
      hoverText: t("recHover")
    },
    {
      status: t("recStatusFound"),
      statusBg: "bg-[var(--color-brand-primary)] text-white",
      title: t("rec3Title"),
      desc: t("rec3Desc"),
      location: t("recLocation"),
      date: t("recDate"),
      author: t("recAuthor"),
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      img: "src/assets/Website/OIP (1).webp",
      hoverText: t("recHover")
    }
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
              ? "bg-zinc-800 text-[var(--color-brand-secondary)] border border-zinc-700" 
              : "bg-[var(--color-brand-secondary-light)] text-[var(--color-brand-secondary)]"
          }`}
        >
          {t("recBadge")}
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-secondary)] mb-3">
          {t("recTitle")}
        </h2>

        <p className={`max-w-xl mx-auto text-sm md:text-base leading-relaxed ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}>
          {t("recSubtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            onMouseEnter={() => { setCursorText(item.hoverText); setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-md rounded-3xl shadow-sm p-5 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
              darkMode 
                ? "bg-zinc-900/90 border border-zinc-800 text-slate-100" 
                : "bg-white/95 border border-gray-100 text-gray-800"
            }`}
          >
            <div>
              <div className={`relative h-48 rounded-2xl overflow-hidden mb-4 ${
                darkMode ? "bg-zinc-950 border border-zinc-800" : "bg-gray-100"
              }`}>
                <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.statusBg} shadow-md`}>
                  {item.status}
                </span>
                <img src={item.img} alt={item.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-500" />
              </div>

              <div className={`flex items-center justify-between text-xs mb-2 ${
                darkMode ? "text-slate-400" : "text-gray-400"
              }`}>
                <span className={`flex items-center gap-1 font-medium truncate max-w-[180px] ${
                  darkMode ? "text-slate-300" : "text-gray-500"
                }`}>
                  <MapPinIcon className="w-3.5 h-3.5 text-[var(--color-brand-secondary)] flex-shrink-0" />
                  {item.location}
                </span>
                <span className="flex-shrink-0">{item.date}</span>
              </div>

              <h3 className={`text-base font-bold mb-1.5 leading-snug ${
                darkMode ? "text-slate-100" : "text-gray-900"
              }`}>
                {item.title}
              </h3>
              <p className={`text-xs leading-relaxed mb-6 ${
                darkMode ? "text-slate-400" : "text-gray-600"
              }`}>
                {item.desc}
              </p>
            </div>

            <div className={`flex items-center justify-between pt-4 border-t ${
              darkMode ? "border-zinc-800" : "border-gray-100"
            }`}>
              <div className="flex items-center gap-2">
                <img src={item.avatar} alt={item.author} className={`w-7 h-7 rounded-full object-cover border ${
                  darkMode ? "border-zinc-700" : "border-gray-200"
                }`} />
                <span className={`text-xs font-medium ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                  {item.author}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-sm ${
                  darkMode 
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/80" 
                    : "bg-emerald-50 text-[var(--color-brand-accent)] hover:bg-emerald-100"
                }`}
              >
                {t("recVerifyBtn")}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}