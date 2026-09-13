import React, { useState, useRef, useEffect, useMemo } from "react";

/* ---------------------------------------------------------------------- */
/* Theme tokens (light / dark)                                            */
/* ---------------------------------------------------------------------- */

const THEMES = {
  light: {
    primary: "#0050F3",
    primaryLight: "#E6EEFE",
    darkBlue: "#001C55",
    secondary: "#ED2B2A",
    secondaryLight: "#FDECEC",
    green: "#4CAF4F",
    greenLight: "#EAF7EA",
    navLight: "#E9ECF5",
    bg: "#FFFFFF",
    surface: "#FFFFFF",
    surfaceAlt: "#FAFBFF",
    controlBg: "#F3F6FD",
    muted: "#5b6b8c",
    mutedLight: "#7386ad",
    body: "#44547a",
    border: "#E4E9F5",
    rowBorder: "#EEF1F9",
    rowHover: "#F7F9FE",
    heading: "#001C55",
  },
  dark: {
    primary: "#5B8DFF",
    primaryLight: "#16233F",
    darkBlue: "#EAF0FF",
    secondary: "#FF6B6A",
    secondaryLight: "#2E1B1E",
    green: "#6FCB72",
    greenLight: "#16261A",
    navLight: "#1B2338",
    bg: "#0A0E1A",
    surface: "#111729",
    surfaceAlt: "#0E1424",
    controlBg: "#161D30",
    muted: "#93A2C2",
    mutedLight: "#7688AE",
    body: "#B7C2DE",
    border: "#212B44",
    rowBorder: "#1B2438",
    rowHover: "#141C30",
    heading: "#F2F5FF",
  },
};

const FONT_STACK =
  '"Google Sans", "Product Sans", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const KHMER_FONT_STACK = FONT_STACK;

/* ---------------------------------------------------------------------- */
/* Bilingual copy (English / Khmer)                                       */
/* ---------------------------------------------------------------------- */

