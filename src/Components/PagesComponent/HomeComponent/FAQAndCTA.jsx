import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/* Animated "signal network" background for the CTA banner — now the whole
   backdrop, no photo underneath. Twinkling starfield, drifting color glows,
   a centered radar pulse, and two counter-rotating orbit rings behind the
   headline. Now follows light/dark mode: a soft pastel gradient by day,
   a deep night-sky gradient after dark. Pure CSS + SVG, respects
   reduced-motion. */
function CTANetworkBackground({ darkMode }) {
  const star = darkMode ? "rgba(191,219,254,0.85)" : "rgba(59,130,246,0.55)";
  const cyan = darkMode ? "rgba(103,232,249,0.75)" : "rgba(13,148,136,0.55)";
  const ring = darkMode ? "rgba(96,165,250,0.5)" : "rgba(59,130,246,0.4)";
  const ringSoft = darkMode ? "rgba(96,165,250,0.22)" : "rgba(59,130,246,0.16)";
  const purpleGlow = darkMode ? "rgba(167,139,250,0.22)" : "rgba(167,139,250,0.16)";
  const blueGlow = darkMode ? "rgba(59,130,246,0.22)" : "rgba(59,130,246,0.14)";

  const stars = [
    { cx: 40, cy: 30, r: 1.3, delay: "0s" },
    { cx: 140, cy: 70, r: 1, delay: "0.7s" },
    { cx: 240, cy: 20, r: 1.5, delay: "1.5s" },
    { cx: 330, cy: 100, r: 1, delay: "0.3s" },
    { cx: 420, cy: 40, r: 1.2, delay: "2s" },
    { cx: 500, cy: 90, r: 1, delay: "1s" },
    { cx: 580, cy: 20, r: 1.4, delay: "0.2s" },
    { cx: 660, cy: 70, r: 1, delay: "1.7s" },
    { cx: 740, cy: 30, r: 1.3, delay: "0.9s" },
    { cx: 830, cy: 90, r: 1, delay: "1.3s" },
    { cx: 900, cy: 40, r: 1.2, delay: "0.5s" },
    { cx: 960, cy: 80, r: 1, delay: "2.2s" },
    { cx: 90, cy: 150, r: 1.1, delay: "1.1s" },
    { cx: 260, cy: 190, r: 1, delay: "0.6s" },
    { cx: 420, cy: 160, r: 1.3, delay: "1.9s" },
    { cx: 600, cy: 200, r: 1, delay: "0.4s" },
    { cx: 760, cy: 170, r: 1.2, delay: "1.4s" },
    { cx: 920, cy: 210, r: 1, delay: "2.4s" },
    { cx: 150, cy: 260, r: 1, delay: "0.8s" },
    { cx: 480, cy: 280, r: 1.1, delay: "1.6s" },
    { cx: 780, cy: 270, r: 1, delay: "0.2s" }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes ctaTwinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.95; } }
        @keyframes ctaOrbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ctaPing { 0% { transform: scale(0.6); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes ctaDriftGlow1 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(24px, -16px); } }
        @keyframes ctaDriftGlow2 { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-20px, 14px); } }
        .cta-star { animation: ctaTwinkle 3.2s ease-in-out infinite; }
        .cta-orbit { animation: ctaOrbitSpin 22s linear infinite; transform-origin: center; }
        .cta-orbit-slow { animation: ctaOrbitSpin 36s linear infinite reverse; transform-origin: center; }
        .cta-ping-1 { animation: ctaPing 4s ease-out infinite; transform-origin: center; }
        .cta-ping-2 { animation: ctaPing 4s ease-out infinite; animation-delay: 2s; transform-origin: center; }
        .cta-glow-1 { animation: ctaDriftGlow1 15s ease-in-out infinite; }
        .cta-glow-2 { animation: ctaDriftGlow2 18s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cta-star, .cta-orbit, .cta-orbit-slow, .cta-ping-1, .cta-ping-2, .cta-glow-1, .cta-glow-2 {
            animation: none !important;
          }
        }
      `}</style>

      {/* base gradient: soft pastel by day, deep night sky after dark */}
      <div className={`absolute inset-0 ${
        darkMode
          ? "bg-gradient-to-br from-[#05070f] via-[#0b1224] to-[#140a24]"
          : "bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#fdf2f8]"
      }`} />

      {/* drifting color glows for depth and richness */}
      <div
        className="cta-glow-1 absolute -left-16 -top-10 w-80 h-80 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${blueGlow}, transparent 70%)` }}
      />
      <div
        className="cta-glow-2 absolute -right-16 -bottom-16 w-96 h-96 rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${purpleGlow}, transparent 70%)` }}
      />

      {/* twinkling starfield across the whole banner */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
        {stars.map((s, i) => (
          <circle
            key={i}
            className="cta-star"
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={star}
            style={{ animationDelay: s.delay }}
          />
        ))}
      </svg>

      {/* centered radar pulse, faint behind the headline */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10">
        <span className="cta-ping-1 absolute inset-0 rounded-full border" style={{ borderColor: ring }} />
        <span className="cta-ping-2 absolute inset-0 rounded-full border" style={{ borderColor: cyan }} />
      </div>

      {/* two counter-rotating orbit rings framing the content */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] max-w-[90vw] max-h-[90vw] opacity-60">
        <svg viewBox="0 0 200 200" className="w-full h-full cta-orbit">
          <ellipse cx="100" cy="100" rx="96" ry="96" fill="none" stroke={ringSoft} strokeWidth="0.6" strokeDasharray="2 6" />
          <circle cx="196" cy="100" r="2" fill={cyan} />
        </svg>
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 cta-orbit-slow">
          <ellipse cx="100" cy="100" rx="74" ry="74" fill="none" stroke={ringSoft} strokeWidth="0.6" />
          <circle cx="100" cy="26" r="1.8" fill={star} />
        </svg>
      </div>
    </div>
  );
}

