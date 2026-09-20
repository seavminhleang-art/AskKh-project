import React, { useState, useEffect, useMemo } from "react";
import { ArrowUp, MessageCircle, Award, Search } from "lucide-react";
import lisaPhoto from "../../../assets/Team/mom_lisa.jpg";
import thanaPhoto from "../../../assets/Team/neang_thana.jpg";
import tonganPhoto from "../../../assets/Team/hor_tongan.jpg";
import lyhengPhoto from "../../../assets/Team/cheakching_lyheng.jpg";
import monizaPhoto from "../../../assets/Team/cheat_chanmoniza.jpg";

/* ---------------------------------------------------------------------- */
/* Theme tokens (light / dark)                                            */
/* ---------------------------------------------------------------------- */

// Surfaces and text follow the shared site wrapper in index.css.
const THEME = {
  primary: "var(--text-accent)",
  primaryLight: "var(--bg-secondary)",
  darkBlue: "var(--text-main)",
  secondary: "var(--home-secondary-text)",
  secondaryLight: "var(--bg-secondary)",
  green: "var(--leaderboard-upvotes)",
  greenLight: "var(--bg-secondary)",
  navLight: "var(--bg-secondary)",
  surface: "var(--bg-card)",
  surfaceAlt: "var(--bg-secondary)",
  muted: "var(--text-muted)",
  mutedLight: "var(--text-muted)",
  body: "var(--text-main)",
  border: "var(--border-color)",
  rowBorder: "var(--border-color)",
  rowHover: "var(--bg-secondary)",
  heading: "var(--text-main)",
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
    stats: {
      upvotes: "Upvotes",
      answers: "Answers",
      solutions: "Solutions",
      helpful: "Helpful",
    },
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
      React: "React",
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
    stats: {
      upvotes: "ការគាំទ្រ",
      answers: "ចម្លើយ",
      solutions: "ដំណោះស្រាយ",
      helpful: "ជាប្រយោជន៍",
    },
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
      React: "React",
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
    avatar: thanaPhoto,
    points: "2,450 pts",
    stats: { upvotes: 328, answers: 79, solutions: 25, helpful: 142 },
  },
  {
    rank: "1ST",
    name: "CodeMaster",
    handle: "@codemaster",
    avatar: lisaPhoto,
    points: "4,125 pts",
    stats: { upvotes: 567, answers: 156, solutions: 58, helpful: 298 },
    elevated: true,
  },
  {
    rank: "3RD",
    name: "TechExplorer",
    handle: "@techexplorer",
    avatar: tonganPhoto,
    points: "1,890 pts",
    stats: { upvotes: 241, answers: 63, solutions: 19, helpful: 116 },
  },
];

const USERS = [
  {
    rank: 1,
    name: "CodeMaster",
    handle: "@codemaster",
    avatar: lisaPhoto,
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
    avatar: thanaPhoto,
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
    avatar: tonganPhoto,
    upvotes: 241,
    answers: 63,
    solutions: 19,
    helpful: 116,
    category: "React",
  },
  {
    rank: 4,
    name: "BugHunter",
    handle: "@bughunter",
    avatar: lyhengPhoto,
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
    avatar: monizaPhoto,
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
    JavaScript: { bg: t.primaryLight, text: "var(--leaderboard-gold)" },
    React: { bg: t.navLight, text: t.darkBlue },
    "Bug Report": { bg: t.secondaryLight, text: t.secondary },
    "Data Science": { bg: t.greenLight, text: t.green },
  };
  return map[category] || { bg: t.primaryLight, text: t.primary };
}

const METRICS = [
  { key: "upvotes", color: "var(--leaderboard-upvotes)", Icon: ArrowUp },
  { key: "answers", color: "var(--leaderboard-answers)", Icon: MessageCircle },
  { key: "solutions", color: "var(--leaderboard-solutions)", Icon: Award },
  { key: "helpful", color: "var(--leaderboard-helpful)", Icon: MessageCircle },
];

function MetricValue({ metric, value }) {
  const { Icon, color } = metric;
  return (
    <span
      className="inline-flex items-center justify-center gap-1 whitespace-nowrap"
      style={{ color }}
    >
      <Icon
        size={12}
        aria-hidden="true"
        fill={
          metric.key === "answers" || metric.key === "helpful"
            ? "currentColor"
            : "none"
        }
      />
      {value}
    </span>
  );
}