const COPY = {
  en: {
    eyebrow: "FORUM LEADERBOARD",
    title: "Forum Leaderboard",
    subtitle:
      "Ranked by high-quality content and community votes. These members are driving the best discussions and helping others.",
    pointsHeading: "Points by Content",
    points: [
      { label: "Upvote", value: "+15" },
      { label: "Accepted Answer", value: "+20" },
      { label: "Solution", value: "+25" },
      { label: "Helpful", value: "+10" },
      { label: "Comment", value: "+5" },
    ],
    championsEyebrow: "TOP CONTRIBUTORS",
    championsTitle: "Champions",
    championsSubtitle:
      "Ranked by community votes and helpful contributions. High-quality posts and answers rank higher.",
    stats: { upvotes: "Upvotes", answers: "Answers", solutions: "Solutions", helpful: "Helpful" },
    tabs: ["All Time", "This Month", "This Week"],
    searchPlaceholder: "Search user or handle...",
    allCategories: "All Categories",
    tableHeaders: {
      rank: "#",
      user: "User",
      upvotes: "Upvotes",
      answers: "Answers",
      solutions: "Solutions",
      helpful: "Helpful",
      category: "Top Category",
    },
    noResults: "No members match your search.",
    categories: {
      "Web Development": "Web Development",
      JavaScript: "JavaScript",
      "Next.js": "Next.js",
      "Bug Report": "Bug Report",
      "Data Science": "Data Science",
    },
    darkModeToggle: "Dark mode",
    lightModeToggle: "Light mode",
    langToggle: "ខ្មែរ",
  },
  km: {
    eyebrow: "តារាងអ្នកឈានមុខគេ",
    title: "តារាងអ្នកឈានមុខគេនៃវេទិកា",
    subtitle:
      "តម្រៀបតាមគុណភាពមាតិកា និងការបោះឆ្នោតពីសហគមន៍។ សមាជិកទាំងនេះជាអ្នកដឹកនាំការពិភាក្សាល្អៗ និងជួយអ្នកដទៃ។",
    pointsHeading: "ពិន្ទុតាមប្រភេទមាតិកា",
    points: [
      { label: "ការគាំទ្រ (Upvote)", value: "+១៥" },
      { label: "ចម្លើយត្រូវបានទទួលយក", value: "+២០" },
      { label: "ដំណោះស្រាយ", value: "+២៥" },
      { label: "ជាប្រយោជន៍", value: "+១០" },
      { label: "មតិយោបល់", value: "+៥" },
    ],
    championsEyebrow: "អ្នករួមចំណែកកំពូល",
    championsTitle: "វីរជនវេទិកា",
    championsSubtitle:
      "តម្រៀបតាមការបោះឆ្នោត និងការរួមចំណែកជាប្រយោជន៍ពីសហគមន៍។ ការបង្ហោះ និងចម្លើយដែលមានគុណភាពខ្ពស់ ត្រូវបានតម្រៀបនៅលំដាប់ខ្ពស់។",
    stats: { upvotes: "ការគាំទ្រ", answers: "ចម្លើយ", solutions: "ដំណោះស្រាយ", helpful: "ជាប្រយោជន៍" },
    tabs: ["គ្រប់ពេល", "ខែនេះ", "សប្តាហ៍នេះ"],
    searchPlaceholder: "ស្វែងរកអ្នកប្រើ ឬឈ្មោះគណនី...",
    allCategories: "គ្រប់ប្រភេទ",
    tableHeaders: {
      rank: "ល.រ",
      user: "អ្នកប្រើប្រាស់",
      upvotes: "ការគាំទ្រ",
      answers: "ចម្លើយ",
      solutions: "ដំណោះស្រាយ",
      helpful: "ជាប្រយោជន៍",
      category: "ប្រភេទកំពូល",
    },
    noResults: "រកមិនឃើញសមាជិកដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។",
    categories: {
      "Web Development": "អភិវឌ្ឍន៍វេបសាយ",
      JavaScript: "ចាវ៉ាស្គ្រីប",
      "Next.js": "Next.js",
      "Bug Report": "រាយការណ៍បញ្ហា",
      "Data Science": "វិទ្យាសាស្ត្រទិន្នន័យ",
    },
    darkModeToggle: "របៀបងងឹត",
    lightModeToggle: "របៀបភ្លឺ",
    langToggle: "English",
  },
};

// The Navbar uses "KH"/"ENG" as its language codes; this component's own
// COPY table is keyed by "km"/"en". Normalize here so this component works
// correctly no matter which convention the parent passes down, instead of
// silently rendering undefined copy (which is what was happening before —
// COPY["KH"] doesn't exist, so c.eyebrow etc. would throw/blank out).
function normalizeLang(lang) {
  if (!lang) return "en";
  const l = String(lang).toLowerCase();
  if (l === "kh" || l === "km" || l === "khmer") return "km";
  return "en";
}

/* ---------------------------------------------------------------------- */
/* Static data                                                            */
/* ---------------------------------------------------------------------- */

const CHAMPIONS = [
  {
    rank: "2ND",
    name: "DevSphere",
    handle: "@devsphere",
    points: "2,450 pts",
    stats: { upvotes: 328, answers: 79, solutions: 25, helpful: 142 },
  },
  {
    rank: "1ST",
    name: "CodeMaster",
    handle: "@codemaster",
    points: "4,125 pts",
    stats: { upvotes: 567, answers: 156, solutions: 58, helpful: 298 },
    elevated: true,
  },
  {
    rank: "3RD",
    name: "TechExplorer",
    handle: "@techexplorer",
    points: "1,890 pts",
    stats: { upvotes: 241, answers: 63, solutions: 19, helpful: 116 },
  },
];

