import { useState } from "react";
import {
  ArrowUp,
  MessageCircle,
  Award,
  Search,
  Crown,
  Shield,
  Bookmark,
  Package,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
  Trophy,
  Zap,
  Medal,
  Star,
  Check,
} from "lucide-react";
import photoCheaSovann from "@/assets/Website/0534f7df0b08edc70592d10d4bd908c0.jpg";
import photoKayKeo from "@/assets/Website/37469a0f02d084ef19d3cf0b052af250.jpg";
import photoKhemSomnang from "@/assets/Website/4dba6191ebd18650c52de2ed5fb47f7d.jpg";
import { profileImageUrl } from "../../../features/workspace/profileImage";
import { useGetLeaderboardQuery } from "../../../features/leaderboard/leaderboardApi";
import LoadingSpinner from "../../common/LoadingSpinner";

/* ---------------------------------------------------------------------- */
/* Theme tokens                                                           */
/* ---------------------------------------------------------------------- */

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
  heading: "var(--home-primary-text)",
};

const FONT_STACK =
  '"Google Sans", "Product Sans", Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

const KHMER_FONT_STACK = FONT_STACK;

/* ---------------------------------------------------------------------- */
/* Bilingual copy                                                         */
/* ---------------------------------------------------------------------- */

const COPY = {
  en: {
    eyebrow: "FORUM LEADERBOARD",
    title: "Forum Leaderboard",
    subtitle:
      "Ranked by high-quality content and community votes. These members are driving the best discussions and helping others.",

    pointsHeading: "Points by Content",
    points: [
      {
        label: "Post score",
        value: "+ comment score",
      },
    ],

    podiumEyebrow: "ISTAD Grand Champions Podium",
    podiumTitle: "Top All-Round Campus Champions",
    silverRank: "#2 Silver",
    championRank: "#1 CHAMPION",
    bronzeRank: "#3 Bronze",
    championScore: "CHAMPION SCORE:",
    score: "Score:",
    badgesLabel: "Badges",
    returnedLabel: "Returned",
    viewHonors: "View Honors",
    honors: "Honors",
    awardBadge: "+ Award Badge",
    grandmasterTag: "Grandmaster Leader",

    stats: {
      upvotes: "Score",
      answers: "Answers",
      solutions: "Posts",
      helpful: "Comments",
    },

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
      {
        label: "ពិន្ទុការបង្ហោះ",
        value: "+ ពិន្ទុមតិយោបល់",
      },
    ],

    podiumEyebrow: "វេទិកាជើងឯកកំពូល ISTAD",
    podiumTitle: "ជើងឯកឆ្នើមប្រចាំសាកលវិទ្យាល័យ",
    silverRank: "#2 ប្រាក់ (Silver)",
    championRank: "#1 ជើងឯក (Champion)",
    bronzeRank: "#3 សំរឹទ្ធ (Bronze)",
    championScore: "ពិន្ទុជើងឯក:",
    score: "ពិន្ទុ:",
    badgesLabel: "ផ្លាកសញ្ញា",
    returnedLabel: "ប្រគល់ជូនវិញ",
    viewHonors: "មើលកិត្តិយស",
    honors: "កិត្តិយស",
    awardBadge: "+ ប្រគល់ផ្លាកសញ្ញា",
    grandmasterTag: "អ្នកដឹកនាំឆ្នើម (Grandmaster)",

    stats: {
      upvotes: "ពិន្ទុ",
      answers: "ចម្លើយ",
      solutions: "ការបង្ហោះ",
      helpful: "មតិយោបល់",
    },

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
      React: "React",
      "Bug Report": "រាយការណ៍បញ្ហា",
      "Data Science": "វិទ្យាសាស្ត្រទិន្នន័យ",
    },

    darkModeToggle: "របៀបងងឹត",
    lightModeToggle: "របៀបភ្លឺ",
    langToggle: "English",
  },
};

/* ---------------------------------------------------------------------- */
/* Helpers                                                                */
/* ---------------------------------------------------------------------- */

function normalizeLang(lang) {
  if (!lang) return "en";

  const normalized = String(lang).toLowerCase();

  if (normalized === "kh" || normalized === "km" || normalized === "khmer") {
    return "km";
  }

  return "en";
}

function categoryStyle(t, category) {
  const styles = {
    "Web Development": {
      bg: t.primaryLight,
      text: t.primary,
    },

    JavaScript: {
      bg: t.primaryLight,
      text: "var(--leaderboard-gold)",
    },

    React: {
      bg: t.navLight,
      text: t.darkBlue,
    },

    "Bug Report": {
      bg: t.secondaryLight,
      text: t.secondary,
    },

    "Data Science": {
      bg: t.greenLight,
      text: t.green,
    },
  };

  return (
    styles[category] || {
      bg: t.primaryLight,
      text: t.primary,
    }
  );
}

