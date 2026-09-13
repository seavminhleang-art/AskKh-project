  import React, { useState } from "react";
  import { motion } from "framer-motion";
  import { useTranslation } from "react-i18next";

  /* Animated scanning / verification HUD background, reused from ItemFeedView's
    hero card. Multi-hue rings, drifting glows, circuit nodes, and a sweeping
    light band. Pure CSS + SVG, no external assets, respects reduced-motion. */
  function HeroScanBackground({ darkMode }) {
    const grid = darkMode ? "rgba(148,163,184,0.22)" : "rgba(100,116,139,0.14)";

    const blue = darkMode ? "rgba(96,165,250,0.9)" : "rgba(37,99,235,0.55)";
    const blueSoft = darkMode ? "rgba(96,165,250,0.35)" : "rgba(37,99,235,0.22)";
    const pink = darkMode ? "rgba(244,114,182,0.9)" : "rgba(219,39,119,0.5)";
    const pinkSoft = darkMode ? "rgba(244,114,182,0.35)" : "rgba(219,39,119,0.2)";
    const purple = darkMode ? "rgba(167,139,250,0.9)" : "rgba(124,58,237,0.5)";
    const purpleSoft = darkMode ? "rgba(167,139,250,0.35)" : "rgba(124,58,237,0.2)";
    const teal = darkMode ? "rgba(45,212,191,0.9)" : "rgba(13,148,136,0.5)";
    const tealSoft = darkMode ? "rgba(45,212,191,0.35)" : "rgba(13,148,136,0.2)";
    const amber = darkMode ? "rgba(251,191,36,0.9)" : "rgba(217,119,6,0.5)";

    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <style>{`
          @keyframes heroSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes heroSpinSlowReverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes heroPulseDot { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.7); } }
          @keyframes heroSweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }
          @keyframes heroFadeDrift { 0%, 100% { opacity: 0.2; transform: translateY(0px); } 50% { opacity: 0.55; transform: translateY(-6px); } }
          @keyframes heroGlowDrift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -14px) scale(1.12); } }
          @keyframes heroGlowDrift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-24px, 16px) scale(1.15); } }
          @keyframes heroGlowDrift3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(14px, 18px) scale(1.1); } }
          .hero-scan-ring-outer { animation: heroSpinSlow 34s linear infinite; }
          .hero-scan-ring-inner { animation: heroSpinSlowReverse 22s linear infinite; }
          .hero-scan-ring-mid { animation: heroSpinSlow 26s linear infinite; }
          .hero-scan-dot { animation: heroPulseDot 2.4s ease-in-out infinite; }
          .hero-scan-sweep { animation: heroSweep 7s ease-in-out infinite; }
          .hero-scan-node { animation: heroFadeDrift 5s ease-in-out infinite; }
          .hero-glow-1 { animation: heroGlowDrift1 14s ease-in-out infinite; }
          .hero-glow-2 { animation: heroGlowDrift2 17s ease-in-out infinite; }
          .hero-glow-3 { animation: heroGlowDrift3 20s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .hero-scan-ring-outer, .hero-scan-ring-inner, .hero-scan-ring-mid, .hero-scan-dot,
            .hero-scan-sweep, .hero-scan-node, .hero-glow-1, .hero-glow-2, .hero-glow-3 {
              animation: none !important;
            }
          }
        `}</style>

        <div
          className="hero-glow-1 absolute -left-16 -top-16 w-64 h-64 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${blueSoft}, transparent 70%)` }}
        />
        <div
          className="hero-glow-2 absolute -right-10 top-0 w-72 h-72 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${pinkSoft}, transparent 70%)` }}
        />
        <div
          className="hero-glow-3 absolute left-1/3 -bottom-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${purpleSoft}, transparent 70%)` }}
        />
        <div
          className="hero-glow-1 absolute right-1/4 -bottom-16 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${tealSoft}, transparent 70%)`, animationDelay: "3s" }}
        />

        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="heroGridSection" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke={grid} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGridSection)" />
        </svg>

        <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-72 h-72 opacity-90">
          <svg viewBox="0 0 200 200" className="w-full h-full hero-scan-ring-outer">
            <circle cx="100" cy="100" r="92" fill="none" stroke={blue} strokeWidth="1" strokeDasharray="6 10" />
          </svg>
          <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 hero-scan-ring-mid">
            <circle cx="100" cy="100" r="70" fill="none" stroke={pink} strokeWidth="1" strokeDasharray="2 6" />
          </svg>
          <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 hero-scan-ring-inner">
            <circle cx="100" cy="100" r="48" fill="none" stroke={teal} strokeWidth="1.2" />
            <circle cx="100" cy="188" r="3" fill={purple} className="hero-scan-dot" />
            <circle cx="12" cy="100" r="3" fill={amber} className="hero-scan-dot" style={{ animationDelay: "0.9s" }} />
          </svg>
        </div>

        <div className="absolute -right-20 top-8 w-56 h-56 opacity-80">
          <svg viewBox="0 0 200 200" className="w-full h-full hero-scan-ring-inner">
            <circle cx="100" cy="100" r="80" fill="none" stroke={purple} strokeWidth="1" strokeDasharray="4 8" />
          </svg>
          <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 hero-scan-ring-mid">
            <circle cx="100" cy="100" r="56" fill="none" stroke={teal} strokeWidth="1.2" />
          </svg>
        </div>

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <g fill="none" strokeWidth="1">
            <path d="M60 40 L60 90 L140 90" stroke={blue} />
            <path d="M900 260 L900 210 L820 210" stroke={pink} />
            <path d="M480 20 L480 55" stroke={teal} />
            <path d="M520 280 L520 245" stroke={purple} />
            <path d="M760 40 L800 40 L800 80" stroke={amber} />
          </g>
          <circle className="hero-scan-node" cx="60" cy="40" r="3.5" fill={blue} />
          <circle className="hero-scan-node" cx="140" cy="90" r="3" fill={pink} style={{ animationDelay: "0.6s" }} />
          <circle className="hero-scan-node" cx="900" cy="260" r="3.5" fill={pink} style={{ animationDelay: "1.1s" }} />
          <circle className="hero-scan-node" cx="820" cy="210" r="3" fill={purple} style={{ animationDelay: "1.7s" }} />
          <circle className="hero-scan-node" cx="480" cy="20" r="3" fill={teal} style={{ animationDelay: "0.3s" }} />
          <circle className="hero-scan-node" cx="520" cy="280" r="3" fill={amber} style={{ animationDelay: "2s" }} />
          <circle className="hero-scan-node" cx="800" cy="80" r="3" fill={amber} style={{ animationDelay: "1.4s" }} />
          <circle className="hero-scan-node" cx="760" cy="40" r="2.5" fill={blue} style={{ animationDelay: "2.4s" }} />
        </svg>

        <div
          className="hero-scan-sweep absolute top-0 left-0 h-full w-1/3"
          style={{
            background: darkMode
              ? "linear-gradient(90deg, transparent, rgba(96,165,250,0.10), rgba(244,114,182,0.10), rgba(45,212,191,0.10), transparent)"
              : "linear-gradient(90deg, transparent, rgba(37,99,235,0.09), rgba(219,39,119,0.09), rgba(13,148,136,0.09), transparent)"
          }}
        />
      </div>
    );
  }

  export default function HeroSection({ setCursorText, setIsHovered, darkMode }) {
    const { t } = useTranslation();
    const [emailInput, setEmailInput] = useState("");
    const [subscribeStatus, setSubscribeStatus] = useState(null);
    const [subscribeMessage, setSubscribeMessage] = useState("");

    const handleSubscribe = (e) => {
      e.preventDefault();
      if (!emailInput || !emailInput.includes("@")) {
        setSubscribeStatus("error");
        setSubscribeMessage(t("emailError"));
        return;
      }
      
      setSubscribeStatus("success");
      setSubscribeMessage(t("emailSuccess", { email: emailInput }));
      setEmailInput("");
    };

    return (
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 relative z-10 font-[family-name:var(--font-brand)]"
      >
        <div
          className={`relative overflow-hidden text-center backdrop-blur-md rounded-3xl shadow-sm px-6 py-12 md:py-16 transition-colors duration-300 ${
            darkMode
              ? "bg-zinc-900/90 border border-zinc-800"
              : "bg-white/95 border border-gray-100"
          }`}
        >
          <HeroScanBackground darkMode={darkMode} />

          <motion.div 
            onMouseEnter={() => { setCursorText(t("cursorVerified")); setIsHovered(true); }}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            className={`relative inline-flex items-center text-sm font-medium px-4 py-1 rounded-full mb-4 cursor-pointer shadow-sm backdrop-blur-md ${
              darkMode 
                ? "bg-zinc-800/90 text-[var(--color-brand-secondary)] border border-zinc-700" 
                : "bg-[var(--color-brand-secondary-light)]/90 text-[var(--color-brand-secondary)]"
            }`}
          >
            <span className="w-2 h-2 bg-[var(--color-brand-secondary)] rounded-full mr-2 animate-pulse"></span>
            {t("trustedBadge")}
          </motion.div>

          <h1 className="relative text-3xl md:text-5xl font-bold text-[var(--color-brand-primary)] mb-2">
            {t("heroTitle1")}
          </h1>
          <h2 className="relative text-2xl md:text-3xl font-semibold text-[var(--color-brand-secondary)] mb-4">
            {t("heroTitle2")}
          </h2>

          <p className={`relative max-w-xl mx-auto mb-6 leading-relaxed ${
            darkMode ? "text-slate-300" : "text-[#333333]"
          }`}>
            {t("heroDescription")}
          </p>

          <form onSubmit={handleSubscribe} className="relative flex flex-col items-center justify-center gap-2 mb-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full max-w-md">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t("emailPlaceholder")}
                className={`rounded-full px-5 py-2.5 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-secondary)] backdrop-blur-sm shadow-sm transition-all text-sm ${
                  darkMode 
                    ? "bg-zinc-900/90 border border-zinc-800 text-white placeholder-slate-400" 
                    : "bg-white/80 border border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              <motion.button 
                type="submit"
                onMouseEnter={() => { setCursorText(t("cursorJoin")); setIsHovered(true); }}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[var(--color-brand-primary)] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--color-brand-primary-dark)] transition shadow-sm cursor-pointer w-full sm:w-auto text-sm whitespace-nowrap"
              >
                {t("joinUsButton")}
              </motion.button>
            </div>

            {subscribeStatus && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs font-medium mt-1 ${subscribeStatus === "success" ? "text-[var(--color-brand-accent)]" : "text-[var(--color-brand-secondary)]"}`}
              >
                {subscribeMessage}
              </motion.p>
            )}
          </form>

          <div className="relative flex justify-center items-center gap-2">
            <div className="flex -space-x-2">
              <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="user1" className={`w-8 h-8 rounded-full border-2 shadow-sm ${darkMode ? "border-zinc-900" : "border-white"}`} />
              <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="user2" className={`w-8 h-8 rounded-full border-2 shadow-sm ${darkMode ? "border-zinc-900" : "border-white"}`} />
              <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="user3" className={`w-8 h-8 rounded-full border-2 shadow-sm ${darkMode ? "border-zinc-900" : "border-white"}`} />
            </div>
            <span className={`ml-2 text-sm font-medium ${darkMode ? "text-slate-400" : "text-[#555555]"}`}>
              {t("communityEngagement")}
            </span>
          </div>
        </div>
      </motion.section>
    );
  }