function EyebrowLabel({ children, t }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span style={{ width: 20, height: 2, backgroundColor: t.primary }} />
      <span
        className="text-[16px] font-medium tracking-[0.16em]"
        style={{ color: t.primary }}
      >
        {children}
      </span>
    </div>
  );
}

function ForumHeader({ t, c, lang }) {
  return (
    <div
      className="max-w-xl"
      style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}
    >
      <EyebrowLabel t={t}>{c.eyebrow}</EyebrowLabel>
      <h1
        className="text-5xl font-semibold flex items-center"
        style={{ color: t.heading }}
      >
        {c.title}
   
      </h1>
      <p className="mt-3 text-lg leading-relaxed" style={{ color: t.muted }}>
        {c.subtitle}
      </p>
    </div>
  );
}

function PointsLegend({ t, c }) {
  return (
    <aside
      className="rounded-xl border px-4 py-4 w-full sm:w-[410px]"
      style={{ borderColor: t.border, backgroundColor: t.surface }}
    >
      <p className="text-lg mb-3" style={{ color: t.heading }}>
        {c.pointsHeading}
      </p>
      <ul className="flex flex-wrap gap-x-5 gap-y-3">
        {c.points.map((item, i) => (
          <li
            key={item.label}
            className="flex items-center text-[16px] whitespace-nowrap"
            style={{ color: t.muted }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: [...METRICS.map((m) => m.color), t.muted][i],
              }}
            />
            {item.label}
            <span style={{ color: t.heading }}>{item.value}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ChampionCard({ t, c, rank, name, handle, avatar, points, stats }) {
  const accent =
    rank === "1ST"
      ? "var(--leaderboard-gold)"
      : rank === "2ND"
        ? "var(--leaderboard-solutions)"
        : "var(--leaderboard-bronze)";
  return (
    <article
      className={`relative rounded-xl border pt-7 text-center ${rank === "1ST" ? "sm:-translate-y-6" : ""}`}
      style={{
        borderColor: `color-mix(in srgb, ${accent} 33%, transparent)`,
        backgroundColor: "var(--bg-card)",
      }}
    >
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1 text-[14px] font-medium"
        style={{
          color: accent,
          backgroundColor: t.surface,
          border: `1px solid color-mix(in srgb, ${accent} 33%, transparent)`,
        }}
      >
        {rank}
      </span>
      <img
        src={avatar}
        alt={`${name} profile`}
        className="mx-auto h-16 w-16 rounded-full object-cover object-top p-1"
        style={{ border: `2px solid ${accent}` }}
      />
      <p className="mt-2 text-lg font-medium" style={{ color: t.heading }}>
        {name}
      </p>
      <p className="text-[14px]" style={{ color: t.mutedLight }}>
        {handle}
      </p>
      <p
        className="mt-2 mb-3 text-[28px] leading-tight"
        style={{ color: accent }}
      >
        {points.split(" ")[0]} <span className="text-[14px]">pts</span>
      </p>
      <div
        className="grid grid-cols-4 border-t py-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        {METRICS.map((metric) => (
          <div key={metric.key} className="text-[14px]">
            <MetricValue metric={metric} value={stats[metric.key]} />
            <p className="mt-1 text-[14px]" style={{ color: t.mutedLight }}>
              {c.stats[metric.key]}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ChampionsSection({ t, c, lang }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8">
      <div
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4"
        style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}
      >
        <div>
          <EyebrowLabel t={t}>{c.championsEyebrow}</EyebrowLabel>
          <h2
            className="text-5xl font-semibold flex items-center gap-2"
            style={{ color: t.heading }}
          >
            {c.championsTitle}
            <span style={{ color: t.primary }}>.</span>
          </h2>
        </div>
        <p
          className="max-w-[290px] text-lg leading-relaxed"
          style={{ color: t.muted }}
        >
          {c.championsSubtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
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

function UserAvatar({ t, src, name }) {
  return (
    <img
      src={src}
      alt={`${name} profile`}
      className="w-8 h-8 rounded-full object-cover object-top flex-shrink-0"
      style={{ backgroundColor: t.primaryLight }}
    />
  );
}

function CategoryBadge({ t, c, category }) {
  const style = categoryStyle(t, category);
  return (
    <span
      className="text-[14px] font-medium px-2 py-1 rounded-md whitespace-nowrap"
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
      className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-3 py-4 border-b"
      style={{
        borderColor: t.border,
        fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK,
      }}
    >
      <div className="flex gap-2 flex-wrap">
        {c.tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="px-3 py-2 rounded-lg text-base font-medium transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: "var(--color-brand-primary)",
                      color: "#fff",
                    }
                  : { backgroundColor: "transparent", color: t.muted }
              }
            >
              {tab}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <Search
            size={14}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: t.mutedLight }}
          />
          <input
            aria-label={c.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={c.searchPlaceholder}
            className="search-input pl-9 pr-3 py-2 rounded-lg text-base border outline-none w-full sm:w-60"
            style={{
              borderColor: t.border,
              color: t.heading,
              backgroundColor: t.surface,
            }}
          />
        </div>
        <select
          aria-label={c.allCategories}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-input px-3 py-2 rounded-lg text-base border outline-none"
          style={{
            borderColor: t.border,
            color: t.muted,
            backgroundColor: t.surface,
          }}
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
    <div
      className="overflow-x-auto"
      style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}
    >
      <table className="w-full min-w-[720px] text-base border-collapse">
        <thead>
          <tr
            className="text-left text-[16px]"
            style={{ color: t.mutedLight, backgroundColor: t.surfaceAlt }}
          >
            <th className="py-3 px-5 font-medium">{c.tableHeaders.rank}</th>
            <th className="py-3 px-5 font-medium">{c.tableHeaders.user}</th>
            <th className="py-3 px-5 font-medium text-right">
              {c.tableHeaders.upvotes}
            </th>
            <th className="py-3 px-5 font-medium text-right">
              {c.tableHeaders.answers}
            </th>
            <th className="py-3 px-5 font-medium text-right">
              {c.tableHeaders.solutions}
            </th>
            <th className="py-3 px-5 font-medium text-right">
              {c.tableHeaders.helpful}
            </th>
            <th className="py-3 px-5 font-medium">{c.tableHeaders.category}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.rank}
              className="tr-hover transition-colors border-t"
              style={{ borderColor: t.rowBorder }}
            >
              <td
                className="py-3 px-5 font-semibold"
                style={{ color: t.heading }}
              >
                {r.rank}
              </td>
              <td className="py-3 px-5">
                <div className="flex items-center gap-3">
                  <UserAvatar t={t} src={r.avatar} name={r.name} />
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="font-medium" style={{ color: t.heading }}>
                      {r.name}
                    </p>
                    <p className="text-base" style={{ color: t.mutedLight }}>
                      {r.handle}
                    </p>
                  </div>
                </div>
              </td>
              {METRICS.map((metric) => (
                <td key={metric.key} className="py-3 px-5 text-right">
                  <MetricValue metric={metric} value={r[metric.key]} />
                </td>
              ))}
              <td className="py-3 px-5">
                <CategoryBadge t={t} c={c} category={r.category} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p
          className="text-center py-12 text-lg"
          style={{ color: t.mutedLight }}
        >
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
  // are passed; uses default values for standalone use/preview.
  const darkState = false;
  const langState = "en";
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

  const t = THEME;
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

  const categories = useMemo(
    () => Array.from(new Set(USERS.map((u) => u.category))),
    [],
  );

  const filteredRows = USERS.filter((u) => {
    const q = search.trim().toLowerCase();
    const localizedCategory = c.categories[u.category] || u.category;
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.handle.toLowerCase().includes(q) ||
      localizedCategory.toLowerCase().includes(q);
    const matchesCategory =
      category === "All Categories" || u.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="leaderboard-page shared-page min-h-screen relative transition-colors duration-300"
      style={{ fontFamily: FONT_STACK }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
        .leaderboard-page .tr-hover:hover { background-color: ${t.rowHover}; }
        .leaderboard-page .search-input::placeholder { color: ${t.mutedLight}; }
        .leaderboard-page .search-input:focus { box-shadow: 0 0 0 3px ${t.primaryLight}; border-color: ${t.primary}; }
        .leaderboard-page ::selection { background-color: ${t.primaryLight}; }
      `}</style>

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 flex flex-col lg:flex-row lg:justify-between gap-8">
          <ForumHeader t={t} c={c} lang={lang} />
          <div className="sm:pt-1">
            <PointsLegend t={t} c={c} lang={lang} />
          </div>
        </div>

        <ChampionsSection t={t} c={c} lang={lang} />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              borderColor: t.border,
              backgroundColor: t.surface,
              boxShadow: dark
                ? "0 1px 2px rgba(0,0,0,0.3)"
                : "0 1px 2px rgba(0,28,85,0.04)",
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