const USERS = [
  {
    rank: 1,
    name: "CodeMaster",
    handle: "@codemaster",
    avatar: "C",
    upvotes: 567,
    answers: 156,
    solutions: 58,
    helpful: 298,
    category: "Web Development",
  },
  {
    rank: 2,
    name: "DevSphere",
    handle: "@devsphere",
    avatar: "D",
    upvotes: 328,
    answers: 79,
    solutions: 25,
    helpful: 142,
    category: "JavaScript",
  },
  {
    rank: 3,
    name: "TechExplorer",
    handle: "@techexplorer",
    avatar: "T",
    upvotes: 241,
    answers: 63,
    solutions: 19,
    helpful: 116,
    category: "Next.js",
  },
  {
    rank: 4,
    name: "BugHunter",
    handle: "@bughunter",
    avatar: "B",
    upvotes: 198,
    answers: 42,
    solutions: 14,
    helpful: 89,
    category: "Bug Report",
  },
  {
    rank: 5,
    name: "DataWizard",
    handle: "@datawizard",
    avatar: "D",
    upvotes: 178,
    answers: 38,
    solutions: 12,
    helpful: 78,
    category: "Data Science",
  },
];

function categoryStyle(t, category) {
  const map = {
    "Web Development": { bg: t.primaryLight, text: t.primary },
    JavaScript: { bg: t.greenLight, text: t.green },
    "Next.js": { bg: t.navLight, text: t.darkBlue },
    "Bug Report": { bg: t.secondaryLight, text: t.secondary },
    "Data Science": { bg: t.primaryLight, text: t.primary },
  };
  return map[category] || { bg: t.primaryLight, text: t.primary };
}

/* ---------------------------------------------------------------------- */
/* Particle network background                                            */
/* ---------------------------------------------------------------------- */

function ParticleNetwork({ dark }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let rafId = null;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    const mouse = { x: -9999, y: -9999, active: false };

    const lineColor = dark ? "91, 141, 255" : "0, 80, 243";
    const nodeColorA = dark ? "rgba(91, 141, 255, 0.45)" : "rgba(0, 80, 243, 0.35)";
    const nodeColorB = dark ? "rgba(234, 240, 255, 0.25)" : "rgba(0, 28, 85, 0.35)";
    const glowColor = dark ? "91, 141, 255" : "0, 80, 243";

    function nodeCountFor(w) {
      if (w < 640) return 28;
      if (w < 1024) return 45;
      return 70;
    }

    function initParticles() {
      const count = nodeCountFor(width);
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        darkNode: Math.random() < 0.2,
      }));
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            let opacity = 0.15 * (1 - dist / 160);
            opacity = Math.max(0.05, Math.min(0.15, opacity));
            if (mouse.active) {
              const mdx = (a.x + b.x) / 2 - mouse.x;
              const mdy = (a.y + b.y) / 2 - mouse.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < 120) {
                opacity = Math.min(0.28, opacity + 0.1 * (1 - mdist / 120));
              }
            }
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }

    function drawNodes() {
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.darkNode ? nodeColorB : nodeColorA;
        ctx.fill();
      }
    }

    function drawMouseGlow() {
      if (!mouse.active) return;
      const radius = 190;
      const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius);
      grad.addColorStop(0, `rgba(${glowColor}, 0.07)`);
      grad.addColorStop(0.55, `rgba(${glowColor}, 0.025)`);
      grad.addColorStop(1, `rgba(${glowColor}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStaticFrame() {
      ctx.clearRect(0, 0, width, height);
      drawConnections();
      drawNodes();
    }

    function step() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = ((100 - dist) / 100) * 0.02;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }
      }
      ctx.clearRect(0, 0, width, height);
      drawMouseGlow();
      drawConnections();
      drawNodes();
      rafId = requestAnimationFrame(step);
    }

    function start() {
      resize();
      if (reduceQuery.matches) {
        drawStaticFrame();
      } else {
        step();
      }
    }

    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function handleMouseLeave() {
      mouse.active = false;
    }
    function handleMotionChange() {
      if (rafId) cancelAnimationFrame(rafId);
      if (reduceQuery.matches) {
        mouse.active = false;
        drawStaticFrame();
      } else {
        step();
      }
    }

    start();
    window.addEventListener("resize", resize);
    if (!isTouch) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseleave", handleMouseLeave);
    }
    if (reduceQuery.addEventListener) {
      reduceQuery.addEventListener("change", handleMotionChange);
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (reduceQuery.removeEventListener) {
        reduceQuery.removeEventListener("change", handleMotionChange);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [dark]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}

/* ---------------------------------------------------------------------- */
/* Khmer lotus motifs                                                     */
/* ---------------------------------------------------------------------- */

function LotusBud({ size = 14, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c-3 4-3 9 0 13 3-4 3-9 0-13Z" fill={color} opacity="0.95" />
      <path d="M5.5 8.5c0 4 2.7 6.7 6.5 6.5-3-3-4-5-6.5-6.5Z" fill={color} opacity="0.55" />
      <path d="M18.5 8.5c0 4-2.7 6.7-6.5 6.5 3-3 4-5 6.5-6.5Z" fill={color} opacity="0.55" />
    </svg>
  );
}

function LotusBloom({ size = 96, color, opacity = 0.1 }) {
  const petals = Array.from({ length: 8 });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.1">
        {petals.map((_, i) => (
          <path
            key={i}
            d="M50 50 C45 34 45 14 50 4 C55 14 55 34 50 50 Z"
            transform={`rotate(${(360 / petals.length) * i} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="5" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* Header + toggles + points legend                                       */
/* ---------------------------------------------------------------------- */

function EyebrowLabel({ children, t }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ width: 20, height: 2, backgroundColor: t.primary }} />
      <span className="text-xs font-semibold tracking-wide" style={{ color: t.primary }}>
        {children}
      </span>
    </div>
  );
}