export default function FAQAndCTA({ setCursorText, setIsHovered, darkMode }) {
  const { t } = useTranslation();
  const [emailInput, setEmailInput] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const handleCtaSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setStatus("error");
      setMessage(t("emailError"));
      return;
    }
    setStatus("success");
    setMessage(t("emailSuccess").replace("{{email}}", emailInput));
    setEmailInput("");
  };

  const faqs = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative z-10 mt-28 font-[family-name:var(--font-brand)]">
      {/* FAQ Section */}
      <section className="mb-28 max-w-4xl mx-auto px-4 sm:px-6">
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
            {t("faqBadge")}
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-primary)] mb-3">
            {t("faqTitle")}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                onMouseEnter={() => { setCursorText(t("faqToggleHover")); setIsHovered(true); }}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => toggleFAQ(idx)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={`backdrop-blur-md rounded-3xl shadow-sm p-6 sm:p-8 cursor-pointer overflow-hidden transition-colors duration-300 ${
                  darkMode 
                    ? "bg-zinc-900/90 border border-zinc-800 text-slate-100" 
                    : "bg-white/95 border border-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-base sm:text-lg font-bold ${
                    darkMode ? "text-slate-100" : "text-gray-900"
                  }`}>
                    {faq.q}
                  </h3>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex-shrink-0 text-[var(--color-brand-primary)] p-2 rounded-full ${
                      darkMode ? "bg-zinc-800 border border-zinc-700" : "bg-[var(--color-brand-primary-light)]"
                    }`}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className={`text-sm leading-relaxed pt-4 border-t ${
                        darkMode ? "border-zinc-800 text-slate-300" : "border-gray-100 text-gray-600"
                      }`}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section
        className={`relative rounded-3xl overflow-hidden py-16 px-6 sm:px-12 text-center shadow-xl mx-4 sm:mx-6 max-w-7xl lg:mx-auto border transition-colors duration-300 ${
          darkMode ? "border-zinc-800" : "border-gray-100"
        }`}
      >
        {/* live animated background — follows light/dark mode */}
        <CTANetworkBackground darkMode={darkMode} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className={`text-2xl sm:text-4xl font-bold mb-4 tracking-tight max-w-3xl mx-auto leading-normal sm:leading-snug transition-colors duration-300 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            {t("ctaTitle")}
          </h2>
          <p className={`text-xs sm:text-sm mb-8 leading-relaxed max-w-xl mx-auto transition-colors duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            {t("ctaSubtitle")}
          </p>

          <form onSubmit={handleCtaSubmit} className="flex flex-col items-center gap-2">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full max-w-md">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className={`backdrop-blur-md border rounded-full px-5 py-3 w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)] text-sm shadow-inner transition-all ${
                  darkMode
                    ? "bg-white/10 border-white/20 text-white placeholder-gray-300"
                    : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              <motion.button
                type="submit"
                onMouseEnter={() => { setCursorText(t("cursorJoin")); setIsHovered(true); }}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[var(--color-brand-primary)] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full text-sm transition shadow-lg cursor-pointer flex-shrink-0 w-full sm:w-auto"
              >
                {t("joinUsButton")}
              </motion.button>
            </div>

            {status && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs font-medium mt-2 ${status === "success" ? "text-emerald-500" : "text-red-500"}`}
              >
                {message}
              </motion.p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}