import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function CommunityVoice({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();

  const testimonials = [
    {
      quote: t("test1Quote"),
      author: t("test1Author"),
      role: t("test1Role"),
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      hoverText: t("testHover")
    },
    {
      quote: t("test2Quote"),
      author: t("test2Author"),
      role: t("test2Role"),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      hoverText: t("testHover")
    },
    {
      quote: t("test3Quote"),
      author: t("test3Author"),
      role: t("test3Role"),
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      hoverText: t("testHover")
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
              ? "bg-zinc-800 text-[var(--color-brand-primary)] border border-zinc-700" 
              : "bg-[var(--color-brand-primary-light)] text-[var(--color-brand-primary)]"
          }`}
        >
          {t("testBadge")}
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-primary)] mb-3">
          {t("testTitle")}
        </h2>

        <p className={`max-w-xl mx-auto text-sm md:text-base leading-relaxed ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}>
          {t("testSubtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, idx) => (
          <motion.div
            key={idx}
            onMouseEnter={() => { setCursorText(testimonial.hoverText); setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`backdrop-blur-md rounded-3xl shadow-sm p-6 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
              darkMode 
                ? "bg-zinc-900/90 border border-zinc-800 text-slate-100" 
                : "bg-white/95 border border-gray-100 text-gray-800"
            }`}
          >
            <p className={`text-sm leading-relaxed mb-6 italic ${
              darkMode ? "text-slate-300" : "text-gray-700"
            }`}>
              "{testimonial.quote}"
            </p>

            <div className={`flex items-center gap-3 pt-4 border-t ${
              darkMode ? "border-zinc-800" : "border-gray-100"
            }`}>
              <img 
                src={testimonial.avatar} 
                alt={testimonial.author} 
                className={`w-10 h-10 rounded-full object-cover border ${
                  darkMode ? "border-zinc-700" : "border-gray-200"
                }`} 
              />
              <div>
                <h4 className={`font-bold text-sm ${darkMode ? "text-slate-100" : "text-gray-900"}`}>
                  {testimonial.author}
                </h4>
                <p className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  {testimonial.role}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}