/* ---------------------------------------------------------------------- */
/* Metrics                                                                */
/* ---------------------------------------------------------------------- */

const METRICS = [
  {
    key: "upvotes",
    color: "var(--leaderboard-upvotes)",
    Icon: ArrowUp,
    fill: false,
  },
  {
    key: "answers",
    color: "var(--leaderboard-answers)",
    Icon: MessageCircle,
    fill: true,
  },
  {
    key: "solutions",
    color: "var(--leaderboard-solutions)",
    Icon: Award,
    fill: false,
  },
  {
    key: "helpful",
    color: "var(--leaderboard-helpful)",
    Icon: MessageCircle,
    fill: true,
  },
];

/* ---------------------------------------------------------------------- */
/* Metric Value                                                           */
/* ---------------------------------------------------------------------- */

function MetricValue({ metric, value }) {
  const { Icon, color, fill } = metric;

  return (
    <span
      className="inline-flex items-center justify-center gap-1 whitespace-nowrap"
      style={{ color }}
    >
      <Icon
        size={12}
        aria-hidden="true"
        fill={fill ? "currentColor" : "none"}
      />

      {value}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Eyebrow                                                                */
/* ---------------------------------------------------------------------- */

function EyebrowLabel({ children, t }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span
        style={{
          width: 20,
          height: 2,
          backgroundColor: t.primary,
        }}
      />

      <span className="text-lg font-medium" style={{ color: t.primary }}>
        {children}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Forum Header                                                           */
/* ---------------------------------------------------------------------- */

function ForumHeader({ t, c, lang }) {
  return (
    <div
      className="max-w-xl"
      style={{
        fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK,
      }}
    >
      <EyebrowLabel t={t}>{c.eyebrow}</EyebrowLabel>

      <h1
        className="flex items-center gap-2 text-5xl font-bold"
        style={{ color: t.heading }}
      >
        {c.title}

        <span style={{ color: t.secondary }}>.</span>
      </h1>

      <p className="mt-3 text-lg leading-relaxed" style={{ color: t.muted }}>
        {c.subtitle}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Points Legend                                                          */
/* ---------------------------------------------------------------------- */

function PointsLegend({ t, c }) {
  return (
    <aside
      className="w-full rounded-xl border px-4 py-4 sm:w-[410px]"
      style={{
        borderColor: t.border,
        backgroundColor: t.surface,
      }}
    >
      <p className="mb-3 text-lg" style={{ color: t.heading }}>
        {c.pointsHeading}
      </p>

      <ul className="flex flex-wrap gap-x-5 gap-y-3">
        {c.points.map((item, index) => (
          <li
            key={item.label}
            className="flex flex-wrap items-center gap-2 text-base"
            style={{ color: t.muted }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: METRICS[index]?.color || t.muted,
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

/* ---------------------------------------------------------------------- */
/* Grand Champions Podium Section                                         */
/* ---------------------------------------------------------------------- */

function ChampionsSection({
  t,
  c,
  lang,
  champions = [],
  onViewHonors,
  onAwardBadge,
}) {
  // Ensure we have 3 podium entries: Rank 2 (Silver), Rank 1 (Champion), Rank 3 (Bronze)
  const defaultChampions = [
    {
      id: "c1",
      rank: 1,
      rankType: "champion",
      name: "Kay Keo",
      khmerName: "កែវ កាយ",
      department: "Academic Leadership & Executive Board",
      tag: "Grandmaster Leader",
      points: 2450,
      level: 25,
      badges: 22,
      returned: 8,
      avatar: photoKayKeo,
    },
    {
      id: "c2",
      rank: 2,
      rankType: "silver",
      name: "Dr. Chea Sovann",
      khmerName: "បណ្ឌិត ជា សុវណ្ណ",
      department: "Data Science & AI Engineering",
      points: 1890,
      level: 19,
      badges: 19,
      returned: 14,
      avatar: photoCheaSovann,
    },
    {
      id: "c3",
      rank: 3,
      rankType: "bronze",
      name: "Khem Somnang",
      khmerName: "ខែម សំណាង",
      department: "Campus Operations & Central Safety",
      points: 1650,
      level: 17,
      badges: 15,
      returned: 92,
      avatar: photoKhemSomnang,
    },
  ];

  // Enrich data with actual loaded user data if present
  const rank1User = champions[0] || defaultChampions[0];
  const rank2User = champions[1] || defaultChampions[1];
  const rank3User = champions[2] || defaultChampions[2];

  const podium1 = {
    ...defaultChampions[0],
    ...rank1User,
    rankType: "champion",
    name: rank1User?.name || defaultChampions[0].name,
    khmerName:
      rank1User?.handle ||
      rank1User?.khmerName ||
      (lang === "km" ? rank1User?.name : "@champion"),
    department:
      rank1User?.category && rank1User.category !== "—"
        ? `${rank1User.category} Contributor`
        : defaultChampions[0].department,
    points:
      rank1User?.points ?? rank1User?.upvotes ?? defaultChampions[0].points,
    level:
      rank1User?.level ??
      Math.max(1, Math.floor((rank1User?.points ?? 2450) / 100) + 1),
    badges:
      rank1User?.badges ??
      Math.max(5, (rank1User?.solutions || 0) + (rank1User?.answers || 0) + 12),
    returned: rank1User?.returned ?? rank1User?.helpful ?? 8,
    avatar: rank1User?.avatar
      ? profileImageUrl(rank1User.avatar)
      : defaultChampions[0].avatar,
  };

  const podium2 = {
    ...defaultChampions[1],
    ...rank2User,
    rankType: "silver",
    name: rank2User?.name || defaultChampions[1].name,
    khmerName:
      rank2User?.handle ||
      rank2User?.khmerName ||
      (lang === "km" ? rank2User?.name : "@silver"),
    department:
      rank2User?.category && rank2User.category !== "—"
        ? `${rank2User.category} Contributor`
        : defaultChampions[1].department,
    points:
      rank2User?.points ?? rank2User?.upvotes ?? defaultChampions[1].points,
    level:
      rank2User?.level ??
      Math.max(1, Math.floor((rank2User?.points ?? 1890) / 100) + 1),
    badges:
      rank2User?.badges ??
      Math.max(3, (rank2User?.solutions || 0) + (rank2User?.answers || 0) + 9),
    returned: rank2User?.returned ?? rank2User?.helpful ?? 14,
    avatar: rank2User?.avatar
      ? profileImageUrl(rank2User.avatar)
      : defaultChampions[1].avatar,
  };

  const podium3 = {
    ...defaultChampions[2],
    ...rank3User,
    rankType: "bronze",
    name: rank3User?.name || defaultChampions[2].name,
    khmerName:
      rank3User?.handle ||
      rank3User?.khmerName ||
      (lang === "km" ? rank3User?.name : "@bronze"),
    department:
      rank3User?.category && rank3User.category !== "—"
        ? `${rank3User.category} Contributor`
        : defaultChampions[2].department,
    points:
      rank3User?.points ?? rank3User?.upvotes ?? defaultChampions[2].points,
    level:
      rank3User?.level ??
      Math.max(1, Math.floor((rank3User?.points ?? 1650) / 100) + 1),
    badges:
      rank3User?.badges ??
      Math.max(2, (rank3User?.solutions || 0) + (rank3User?.answers || 0) + 7),
    returned: rank3User?.returned ?? rank3User?.helpful ?? 92,
    avatar: rank3User?.avatar
      ? profileImageUrl(rank3User.avatar)
      : defaultChampions[2].avatar,
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6">
      {/* Header with Pill & Main Title */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-base font-semibold bg-amber-50/90 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/50 mb-3 shadow-xs">
          <Crown size={14} className="text-amber-500 fill-amber-500" />
          <span>{c.podiumEyebrow}</span>
        </div>
        <h2 className="text-5xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[var(--home-secondary-text)]">
          {c.podiumTitle}
        </h2>
      </div>

      {/* 3-Column Podium Grid: #2 Silver (Left), #1 Champion (Center), #3 Bronze (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end max-w-6xl mx-auto">
        {/* CARD 1: #2 Silver */}
        <div className="bg-white dark:bg-zinc-900/95 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative">
          {/* Rank Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-zinc-700">
            <Shield size={13} className="text-slate-400" />
            <span>{c.silverRank}</span>
          </span>

          {/* Avatar with Lv Badge */}
          <div className="relative mt-5 mb-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              {podium2.avatar ? (
                <img
                  src={podium2.avatar}
                  alt={podium2.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = photoCheaSovann;
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center font-bold text-5xl text-slate-600">
                  {podium2.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 bg-zinc-900/90 dark:bg-zinc-800 text-white text-[14px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-zinc-700/50">
              Lv.{podium2.level}
            </span>
          </div>

          {/* Name & Subtitles */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {podium2.name}
          </h3>
          <p className="text-base font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            {podium2.khmerName}
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {podium2.department}
          </p>

          {/* Score Box */}
          <div className="w-full bg-slate-50/80 dark:bg-zinc-800/60 py-2.5 px-4 rounded-xl flex items-center justify-between mt-4">
            <span className="text-base text-slate-400 dark:text-slate-500 font-medium">
              {c.score}
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {Number(podium2.points).toLocaleString()}{" "}
              <span className="text-amber-500 font-extrabold text-base">
                XP
              </span>
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-3 text-base font-medium text-slate-600 dark:text-slate-300 mt-3.5">
            <span className="inline-flex items-center gap-1.5">
              <Bookmark size={13} className="text-amber-600" />
              <span>
                {podium2.badges} {c.badgesLabel}
              </span>
            </span>
            <span className="text-slate-300 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Package size={13} className="text-emerald-600" />
              <span>
                {podium2.returned} {c.returnedLabel}
              </span>
            </span>
          </div>

          {/* View Honors Button */}
          <button
            type="button"
            onClick={() => onViewHonors?.(podium2)}
            className="w-full mt-4 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 text-base font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            {c.viewHonors}
          </button>
        </div>

        {/* CARD 2: #1 CHAMPION (Elevated, Prominent Gold Border & Warm Glow) */}
        <div className="bg-amber-50/40 dark:bg-amber-950/20 rounded-3xl p-6 sm:p-7 shadow-xl shadow-amber-500/5 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center relative md:-translate-y-4 z-10">
          {/* Rank Badge */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-base font-bold bg-amber-400 text-amber-950 shadow-xs">
            <Crown size={13} className="fill-amber-950 text-amber-950" />
            <span>{c.championRank}</span>
          </span>

          {/* Avatar with Golden Ring & Lv Badge */}
          <div className="relative mt-5 mb-3">
            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md ring-4 ring-amber-300 dark:ring-amber-500/60 bg-amber-100/50 dark:bg-zinc-800">
              {podium1.avatar ? (
                <img
                  src={podium1.avatar}
                  alt={podium1.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = photoKayKeo;
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center font-bold text-5xl text-amber-800">
                  {podium1.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 bg-amber-600 text-white text-[14px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-amber-500">
              Lv.{podium1.level}
            </span>
          </div>

          {/* Name & Subtitles */}
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {podium1.name}
          </h3>
          <p className="text-base font-bold text-amber-700 dark:text-amber-400 mt-0.5">
            {podium1.khmerName}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
            {podium1.department}
          </p>

          {/* Grandmaster Leader Tag */}
          <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[14px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200/80">
            {c.grandmasterTag}
          </span>

          {/* Champion Score Box */}
          <div className="w-full bg-amber-100/60 dark:bg-amber-900/30 border border-amber-200/80 dark:border-amber-700/50 py-3 px-4 rounded-xl flex items-center justify-between mt-4">
            <span className="text-[14px] font-bold tracking-wider text-amber-900 dark:text-amber-300 uppercase">
              {c.championScore}
            </span>
            <span className="text-base font-black text-amber-900 dark:text-amber-100">
              {Number(podium1.points).toLocaleString()}{" "}
              <span className="text-amber-600 dark:text-amber-400 font-extrabold text-base">
                XP
              </span>
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-3 text-base font-semibold text-amber-900 dark:text-amber-200 mt-3.5">
            <span className="inline-flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <Bookmark
                size={13}
                className="text-amber-600 fill-amber-600/30"
              />
              <span>
                {podium1.badges} {c.badgesLabel}
              </span>
            </span>
            <span className="text-amber-300 dark:text-amber-700">•</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Heart size={13} className="text-emerald-600" />
              <span>
                {podium1.returned} {c.returnedLabel}
              </span>
            </span>
          </div>

          {/* Action Buttons: Honors (Blue) & + Award Badge (Gold) */}
          <div className="w-full flex items-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => onViewHonors?.(podium1)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-all duration-200 shadow-sm cursor-pointer active:scale-[0.98]"
            >
              {c.honors}
            </button>
            <button
              type="button"
              onClick={() => onAwardBadge?.(podium1)}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-base font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
            >
              {c.awardBadge}
            </button>
          </div>
        </div>

        {/* CARD 3: #3 Bronze */}
        <div className="bg-white dark:bg-zinc-900/95 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative">
          {/* Rank Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-semibold bg-amber-100/70 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/80 dark:border-amber-800/40">
            <Shield size={13} className="text-amber-600" />
            <span>{c.bronzeRank}</span>
          </span>

          {/* Avatar with Lv Badge */}
          <div className="relative mt-5 mb-3">
            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-inner bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
              {podium3.avatar ? (
                <img
                  src={podium3.avatar}
                  alt={podium3.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = photoKhemSomnang;
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center font-bold text-5xl text-slate-600">
                  {podium3.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 bg-zinc-900/90 dark:bg-zinc-800 text-white text-[14px] font-bold px-2 py-0.5 rounded-md shadow-xs border border-zinc-700/50">
              Lv.{podium3.level}
            </span>
          </div>

          {/* Name & Subtitles */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {podium3.name}
          </h3>
          <p className="text-base font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
            {podium3.khmerName}
          </p>
          <p className="text-base text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
            {podium3.department}
          </p>

          {/* Score Box */}
          <div className="w-full bg-slate-50/80 dark:bg-zinc-800/60 py-2.5 px-4 rounded-xl flex items-center justify-between mt-4">
            <span className="text-base text-slate-400 dark:text-slate-500 font-medium">
              {c.score}
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {Number(podium3.points).toLocaleString()}{" "}
              <span className="text-amber-500 font-extrabold text-base">
                XP
              </span>
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-3 text-base font-medium text-slate-600 dark:text-slate-300 mt-3.5">
            <span className="inline-flex items-center gap-1.5">
              <Bookmark size={13} className="text-amber-600" />
              <span>
                {podium3.badges} {c.badgesLabel}
              </span>
            </span>
            <span className="text-slate-300 dark:text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Package size={13} className="text-emerald-600" />
              <span>
                {podium3.returned} {c.returnedLabel}
              </span>
            </span>
          </div>

          {/* View Honors Button */}
          <button
            type="button"
            onClick={() => onViewHonors?.(podium3)}
            className="w-full mt-4 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-200 text-base font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]"
          >
            {c.viewHonors}
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* User Avatar                                                            */
/* ---------------------------------------------------------------------- */

function UserAvatar({ t, name }) {
  return (
    <span
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
      style={{
        backgroundColor: t.primaryLight,
        color: t.primary,
      }}
      aria-hidden="true"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Category Badge                                                         */
/* ---------------------------------------------------------------------- */

function CategoryBadge({ t, c, category }) {
  const style = categoryStyle(t, category);

  return (
    <span
      className="whitespace-nowrap rounded-md px-2 py-1 text-base font-medium"
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {c.categories[category] || category}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Leaderboard Controls                                                    */
/* ---------------------------------------------------------------------- */

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
      className="flex flex-col gap-4 border-b px-3 py-4 lg:flex-row lg:items-center lg:justify-between"
      style={{
        borderColor: t.border,
        fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK,
      }}
    >
      {/* Period tabs */}
      <div className="flex flex-wrap gap-2">
        {c.tabs.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="rounded-lg px-3 py-2 text-base font-medium transition-colors"
              style={
                isActive
                  ? {
                      backgroundColor: "var(--color-brand-primary)",
                      color: "#fff",
                    }
                  : {
                      backgroundColor: "transparent",
                      color: t.muted,
                    }
              }
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search and category */}
      <div className="flex flex-col gap-3 sm:flex-row">
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
            onChange={(event) => setSearch(event.target.value)}
            placeholder={c.searchPlaceholder}
            className="search-input w-full rounded-lg border py-2 pl-9 pr-3 text-base outline-none sm:w-60"
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
          onChange={(event) => setCategory(event.target.value)}
          className="search-input rounded-lg border px-3 py-2 text-base outline-none"
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

/* ---------------------------------------------------------------------- */
/* Leaderboard Table                                                      */
/* ---------------------------------------------------------------------- */

function LeaderboardTable({ t, c, lang, rows }) {
  return (
    <div
      className="overflow-x-auto"
      style={{
        fontFamily: lang === "km" ? KHMER_FONT_STACK : FONT_STACK,
      }}
    >
      <table className="w-full min-w-[720px] border-collapse text-base">
        <thead>
          <tr
            className="text-left text-base"
            style={{
              color: t.mutedLight,
              backgroundColor: t.surfaceAlt,
            }}
          >
            <th className="px-5 py-3 font-medium">{c.tableHeaders.rank}</th>

            <th className="px-5 py-3 font-medium">{c.tableHeaders.user}</th>

            <th className="px-5 py-3 text-right font-medium">
              {c.tableHeaders.upvotes}
            </th>

            <th className="px-5 py-3 text-right font-medium">
              {c.tableHeaders.answers}
            </th>

            <th className="px-5 py-3 text-right font-medium">
              {c.tableHeaders.solutions}
            </th>

            <th className="px-5 py-3 text-right font-medium">
              {c.tableHeaders.helpful}
            </th>

            <th className="px-5 py-3 font-medium">{c.tableHeaders.category}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="tr-hover border-t transition-colors"
              style={{
                borderColor: t.rowBorder,
              }}
            >
              <td
                className="px-5 py-3 font-semibold"
                style={{ color: t.heading }}
              >
                {row.rank}
              </td>

              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <UserAvatar t={t} name={row.name} />

                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className="font-medium" style={{ color: t.heading }}>
                      {row.name}
                    </p>

                    <p className="text-base" style={{ color: t.mutedLight }}>
                      {row.handle}
                    </p>
                  </div>
                </div>
              </td>

              {METRICS.map((metric) => (
                <td key={metric.key} className="px-5 py-3 text-right">
                  <MetricValue metric={metric} value={row[metric.key]} />
                </td>
              ))}

              <td className="px-5 py-3">
                <CategoryBadge t={t} c={c} category={row.category} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <p
          className="py-12 text-center text-base"
          style={{ color: t.mutedLight }}
        >
          {c.noResults}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Leaderboard Page                                                        */
/* ---------------------------------------------------------------------- */

export default function LeaderBoardComponent({
  dark: darkProp,
  lang: langProp,
} = {}) {
  /*
   * Props come from LeaderboardPage:
   *
   * dark={resolvedTheme === "dark"}
   * lang={language}
   *
   * The fallback values allow this component to work
   * independently during development or preview.
   */

  const dark = darkProp ?? false;

  const lang = normalizeLang(langProp ?? "en");

  const [period, setPeriod] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const periodKeys = ["all", "month", "week"];

  const query = useGetLeaderboardQuery(periodKeys[period], {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const t = THEME;
  const c = COPY[lang];

  const activeTab = c.tabs[period];

  const setActiveTab = (label) => {
    const nextPeriod = c.tabs.indexOf(label);

    if (nextPeriod !== -1) {
      setPeriod(nextPeriod);
    }
  };

  const fallbackMembers = [
    {
      id: 1,
      rank: 1,
      name: "Kay Keo",
      handle: "@kaykeo",
      upvotes: 2450,
      points: 2450,
      answers: 24,
      solutions: 48,
      helpful: 8,
      category: "Web Development",
    },
    {
      id: 2,
      rank: 2,
      name: "Dr. Chea Sovann",
      handle: "@cheasovann",
      upvotes: 1890,
      points: 1890,
      answers: 18,
      solutions: 36,
      helpful: 14,
      category: "Data Science",
    },
    {
      id: 3,
      rank: 3,
      name: "Khem Somnang",
      handle: "@khemsomnang",
      upvotes: 1650,
      points: 1650,
      answers: 12,
      solutions: 28,
      helpful: 92,
      category: "React",
    },
    {
      id: 4,
      rank: 4,
      name: "Sokha Chan",
      handle: "@sokhachan",
      upvotes: 1420,
      points: 1420,
      answers: 15,
      solutions: 22,
      helpful: 31,
      category: "JavaScript",
    },
    {
      id: 5,
      rank: 5,
      name: "Dara Poeun",
      handle: "@darapoeun",
      upvotes: 1180,
      points: 1180,
      answers: 9,
      solutions: 19,
      helpful: 26,
      category: "Bug Report",
    },
    {
      id: 6,
      rank: 6,
      name: "Vanna Ly",
      handle: "@vannaly",
      upvotes: 950,
      points: 950,
      answers: 7,
      solutions: 14,
      helpful: 18,
      category: "React",
    },
    {
      id: 7,
      rank: 7,
      name: "Chenda Sok",
      handle: "@chendasok",
      upvotes: 820,
      points: 820,
      answers: 6,
      solutions: 11,
      helpful: 15,
      category: "Web Development",
    },
  ];

  const users =
    query.data && query.data.length > 0
      ? query.data
      : query.isError ||
          (!query.isLoading && (!query.data || query.data.length === 0))
        ? fallbackMembers
        : [];

  const categories = Array.from(
    new Set(users.map((user) => user.category).filter(Boolean)),
  );

  const champions = users.slice(0, 3);

  const filteredRows = users.filter((user) => {
    const searchQuery = search.trim().toLowerCase();

    const localizedCategory =
      c.categories[user.category] || user.category || "";

    const matchesSearch =
      !searchQuery ||
      user.name?.toLowerCase().includes(searchQuery) ||
      user.handle?.toLowerCase().includes(searchQuery) ||
      localizedCategory.toLowerCase().includes(searchQuery);

    const matchesCategory =
      category === "All Categories" || user.category === category;

    return matchesSearch && matchesCategory;
  });

  const [selectedHonor, setSelectedHonor] = useState(null);
  const [awardModalUser, setAwardModalUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState("star");
  const [awardNote, setAwardNote] = useState("");
  const [awardSuccess, setAwardSuccess] = useState(false);

  const availableBadges = [
    {
      id: "star",
      name: "Star Contributor",
      desc: "Inspiring community leadership & discussions",
      icon: Star,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200",
    },
    {
      id: "mentor",
      name: "Helpful Mentor",
      desc: "Guiding peers & resolving tough questions",
      icon: Heart,
      color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200",
    },
    {
      id: "pioneer",
      name: "Innovation Pioneer",
      desc: "High-impact solutions & creative technical posts",
      icon: Zap,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200",
    },
    {
      id: "shield",
      name: "Campus Shield",
      desc: "Outstanding support & community safety champion",
      icon: Shield,
      color:
        "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200",
    },
  ];

  const handleSendAward = (e) => {
    e.preventDefault();
    setAwardSuccess(true);
    setTimeout(() => {
      setAwardSuccess(false);
      const recipientName = awardModalUser?.name || "the champion";
      setAwardModalUser(null);
      setAwardNote("");
      setToastMessage(`Badge successfully awarded to ${recipientName}!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
  };

  return (
    <div
      className="leaderboard-page shared-page relative min-h-screen transition-colors duration-300"
      style={{
        fontFamily: FONT_STACK,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');

        .leaderboard-page .tr-hover:hover {
          background-color: ${t.rowHover};
        }

        .leaderboard-page .search-input::placeholder {
          color: ${t.mutedLight};
        }

        .leaderboard-page .search-input:focus {
          box-shadow: 0 0 0 3px ${t.primaryLight};
          border-color: ${t.primary};
        }

        .leaderboard-page ::selection {
          background-color: ${t.primaryLight};
        }
      `}</style>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-base font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Modal: View Honors */}
      {selectedHonor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedHonor(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedHonor(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-md ring-4 ring-amber-300 dark:ring-amber-500/60 mb-4 bg-slate-100 dark:bg-zinc-800">
              {selectedHonor.avatar ? (
                <img
                  src={selectedHonor.avatar}
                  alt={selectedHonor.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = photoKayKeo;
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="w-full h-full flex items-center justify-center font-bold text-5xl text-slate-600">
                  {selectedHonor.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-base font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 mb-2">
              <Trophy size={13} className="text-amber-600" />
              <span>
                Rank #{selectedHonor.rank} • Lv.{selectedHonor.level}
              </span>
            </div>

            <h3 className="text-5xl font-black text-slate-900 dark:text-white">
              {selectedHonor.name}
            </h3>
            {selectedHonor.khmerName && (
              <p className="text-base font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                {selectedHonor.khmerName}
              </p>
            )}
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1">
              {selectedHonor.department}
            </p>

            {/* Honors & Accolades */}
            <div className="mt-6 text-left space-y-3">
              <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {lang === "km"
                  ? "សមិទ្ធផល & ផ្លាកសញ្ញាកិត្តិយស"
                  : "Honors & Community Accolades"}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center flex-shrink-0">
                    <Bookmark size={17} />
                  </div>
                  <div>
                    <strong className="block text-base text-slate-900 dark:text-white font-bold">
                      {selectedHonor.badges} Badges
                    </strong>
                    <span className="text-[14px] text-slate-500">
                      Earned honors
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Package size={17} />
                  </div>
                  <div>
                    <strong className="block text-base text-slate-900 dark:text-white font-bold">
                      {selectedHonor.returned} Returned
                    </strong>
                    <span className="text-[14px] text-slate-500">
                      Lost & found recoveries
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Zap size={17} />
                  </div>
                  <div>
                    <strong className="block text-base text-slate-900 dark:text-white font-bold">
                      {Number(selectedHonor.points).toLocaleString()} XP
                    </strong>
                    <span className="text-[14px] text-slate-500">
                      Community Score
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <strong className="block text-base text-slate-900 dark:text-white font-bold">
                      {selectedHonor.tag || "Grandmaster"}
                    </strong>
                    <span className="text-[14px] text-slate-500">
                      Campus Status
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedHonor(null)}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base transition-all duration-200 cursor-pointer shadow-md hover:opacity-90 active:scale-[0.98]"
            >
              {lang === "km" ? "បិទ" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Modal: Award Badge */}
      {awardModalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => !awardSuccess && setAwardModalUser(null)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-200 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setAwardModalUser(null)}
              disabled={awardSuccess}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-amber-400 flex-shrink-0 bg-amber-100">
                {awardModalUser.avatar ? (
                  <img
                    src={awardModalUser.avatar}
                    alt={awardModalUser.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = photoKayKeo;
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex items-center justify-center font-bold text-lg text-amber-900">
                    {awardModalUser.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[14px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {lang === "km" ? "ប្រគល់ផ្លាកសញ្ញាជូន" : "Awarding Badge To"}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {awardModalUser.name}
                </h3>
              </div>
            </div>

            {awardSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
                  <Check size={32} />
                </div>
                <h4 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {lang === "km"
                    ? "ផ្លាកសញ្ញាត្រូវបានប្រគល់ជោគជ័យ!"
                    : "Badge Awarded Successfully!"}
                </h4>
                <p className="text-base text-slate-500">
                  {lang === "km"
                    ? "សូមអរគុណសម្រាប់ការលើកទឹកចិត្តដល់សមាជិកឆ្នើម។"
                    : "Thank you for recognizing top campus excellence."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendAward} className="space-y-4">
                <label className="block text-base font-bold text-slate-600 dark:text-slate-300">
                  {lang === "km"
                    ? "ជ្រើសរើសផ្លាកសញ្ញា:"
                    : "Select Recognition Badge:"}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableBadges.map((badge) => {
                    const Icon = badge.icon;
                    const isSel = selectedBadge === badge.id;
                    return (
                      <button
                        key={badge.id}
                        type="button"
                        onClick={() => setSelectedBadge(badge.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSel
                            ? "border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-400/40"
                            : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 hover:bg-slate-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl border flex-shrink-0 ${badge.color}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <strong className="block text-base font-bold text-slate-900 dark:text-white truncate">
                            {badge.name}
                          </strong>
                          <span className="text-[10px] text-slate-500 line-clamp-2 leading-tight mt-0.5">
                            {badge.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-600 dark:text-slate-300 mb-1">
                    {lang === "km"
                      ? "សារលើកទឹកចិត្ត (ស្រេចចិត្ត):"
                      : "Encouragement Note (Optional):"}
                  </label>
                  <textarea
                    rows={2}
                    value={awardNote}
                    onChange={(e) => setAwardNote(e.target.value)}
                    placeholder={
                      lang === "km"
                        ? "សរសេរសារកោតសរសើរ..."
                        : "e.g. Thanks for your outstanding help with mentoring!"
                    }
                    className="w-full text-base p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAwardModalUser(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-slate-300 text-base font-semibold cursor-pointer"
                  >
                    {lang === "km" ? "បោះបង់" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-base font-bold shadow-md cursor-pointer transition-all active:scale-[0.98]"
                  >
                    {lang === "km" ? "ប្រគល់ផ្លាកសញ្ញា" : "Confirm Award"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pt-8 lg:flex-row lg:justify-between sm:px-6">
          <ForumHeader t={t} c={c} lang={lang} />

          <div className="sm:pt-1">
            <PointsLegend t={t} c={c} />
          </div>
        </div>

        {/* Ranking information */}
        <div
          className="mx-auto max-w-7xl px-4 pt-6 sm:px-6"
          style={{ color: t.muted }}
        >
          <p className="text-base">
            {lang === "km"
              ? "ពិន្ទុសរុបនៃការបង្ហោះ និងមតិយោបល់ដែលបានផ្ទុក។ តម្រងពេលវេលាយោងតាមថ្ងៃបង្កើតមាតិកា។"
              : "Ranked by total post and comment scores in loaded posts. Time filters use content creation dates, not vote dates. Equal scores share a rank."}
          </p>

          <button
            type="button"
            className="mt-3 text-base underline"
            disabled={query.isFetching}
            onClick={query.refetch}
          >
            {query.isFetching
              ? lang === "km"
                ? "កំពុងផ្ទុក…"
                : "Loading…"
              : lang === "km"
                ? "ផ្ទុកឡើងវិញ"
                : "Refresh rankings"}
          </button>

          {query.isError && (
            <p role="alert" className="mt-3">
              {lang === "km"
                ? "មិនអាចផ្ទុកតារាងបានទេ។ សូមព្យាយាមម្តងទៀត។"
                : "Could not load rankings. Please try refreshing."}
            </p>
          )}
        </div>

        {/* Loading / Champions Podium */}
        {query.isFetching && !query.currentData ? (
          <LoadingSpinner
            fullScreen={false}
            title={lang === "km" ? "កំពុងផ្ទុកតារាង" : "Loading leaderboard"}
          />
        ) : (
          <ChampionsSection
            t={t}
            c={c}
            lang={lang}
            champions={champions}
            onViewHonors={setSelectedHonor}
            onAwardBadge={setAwardModalUser}
          />
        )}

        {/* Leaderboard */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div
            className="overflow-hidden rounded-xl border"
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

            {!query.isError && !(query.isFetching && !query.currentData) && (
              <LeaderboardTable t={t} c={c} lang={lang} rows={filteredRows} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