function ForumHeader({ t, c, lang }) {
  return (
    <div className="max-w-xl" style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}>
      <EyebrowLabel t={t}>{c.eyebrow}</EyebrowLabel>
      <h1 className="text-4xl sm:text-5xl font-bold flex items-center gap-2" style={{ color: t.heading }}>
        {c.title}
        <LotusBud size={18} color={t.primary} />
      </h1>
      <p className="mt-4 text-base leading-relaxed" style={{ color: t.muted }}>
        {c.subtitle}
      </p>
    </div>
  );
}

function PointsLegend({ t, c, lang }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-5 w-full sm:w-72"
      style={{ borderColor: t.border, backgroundColor: t.surfaceAlt, fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}
    >
      <div className="pointer-events-none absolute -top-8 -right-8" style={{ transform: "rotate(12deg)" }}>
        <LotusBloom size={90} color={t.primary} opacity={0.06} />
      </div>
      <p className="relative text-sm font-semibold mb-3" style={{ color: t.heading }}>
        {c.pointsHeading}
      </p>
      <ul className="relative space-y-2.5">
        {c.points.map((item, i) => (
          <li key={item.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2" style={{ color: t.body }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  backgroundColor: [t.primary, t.green, t.darkBlue, t.primary, t.secondary][i],
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              {item.label}
            </span>
            <span className="font-semibold" style={{ color: t.heading }}>
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Champions                                                               */
/* ---------------------------------------------------------------------- */

function ChampionCard({ t, c, lang, rank, name, handle, points, stats, elevated }) {
  return (
    <div
      className={
        "group relative overflow-hidden rounded-2xl border p-6 transition-shadow duration-200 hover:shadow-md" +
        (elevated ? " sm:-translate-y-3" : "")
      }
      style={{
        borderColor: t.border,
        backgroundColor: elevated ? t.surface : t.primaryLight,
        boxShadow: elevated ? "0 8px 24px rgba(0,0,0,0.18)" : "none",
      }}
    >
      <div
        className="pointer-events-none absolute -bottom-12 -right-12 opacity-0 transition-all duration-500 group-hover:opacity-100"
        style={{ transform: "rotate(-8deg) scale(0.9)" }}
      >
        <LotusBloom size={130} color={elevated ? t.darkBlue : t.primary} opacity={0.13} />
      </div>

      <div className="relative flex items-center justify-between mb-4">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: t.primaryLight, color: t.primary }}
        >
          {rank}
        </span>
        <span className="text-sm font-semibold" style={{ color: t.heading }}>
          {points}
        </span>
      </div>
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3"
        style={{ backgroundColor: t.surface, color: t.primary, border: `1px solid ${t.border}` }}
      >
        {name[0]}
      </div>
      <p className="font-semibold" style={{ color: t.heading }}>
        {name}
      </p>
      <p className="text-sm mb-4" style={{ color: t.mutedLight }}>
        {handle}
      </p>
      <div
        className="grid grid-cols-2 gap-3 text-xs pt-4 border-t"
        style={{ borderColor: t.border, fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}
      >
        <div style={{ color: t.mutedLight }}>
          {c.stats.upvotes}
          <span className="font-semibold block text-sm mt-0.5" style={{ color: t.heading }}>
            {stats.upvotes}
          </span>
        </div>
        <div style={{ color: t.mutedLight }}>
          {c.stats.answers}
          <span className="font-semibold block text-sm mt-0.5" style={{ color: t.heading }}>
            {stats.answers}
          </span>
        </div>
        <div style={{ color: t.mutedLight }}>
          {c.stats.solutions}
          <span className="font-semibold block text-sm mt-0.5" style={{ color: t.heading }}>
            {stats.solutions}
          </span>
        </div>
        <div style={{ color: t.mutedLight }}>
          {c.stats.helpful}
          <span className="font-semibold block text-sm mt-0.5" style={{ color: t.heading }}>
            {stats.helpful}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChampionsSection({ t, c, lang }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4" style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}>
        <div>
          <EyebrowLabel t={t}>{c.championsEyebrow}</EyebrowLabel>
          <h2 className="text-3xl font-bold flex items-center gap-2" style={{ color: t.heading }}>
            {c.championsTitle}
            <LotusBud size={16} color={t.primary} />
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed" style={{ color: t.muted }}>
          {c.championsSubtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
        {CHAMPIONS.map((champ) => (
          <ChampionCard key={champ.handle} t={t} c={c} lang={lang} {...champ} />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Leaderboard table                                                      */
/* ---------------------------------------------------------------------- */

function UserAvatar({ t, letter }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
      style={{ backgroundColor: t.primaryLight, color: t.primary }}
    >
      {letter}
    </div>
  );
}

function CategoryBadge({ t, c, category }) {
  const style = categoryStyle(t, category);
  return (
    <span
      className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {c.categories[category] || category}
    </span>
  );
}

function LeaderboardControls({
  t,
  c,
  lang,
  activeTab,
  setActiveTab,
  search,
  setSearch,
  category,
  setCategory,
  categories,
}) {
  return (
    <div
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 border-b"
      style={{ borderColor: t.border, fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}
    >
      <div className="flex gap-2 flex-wrap">
        {c.tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
              style={
                isActive
                  ? { backgroundColor: t.primary, color: "#fff" }
                  : { backgroundColor: t.controlBg, color: t.muted }
              }
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={c.searchPlaceholder}
          className="search-input px-4 py-2 rounded-full text-sm border outline-none w-full sm:w-60"
          style={{ borderColor: t.border, color: t.heading, backgroundColor: t.surface }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-input px-4 py-2 rounded-full text-sm border outline-none"
          style={{ borderColor: t.border, color: t.muted, backgroundColor: t.surface }}
        >
          <option value="All Categories">{c.allCategories}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {c.categories[cat] || cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function LeaderboardTable({ t, c, lang, rows }) {
  return (
    <div className="overflow-x-auto" style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left" style={{ color: t.mutedLight }}>
            <th className="py-3 px-5 font-medium">{c.tableHeaders.rank}</th>
            <th className="py-3 px-5 font-medium">{c.tableHeaders.user}</th>
            <th className="py-3 px-5 font-medium text-right">{c.tableHeaders.upvotes}</th>
            <th className="py-3 px-5 font-medium text-right">{c.tableHeaders.answers}</th>
            <th className="py-3 px-5 font-medium text-right">{c.tableHeaders.solutions}</th>
            <th className="py-3 px-5 font-medium text-right">{c.tableHeaders.helpful}</th>
            <th className="py-3 px-5 font-medium">{c.tableHeaders.category}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.rank} className="tr-hover transition-colors border-t" style={{ borderColor: t.rowBorder }}>
              <td className="py-4 px-5 font-semibold" style={{ color: t.heading }}>
                {r.rank}
              </td>
              <td className="py-4 px-5">
                <div className="flex items-center gap-3">
                  <UserAvatar t={t} letter={r.avatar} />
                  <div>
                    <p className="font-medium" style={{ color: t.heading }}>
                      {r.name}
                    </p>
                    <p className="text-xs" style={{ color: t.mutedLight }}>
                      {r.handle}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-5 text-right" style={{ color: t.body }}>
                {r.upvotes}
              </td>
              <td className="py-4 px-5 text-right" style={{ color: t.body }}>
                {r.answers}
              </td>
              <td className="py-4 px-5 text-right" style={{ color: t.body }}>
                {r.solutions}
              </td>
              <td className="py-4 px-5 text-right" style={{ color: t.body }}>
                {r.helpful}
              </td>
              <td className="py-4 px-5">
                <CategoryBadge t={t} c={c} category={r.category} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="text-center py-12 text-sm" style={{ color: t.mutedLight }}>
          {c.noResults}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* App                                                                     */
/* ---------------------------------------------------------------------- */

export default function App({ dark: darkProp, lang: langProp } = {}) {
  // Controlled by the app's navbar (dark-mode icon + KH/ENG pill) when props
  // are passed; falls back to internal state for standalone use/preview.
  const [darkState, setDarkState] = useState(false);
  const [langState, setLangState] = useState("en");
  const dark = darkProp !== undefined ? darkProp : darkState;
  // FIX: the Navbar sends "KH"/"ENG", this component's COPY table is keyed
  // by "km"/"en" — without normalizing, COPY["KH"] was undefined and the
  // page silently failed to update (or crashed) when lang was passed down
  // from the navbar directly. normalizeLang() maps either convention onto
  // the "km"/"en" keys this file actually uses.
  const lang = normalizeLang(langProp !== undefined ? langProp : langState);
  const [activeTab, setActiveTab] = useState("All Time");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const t = THEMES[dark ? "dark" : "light"];
  const c = COPY[lang];

  // Keep the active tab label in sync when switching languages
  useEffect(() => {
    const tabsEn = COPY.en.tabs;
    const tabsKm = COPY.km.tabs;
    const idx = tabsEn.indexOf(activeTab);
    const idxKm = tabsKm.indexOf(activeTab);
    if (lang === "km" && idx !== -1) setActiveTab(tabsKm[idx]);
    if (lang === "en" && idxKm !== -1) setActiveTab(tabsEn[idxKm]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const categories = useMemo(() => Array.from(new Set(USERS.map((u) => u.category))), []);

  const filteredRows = USERS.filter((u) => {
    const q = search.trim().toLowerCase();
    const localizedCategory = c.categories[u.category] || u.category;
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      localizedCategory.toLowerCase().includes(q);
    const matchesCategory = category === "All Categories" || u.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="min-h-screen relative transition-colors duration-300"
      style={{ backgroundColor: t.bg, fontFamily: FONT_STACK }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        .tr-hover:hover { background-color: ${t.rowHover}; }
        .search-input::placeholder { color: ${t.mutedLight}; }
        .search-input:focus { box-shadow: 0 0 0 3px ${t.primaryLight}; border-color: ${t.primary}; }
        ::selection { background-color: ${t.primaryLight}; }
      `}</style>

      <ParticleNetwork dark={dark} />

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row sm:justify-between gap-8">
          <ForumHeader t={t} c={c} lang={lang} />
          <div className="sm:pt-1">
            <PointsLegend t={t} c={c} lang={lang} />
          </div>
        </div>

        <ChampionsSection t={t} c={c} lang={lang} />

        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: t.border,
              backgroundColor: t.surface,
              boxShadow: dark ? "0 1px 2px rgba(0,0,0,0.3)" : "0 1px 2px rgba(0,28,85,0.04)",
            }}
          >
            <LeaderboardControls
              t={t}
              c={c}
              lang={lang}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
            />
            <LeaderboardTable t={t} c={c} lang={lang} rows={filteredRows} />
          </div>
        </section>
      </div>
    </div>
  );
}
