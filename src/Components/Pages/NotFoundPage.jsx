import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom"; // 1. Import useOutletContext
import { usePageSEO } from "../common/SEO";

/* Illustrated background, built the same way HeroScanBackground is:
   a standalone component that takes darkMode and derives every color
   from it, absolutely positioned behind the section's real content. */
function NotFoundIllustration({ darkMode }) {
  const dots = React.useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        top: Math.random() * 90 + 5,
        left: Math.random() * 90 + 5,
        size: Math.random() * 4 + 3,
        delay: Math.random() * 3,
      })),
    [],
  );

  const lines = [
    { top: "4%", left: "20%", len: 70, rot: -35 },
    { top: "2%", left: "42%", len: 60, rot: -35 },
    { top: "8%", left: "78%", len: 90, rot: -35 },
    { top: "24%", left: "8%", len: 90, rot: -35 },
    { top: "48%", left: "88%", len: 90, rot: -35 },
    { top: "68%", left: "4%", len: 80, rot: -35 },
    { top: "82%", left: "34%", len: 90, rot: -35 },
    { top: "78%", left: "62%", len: 80, rot: -35 },
  ];

  const streakColor = darkMode ? "rgba(255,255,255,0.10)" : "#bfe0f5";
  const dotColor = darkMode ? "rgba(255,255,255,0.85)" : "#8fd1ea";
  const cloudColor = darkMode ? "rgba(255,255,255,0.05)" : "#eef2fb";
  const cableColor = darkMode ? "#7fd8ea" : "#5fc7e0";

  const numGradStops = darkMode
    ? ["#7fb8ff", "#5fc6e8", "#4fe0dd"]
    : ["#6fa8f5", "#4fb8dd", "#3fd0d8"];

  const suitGradStops = darkMode
    ? ["#c9dcf3", "#7fa9dd"]
    : ["#bcd9f7", "#8fbdec"];
  const helmetFill = darkMode ? "#dbe6f5" : "#eaf3fd";
  const visorFill = darkMode ? "#c3ddef" : "#dff0fb";
  const visorDot = darkMode ? "#5f83aa" : "#6fa8d8";

  const ringGold = darkMode ? "#f0b25f" : "#f3b25a";
  const planetGrad = darkMode
    ? "radial-gradient(circle at 35% 30%, #ffd9a3, #d9713f)"
    : "radial-gradient(circle at 35% 30%, #ffcf8f, #f08a5d)";
  const orbitRing = darkMode ? "#f0a888" : "#f3a08a";
  const orbitBall = darkMode ? "#f57f4a" : "#f0703f";
  const thruster = darkMode ? "#f7ae6e" : "#f5a35e";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>{`
        @keyframes notFoundFloatAstro { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-14px) rotate(-3deg); } }
        @keyframes notFoundWave { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(14deg); } }
        @keyframes notFoundTwinkle { 0%, 100% { opacity: 0.25; transform: scale(0.85); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes notFoundOrbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes notFoundRingWobble { 0%, 100% { transform: rotate(-18deg) scale(1); } 50% { transform: rotate(-14deg) scale(1.03); } }
        @keyframes notFoundLineFade { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.8; } }
        @keyframes notFoundThruster { 0%, 100% { opacity: 0.6; transform: scaleY(1); } 50% { opacity: 1; transform: scaleY(1.3); } }
        .notfound-astro { animation: notFoundFloatAstro 4.2s ease-in-out infinite; }
        .notfound-planet-1 { animation: notFoundFloatAstro 7s ease-in-out infinite; }
        .notfound-planet-2 { animation: notFoundFloatAstro 6s ease-in-out infinite; animation-delay: 0.6s; }
        .notfound-wave { animation: notFoundWave 1.2s ease-in-out infinite; transform-origin: 104px 68px; }
        .notfound-dot { animation: notFoundTwinkle 3s ease-in-out infinite; }
        .notfound-orbit-spin { animation: notFoundOrbitSpin 5s linear infinite; transform-origin: 0px 0px; }
        .notfound-ring-wobble { animation: notFoundRingWobble 6s ease-in-out infinite; }
        .notfound-line { animation: notFoundLineFade 4s ease-in-out infinite; }
        .notfound-thruster { animation: notFoundThruster 0.5s ease-in-out infinite; transform-origin: 67px 112px; }
        @media (prefers-reduced-motion: reduce) {
          .notfound-astro, .notfound-planet-1, .notfound-planet-2, .notfound-wave,
          .notfound-dot, .notfound-orbit-spin, .notfound-ring-wobble, .notfound-line, .notfound-thruster {
            animation: none !important;
          }
        }
      `}</style>

      {/* decorative diagonal streaks */}
      {lines.map((l, i) => (
        <div
          key={i}
          className="notfound-line absolute rounded-full"
          style={{
            top: l.top,
            left: l.left,
            width: `${l.len}px`,
            height: "2px",
            background: streakColor,
            transform: `rotate(${l.rot}deg)`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* twinkling dots */}
      {dots.map((d) => (
        <div
          key={d.id}
          className="notfound-dot absolute rounded-full"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: dotColor,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}

      {/* ringed planet, top left */}
      <div className="notfound-planet-1 absolute top-[16%] left-[6%] w-[110px] h-[110px]">
        <div
          className="absolute rounded-full"
          style={{
            width: "150px",
            height: "36px",
            left: "-20px",
            top: "36px",
            border: `3px solid ${ringGold}`,
            transform: "rotate(-14deg)",
            opacity: 0.9,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "70px",
            height: "70px",
            left: "18px",
            top: "18px",
            background: planetGrad,
          }}
        />
      </div>

      {/* small ringed planet, bottom right */}
      <div className="notfound-planet-2 absolute bottom-[10%] right-[9%] w-[60px] h-[60px]">
        <div
          className="absolute rounded-full"
          style={{
            width: "84px",
            height: "20px",
            left: "-12px",
            top: "20px",
            border: `2px solid ${ringGold}`,
            transform: "rotate(-14deg)",
            opacity: 0.9,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "38px",
            height: "38px",
            left: "10px",
            top: "10px",
            background: planetGrad,
          }}
        />
      </div>

      {/* central artwork: clouds + 404 + tether + astronaut + orbit ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(92%,780px)]">
        <svg viewBox="0 0 800 420" width="100%" height="auto">
          <defs>
            <linearGradient
              id="notfound-num-grad"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={numGradStops[0]} />
              <stop offset="55%" stopColor={numGradStops[1]} />
              <stop offset="100%" stopColor={numGradStops[2]} />
            </linearGradient>
          </defs>

          <g fill={cloudColor}>
            <rect x="130" y="130" width="120" height="16" rx="8" />
            <rect x="160" y="112" width="60" height="16" rx="8" />
            <rect x="330" y="330" width="130" height="16" rx="8" />
            <rect x="360" y="348" width="70" height="16" rx="8" />
          </g>

          <path
            d="M 330 90 C 250 140, 260 200, 330 230 C 400 260, 430 300, 400 330 C 380 350, 360 345, 355 330"
            fill="none"
            stroke={cableColor}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle cx="355" cy="330" r="7" fill={cableColor} />

          <text
            x="400"
            y="330"
            textAnchor="middle"
            fontSize="230"
            fontWeight="800"
            fill="url(#notfound-num-grad)"
            letterSpacing="4"
          >
            404
          </text>

          <g transform="translate(660,260)" className="notfound-ring-wobble">
            <ellipse
              cx="0"
              cy="0"
              rx="95"
              ry="34"
              fill="none"
              stroke={orbitRing}
              strokeWidth="4"
            />
            <g className="notfound-orbit-spin">
              <circle cx="95" cy="0" r="9" fill={orbitBall} />
              <circle cx="95" cy="0" r="9" fill={orbitBall} opacity="0.4">
                <animate
                  attributeName="r"
                  values="9;13;9"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        </svg>

        {/* astronaut, positioned to sit at the top of the tether */}
        <div className="notfound-astro absolute -top-[6%] left-[36%] w-[150px]">
          <svg viewBox="0 0 160 150" width="100%" height="auto">
            <defs>
              <linearGradient
                id="notfound-suit-grad"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={suitGradStops[0]} />
                <stop offset="100%" stopColor={suitGradStops[1]} />
              </linearGradient>
              <radialGradient
                id="notfound-visor-shine"
                cx="35%"
                cy="28%"
                r="70%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect
              x="60"
              y="95"
              width="14"
              height="20"
              rx="5"
              fill={suitGradStops[1]}
            />
            <ellipse
              className="notfound-thruster"
              cx="67"
              cy="120"
              rx="6"
              ry="10"
              fill={thruster}
            />
            <rect
              x="60"
              y="90"
              width="16"
              height="30"
              rx="8"
              fill="url(#notfound-suit-grad)"
              transform="rotate(10 68 90)"
            />
            <rect
              x="78"
              y="90"
              width="16"
              height="30"
              rx="8"
              fill="url(#notfound-suit-grad)"
              transform="rotate(-6 86 90)"
            />
            <ellipse
              cx="78"
              cy="80"
              rx="30"
              ry="26"
              fill="url(#notfound-suit-grad)"
            />
            <rect
              x="68"
              y="72"
              width="18"
              height="14"
              rx="3"
              fill={helmetFill}
            />
            <circle cx="73" cy="79" r="2" fill={visorDot} />
            <circle cx="83" cy="79" r="2" fill={visorDot} />
            <g className="notfound-wave">
              <rect
                x="98"
                y="55"
                width="14"
                height="30"
                rx="7"
                fill="url(#notfound-suit-grad)"
              />
              <circle cx="104" cy="52" r="8" fill={helmetFill} />
            </g>
            <rect
              x="46"
              y="62"
              width="14"
              height="26"
              rx="7"
              fill="url(#notfound-suit-grad)"
              transform="rotate(30 53 62)"
            />
            <circle cx="78" cy="40" r="32" fill={helmetFill} />
            <circle cx="80" cy="40" r="24" fill={visorFill} />
            <circle
              cx="80"
              cy="40"
              r="24"
              fill="url(#notfound-visor-shine)"
              opacity="0.6"
            />
            <rect
              x="70"
              y="94"
              width="16"
              height="10"
              rx="3"
              fill={helmetFill}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function NotFoundPage({
  setCursorText,
  setIsHovered,
  darkMode: propDarkMode,
}) {
  const { t } = useTranslation();

  // 2. Safely grab darkMode from App.jsx outlet context if it wasn't passed directly as a prop
  const outletContext = useOutletContext();
  const darkMode =
    propDarkMode !== undefined ? propDarkMode : outletContext?.darkMode;

  usePageSEO({
    title: "Page Not Found | 404",
    description: "The page you are looking for cannot be found on NEXA.",
    noIndex: true,
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-16 relative z-10 font-[family-name:var(--font-brand)] min-h-[70vh] flex items-center"
    >
      <div
        className={`relative overflow-hidden text-center backdrop-blur-md rounded-3xl px-6 py-20 md:py-28 w-full transition-colors duration-300 ${
          darkMode
            ? "bg-zinc-900/90 border border-zinc-800"
            : "bg-white/95 border border-gray-100"
        }`}
      >
        <NotFoundIllustration darkMode={darkMode} />

        {/* Keep the message clear of the floating illustration above. */}
        <div className="relative" style={{ height: "360px" }} />

        <p className="relative mb-3 text-sm font-bold uppercase tracking-[0.24em] text-cyan-600 dark:text-cyan-300">
          {t("notFoundEyebrow", "NEXA · PAGE NOT FOUND")}
        </p>
        <h1
          className={`relative mx-auto mb-4 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          {t("notFoundTitle", "This page drifted out of orbit.")}
        </h1>
        <p
          className={`relative max-w-xl mx-auto mb-7 leading-relaxed ${
            darkMode ? "text-slate-300" : "text-[#333333]"
          }`}
        >
          {t("notFoundDescription", "The page you’re looking for isn’t here. Let’s get you back to NEXA.")}
        </p>

        <Link to="/">
          <motion.button
            onMouseEnter={() => {
              setCursorText && setCursorText(t("cursorGoHome", "Home"));
              setIsHovered && setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered && setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-[var(--color-brand-primary)] text-white font-semibold px-6 py-2.5 rounded-full hover:bg-[var(--color-brand-primary-dark)] transition cursor-pointer text-base whitespace-nowrap"
          >
            {t("goBackHomeButton", "Go back home")}
          </motion.button>
        </Link>
      </div>
    </motion.section>
  );
}
