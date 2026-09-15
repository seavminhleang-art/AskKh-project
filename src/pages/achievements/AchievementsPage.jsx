import React, { useState } from "react";
import {
  Award,
  Sparkles,
  CheckCircle2,
  Lock,
  TrendingUp,
  HelpCircle,
  PackageCheck,
  ThumbsUp,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  sampleAchievements,
  sampleAchievementsSummary,
} from "../../data/achievementData";
import { useLanguage } from "../../context/LanguageContext";

export default function AchievementsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("ALL");

  const filteredAchievements = sampleAchievements.filter((ach) => {
    if (filter === "UNLOCKED") return ach.isEarned;
    if (filter === "LOCKED") return !ach.isEarned;
    if (filter === "QA") return ach.category === "Q&A";
    if (filter === "LOST_FOUND") return ach.category === "Lost & Found";
    return true;
  });

  const getTierColor = (tier) => {
    switch (tier) {
      case "Diamond":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800";
      case "Gold":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
      case "Silver":
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      default:
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800";
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "HelpCircle":
        return <HelpCircle className="w-5 h-5" />;
      case "CheckCircle2":
        return <CheckCircle2 className="w-5 h-5" />;
      case "PackageCheck":
        return <PackageCheck className="w-5 h-5" />;
      case "ThumbsUp":
        return <ThumbsUp className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("achievements.title", "Scholar Achievements")}
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-lg font-semibold bg-blue-100 text-[#102A56] dark:bg-blue-950 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5" />
              {sampleAchievementsSummary.level}
            </span>
          </div>
          <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t(
              "achievements.description",
              "Unlock recognitions and earn reputation points by helping peers across campus.",
            )}
          </p>
        </div>
      </header>

      {/* Progress & Milestone Summary Banner */}
      <section
        aria-label="Level Progress"
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-slate-500 uppercase tracking-wider">
              {t("achievements.reputationPoints", "Reputation & Rank")}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#102A56] dark:text-white">
                {sampleAchievementsSummary.points}
              </span>
              <span className="text-lg text-slate-400 font-medium">
                {t("achievements.reputationPoints", "reputation points earned")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-lg text-slate-400">
                {t("achievements.badgesEarned", "Unlocked Badges")}
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {sampleAchievementsSummary.earnedCount} /{" "}
                {sampleAchievementsSummary.totalCount}
              </div>
            </div>
            <div>
              <div className="text-lg text-slate-400">
                {t("achievements.tier", "Next Rank")}
              </div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                +{sampleAchievementsSummary.pointsToNextLevel} pts
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-lg text-slate-500 font-medium">
            <span>
              {t(
                "achievements.progress",
                "Progress to Level 4 Master Contributor",
              )}
            </span>
            <span>{sampleAchievementsSummary.progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#102A56] dark:bg-blue-500 rounded-full transition-all duration-500"
              style={{
                width: `${sampleAchievementsSummary.progressPercentage}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <nav
        aria-label="Achievement Filter Tabs"
        className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none"
      >
        {[
          { id: "ALL", label: t("achievements.all", "All Badges") },
          {
            id: "UNLOCKED",
            label: `${t("achievements.earned", "Unlocked")} (${sampleAchievementsSummary.earnedCount})`,
          },
          { id: "LOCKED", label: t("achievements.locked", "Locked") },
          { id: "QA", label: t("navigation.qa", "Q&A Community") },
          {
            id: "LOST_FOUND",
            label: t("navigation.lostFound", "Lost & Found"),
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filter === tab.id
                ? "bg-[#102A56] text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Achievements Cards Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((ach) => (
          <article
            key={ach.id}
            className={`rounded-xl border p-4.5 transition-all shadow-2xs flex flex-col justify-between ${
              ach.isEarned
                ? "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
                : "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80"
            }`}
          >
            <div className="space-y-3">
              {/* Badge Top Info */}
              <div className="flex items-start justify-between gap-2">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                    ach.isEarned
                      ? "bg-blue-50 text-[#102A56] dark:bg-blue-950 dark:text-blue-300 border-blue-200/60 dark:border-blue-900"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {getIcon(ach.iconName)}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getTierColor(
                      ach.tier,
                    )}`}
                  >
                    {ach.tier}
                  </span>
                  {ach.isEarned ? (
                    <span className="p-1 rounded-full bg-emerald-100 text-[#16803C] dark:bg-emerald-950 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1 rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title and Description */}
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {ach.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {ach.name}
                </h3>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            </div>

            {/* Bottom Status / Progress */}
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[16px]">
              {ach.isEarned ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {t("achievements.earned", "Unlocked")} {ach.earnedDate}
                </span>
              ) : (
                <span className="text-slate-400 font-medium">
                  {t("achievements.progress", "Progress")}: {ach.progress}
                </span>
              )}
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {ach.isEarned ? "+50 pts" : "+100 pts"}
              </span>
            </div>
          </article>
        ))}
      </main>

      {/* Guidelines Footer */}
      <aside
        aria-label="Reputation Guide"
        className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 flex items-start gap-3"
      >
        <Zap className="w-5 h-5 text-[#102A56] dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-lg font-bold text-[#102A56] dark:text-blue-300">
            How Reputation Points Are Calculated
          </h4>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Reputation is granted when your answers are marked as accepted
            solutions (+15 pts), when community members upvote your helpful
            questions (+10 pts), or when reported lost property is confirmed
            returned to its owner (+25 pts).
          </p>
        </div>
      </aside>
    </div>
  );
}
