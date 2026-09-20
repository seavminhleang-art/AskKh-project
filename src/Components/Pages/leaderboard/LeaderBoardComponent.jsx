import React, { useState } from "react";
import { ArrowUp, MessageCircle, Award, Search } from "lucide-react";
import { useGetLeaderboardQuery } from '../../../features/leaderboard/leaderboardApi';
import LoadingSpinner from '../../common/LoadingSpinner';

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
    points: [{ label: "Post score", value: "+ comment score" }],
    championsEyebrow: "TOP CONTRIBUTORS",
    championsTitle: "Champions",
    championsSubtitle:
      "Ranked by community votes and helpful contributions. High-quality posts and answers rank higher.",
    stats: { upvotes: "Score", answers: "Answers", solutions: "Posts", helpful: "Comments" },
    tabs: ["All Time", "This Month", "This Week"],
    searchPlaceholder: "Search user or handle...",
    allCategories: "All Categories",
    tableHeaders: {
      rank: "#",
      user: "User",
      upvotes: "Score",
      answers: "Answers",
      solutions: "Posts",
      helpful: "Comments",
      category: "Top Category",
    },
    noResults: "No members match your search.",
    categories: {
      "Web Development": "Web Development",
      JavaScript: "JavaScript",
      "React": "React",
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
    points: [{ label: "ពិន្ទុការបង្ហោះ", value: "+ ពិន្ទុមតិយោបល់" }],
    championsEyebrow: "អ្នករួមចំណែកកំពូល",
    championsTitle: "វីរជនវេទិកា",
    championsSubtitle:
      "តម្រៀបតាមការបោះឆ្នោត និងការរួមចំណែកជាប្រយោជន៍ពីសហគមន៍។ ការបង្ហោះ និងចម្លើយដែលមានគុណភាពខ្ពស់ ត្រូវបានតម្រៀបនៅលំដាប់ខ្ពស់។",
    stats: { upvotes: "ពិន្ទុ", answers: "ចម្លើយ", solutions: "ការបង្ហោះ", helpful: "មតិយោបល់" },
    tabs: ["គ្រប់ពេល", "ខែនេះ", "សប្តាហ៍នេះ"],
    searchPlaceholder: "ស្វែងរកអ្នកប្រើ ឬឈ្មោះគណនី...",
    allCategories: "គ្រប់ប្រភេទ",
    tableHeaders: {
      rank: "ល.រ",
      user: "អ្នកប្រើប្រាស់",
      upvotes: "ពិន្ទុ",
      answers: "ចម្លើយ",
      solutions: "ការបង្ហោះ",
      helpful: "មតិយោបល់",
      category: "ប្រភេទកំពូល",
    },
    noResults: "រកមិនឃើញសមាជិកដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។",
    categories: {
      "Web Development": "អភិវឌ្ឍន៍វេបសាយ",
      JavaScript: "ចាវ៉ាស្គ្រីប",
      "React": "React",
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

function categoryStyle(t, category) {
  const map = {
    "Web Development": { bg: t.primaryLight, text: t.primary },
    JavaScript: { bg: t.primaryLight, text: "var(--leaderboard-gold)" },
    "React": { bg: t.navLight, text: t.darkBlue },
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
  return <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap" style={{ color }}>
    <Icon size={12} aria-hidden="true" fill={metric.key === "answers" || metric.key === "helpful" ? "currentColor" : "none"} />
    {value}
  </span>;
}

function EyebrowLabel({ children, t }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span style={{ width: 20, height: 2, backgroundColor: t.primary }} />
      <span className="text-sm font-medium tracking-[0.16em]" style={{ color: t.primary }}>
        {children}
      </span>
    </div>
  );
}

function ForumHeader({ t, c, lang }) {
  return (
    <div className="max-w-xl" style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}>
      <EyebrowLabel t={t}>{c.eyebrow}</EyebrowLabel>
      <h1 className="text-3xl font-normal flex items-center gap-2" style={{ color: t.heading }}>
        {c.title}
        <span style={{ color: t.primary }}>.</span>
      </h1>
      <p className="mt-3 text-lg leading-relaxed" style={{ color: t.muted }}>
        {c.subtitle}
      </p>
    </div>
  );
}

function PointsLegend({ t, c }) {
  return (
    <aside className="rounded-xl border px-4 py-4 w-full sm:w-[410px]" style={{ borderColor: t.border, backgroundColor: t.surface }}>
      <p className="text-lg mb-3" style={{ color: t.heading }}>{c.pointsHeading}</p>
      <ul className="flex flex-wrap gap-x-5 gap-y-3">
        {c.points.map((item, i) => (
          <li key={item.label} className="flex flex-wrap items-center gap-2 text-sm" style={{ color: t.muted }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: [...METRICS.map(m => m.color), t.muted][i] }} />
            {item.label}<span style={{ color: t.heading }}>{item.value}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function ChampionCard({ t, c, rank, name, handle, points, stats }) {
  const accent = rank === "1ST" ? "var(--leaderboard-gold)" : rank === "2ND" ? "var(--leaderboard-solutions)" : "var(--leaderboard-bronze)";
  return (
    <article className={`relative rounded-xl border pt-7 text-center ${rank === "1ST" ? "sm:-translate-y-6" : ""}`} style={{ borderColor: `color-mix(in srgb, ${accent} 33%, transparent)`, backgroundColor: "var(--bg-card)" }}>
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1 text-sm font-medium" style={{ color: accent, backgroundColor: t.surface, border: `1px solid color-mix(in srgb, ${accent} 33%, transparent)` }}>{rank}</span>
      <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-xl" style={{ border: `2px solid ${accent}`, color: accent }}>{name.slice(0, 2).toUpperCase()}</div>
      <p className="mt-2 text-lg font-medium" style={{ color: t.heading }}>{name}</p>
      <p className="text-sm" style={{ color: t.mutedLight }}>{handle}</p>
      <p className="mt-2 mb-3 text-[28px] leading-tight" style={{ color: accent }}>{Number(points).toLocaleString()} <span className="text-sm">pts</span></p>
      <div className="grid grid-cols-2 gap-y-3 border-t px-2 py-3 xl:grid-cols-4" style={{ borderColor: "var(--border-color)" }}>
        {METRICS.map(metric => <div key={metric.key} className="text-sm">
          <MetricValue metric={metric} value={stats[metric.key]} />
          <p className="mt-1 text-sm" style={{ color: t.mutedLight }}>{c.stats[metric.key]}</p>
        </div>)}
      </div>
    </article>
  );
}

function ChampionsSection({ t, c, lang, champions }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4" style={{ fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK }}>
        <div>
          <EyebrowLabel t={t}>{c.championsEyebrow}</EyebrowLabel>
          <h2 className="text-3xl font-normal flex items-center gap-2" style={{ color: t.heading }}>
            {c.championsTitle}
            <span style={{ color: t.primary }}>.</span>
          </h2>
        </div>
        <p className="max-w-[290px] text-sm leading-relaxed" style={{ color: t.muted }}>
          {c.championsSubtitle}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
        {champions.map((champ) => (
          <ChampionCard key={champ.id} t={t} c={c} lang={lang} {...champ} />
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Leaderboard table                                                      */
/* ---------------------------------------------------------------------- */

function UserAvatar({ t, name }) {
  return (
    <span className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: t.primaryLight, color: t.primary }} aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>
  );
}

function CategoryBadge({ t, c, category }) {
  const style = categoryStyle(t, category);
  return (
    <span
      className="text-sm font-medium px-2 py-1 rounded-md whitespace-nowrap"
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
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={
                isActive
                  ? { backgroundColor: "var(--color-brand-primary)", color: "#fff" }
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
          <Search size={14} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.mutedLight }} />
        <input
          aria-label={c.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={c.searchPlaceholder}
          className="search-input pl-9 pr-3 py-2 rounded-lg text-sm border outline-none w-full sm:w-60"
          style={{ borderColor: t.border, color: t.heading, backgroundColor: t.surface }}
        />
        </div>
        <select
          aria-label={c.allCategories}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="search-input px-3 py-2 rounded-lg text-sm border outline-none"
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
      <table className="w-full min-w-[720px] text-sm border-collapse">
        <thead>
          <tr className="text-left text-sm" style={{ color: t.mutedLight, backgroundColor: t.surfaceAlt }}>
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
            <tr key={r.id} className="tr-hover transition-colors border-t" style={{ borderColor: t.rowBorder }}>
              <td className="py-3 px-5 font-semibold" style={{ color: t.heading }}>
                {r.rank}
              </td>
              <td className="py-3 px-5">
                <div className="flex items-center gap-3">
                  <UserAvatar t={t} src={r.avatar} name={r.name} />
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="font-medium" style={{ color: t.heading }}>
                      {r.name}
                    </p>
                    <p className="text-sm" style={{ color: t.mutedLight }}>
                      {r.handle}
                    </p>
                  </div>
                </div>
              </td>
              {METRICS.map(metric => (
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
  const [period, setPeriod] = useState(0);
  const query = useGetLeaderboardQuery(["all", "month", "week"][period], { pollingInterval: 60000, refetchOnMountOrArgChange: true });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const t = THEME;
  const c = COPY[lang];

  const activeTab = c.tabs[period];
  const setActiveTab = label => setPeriod(c.tabs.indexOf(label));
  const users = query.isError ? [] : query.currentData || [];
  const categories = Array.from(new Set(users.map(user => user.category)));
  const champions = users.slice(0, 3).map(user => ({ ...user, rank: user.rank === 1 ? '1ST' : user.rank === 2 ? '2ND' : '3RD', stats: user }));

  const filteredRows = users.filter((u) => {
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6" style={{ color: t.muted }}>
          <p className="text-sm">{lang === 'km' ? 'ពិន្ទុសរុបនៃការបង្ហោះ និងមតិយោបល់ដែលបានផ្ទុក។ តម្រងពេលវេលាយោងតាមថ្ងៃបង្កើតមាតិកា។' : 'Ranked by total post and comment scores in loaded posts. Time filters use content creation dates, not vote dates. Equal scores share a rank.'}</p>
          <button className="mt-3 text-sm underline" disabled={query.isFetching} onClick={query.refetch}>{query.isFetching ? (lang === 'km' ? 'កំពុងផ្ទុក…' : 'Loading…') : (lang === 'km' ? 'ផ្ទុកឡើងវិញ' : 'Refresh rankings')}</button>
          {query.isError && <p role="alert" className="mt-3">{lang === 'km' ? 'មិនអាចផ្ទុកតារាងបានទេ។ សូមព្យាយាមម្តងទៀត។' : 'Could not load rankings. Please try refreshing.'}</p>}
        </div>
        {query.isFetching && !query.currentData ? <LoadingSpinner fullScreen={false} title={lang === 'km' ? 'កំពុងផ្ទុកតារាង' : 'Loading leaderboard'}/> : !query.isError && champions.length > 0 && <ChampionsSection t={t} c={c} lang={lang} champions={champions}/> }

        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div
            className="rounded-xl border overflow-hidden"
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
            {!query.isError && !(query.isFetching && !query.currentData) && <LeaderboardTable t={t} c={c} lang={lang} rows={filteredRows} />}
          </div>
        </section>
      </div>
    </div>
  );
}
