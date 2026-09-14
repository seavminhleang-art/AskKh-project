import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  User,
  MapPin,
  Calendar,
  Award,
  HelpCircle,
  MessageSquare,
  PackageCheck,
  Edit3,
  ExternalLink,
  Share2,
  Code2,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  sampleUserProfile,
  sampleAchievements,
} from "../../data/achievementData";
import { sampleQuestions } from "../../data/forumData";
import { sampleLostFoundItems } from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  // Static user profile fallback
  const user = sampleUserProfile;

  // Filter user's questions & lost/found items
  const userQuestions = sampleQuestions.slice(0, 3);
  const userItems = sampleLostFoundItems.filter(
    (i) => i.reporter?.username === user.username || i.id === "lf-1",
  );
  const earnedBadges = sampleAchievements.filter((a) => a.isEarned);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Profile Header Card */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-xs shrink-0"
            />
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-lg font-semibold bg-blue-100 text-[#102A56] dark:bg-blue-950 dark:text-blue-300">
                  {user.role}
                </span>
              </div>
              <p className="text-lg text-slate-500 dark:text-slate-400">
                @{user.username} • {user.department}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-lg text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {t("profile.memberSince", "Joined")} {user.joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t("profile.editProfile", "Edit Profile")}</span>
            </Link>
          </div>
        </div>

        {/* Bio */}
        <p className="text-lg sm:text-base text-slate-600 dark:text-slate-300 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
          {user.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center gap-4 mt-3 pt-2 text-lg text-slate-500">
          <a
            href={user.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:white transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href={user.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>LinkedIn</span>
          </a>
          <a
            href={user.socialLinks.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-emerald-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Portfolio</span>
          </a>
        </div>
      </header>

      {/* Profile Metrics Grid */}
      <section
        aria-label="Activity Metrics"
        className="grid grid-cols-2 sm:grid-cols-5 gap-3"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 text-center shadow-2xs">
          <div className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white">
            {user.stats.questionsAsked}
          </div>
          <div className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t("navigation.qa", "Questions")}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 text-center shadow-2xs">
          <div className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white">
            {user.stats.answersGiven}
          </div>
          <div className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t("qa.answers", "Answers")}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 text-center shadow-2xs">
          <div className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white">
            {user.stats.lostReports}
          </div>
          <div className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t("lostFound.lost", "Lost Items")}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 text-center shadow-2xs">
          <div className="text-lg sm:text-3xl font-bold text-slate-900 dark:text-white">
            {user.stats.foundReports}
          </div>
          <div className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t("lostFound.found", "Found Items")}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 text-center shadow-2xs">
          <div className="text-lg sm:text-3xl font-bold text-[#102A56] dark:text-blue-400">
            {user.stats.reputationPoints}
          </div>
          <div className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">
            {t("achievements.reputationPoints", "Reputation")}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav
        aria-label="Profile Tabs"
        className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none"
      >
        {[
          { id: "OVERVIEW", label: t("profile.overview", "Overview") },
          {
            id: "QUESTIONS",
            label: `${t("navigation.qa", "Questions")} (${userQuestions.length})`,
          },
          {
            id: "LOST_FOUND",
            label: `${t("navigation.lostFound", "Lost & Found")} (${userItems.length})`,
          },
          {
            id: "BADGES",
            label: `${t("achievements.all", "Badges")} (${earnedBadges.length})`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#102A56] text-white"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab Panels */}
      <main className="space-y-4">
        {activeTab === "OVERVIEW" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left 2-cols: Recent activity questions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t("qa.recentQuestions", "Recent Questions Asked")}
                  </h3>
                  <Link
                    to="/forum"
                    className="text-lg text-blue-600 hover:underline"
                  >
                    {t("navigation.qa", "View forum")}
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {userQuestions.map((q) => (
                    <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                      <Link
                        to={`/forum/question/${q.id}`}
                        className="text-lg sm:text-base font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                      >
                        {q.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-[16px] text-slate-400">
                        <span>{q.date}</span>
                        <span>•</span>
                        <span>
                          {q.answerCount} {t("qa.answers", "answers")}
                        </span>
                        <span>•</span>
                        <span>
                          {q.votes} {t("qa.upvotes", "upvotes")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col: Unlocked Badges Mini */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t("achievements.all", "Top Badges")}
                  </h3>
                  <Link
                    to="/achievements"
                    className="text-lg text-blue-600 hover:underline"
                  >
                    {t("achievements.all", "All badges")}
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-[#102A56] dark:text-blue-300 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {badge.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {badge.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "QUESTIONS" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {t("navigation.qa", "Questions by")} {user.name}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {userQuestions.map((q) => (
                <article
                  key={q.id}
                  className="py-3.5 first:pt-0 last:pb-0 space-y-1.5"
                >
                  <Link
                    to={`/forum/question/${q.id}`}
                    className="text-lg sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {q.title}
                  </Link>
                  <p className="text-lg text-slate-500 line-clamp-2">
                    {q.description}
                  </p>
                  <div className="flex items-center gap-3 text-[16px] text-slate-400 pt-1">
                    <span>
                      {t("lostFound.category", "Category")}: {q.category}
                    </span>
                    <span>•</span>
                    <span>
                      {q.answerCount} {t("qa.answers", "answers")}
                    </span>
                    <span>•</span>
                    <span>
                      {q.votes} {t("qa.upvotes", "votes")}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "LOST_FOUND" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userItems.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 rounded-lg object-cover"
                />
                <div className="space-y-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.type === "LOST"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.type === "LOST"
                      ? t("lostFound.lost", "LOST")
                      : t("lostFound.found", "FOUND")}
                  </span>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate mt-1">
                    {item.title}
                  </h4>
                  <p className="text-[16px] text-slate-500 truncate">
                    {item.location}
                  </p>
                </div>
                <Link
                  to={`/lost-found/${item.id}`}
                  className="inline-flex items-center gap-1 text-[16px] font-semibold text-blue-600 hover:underline pt-1"
                >
                  <span>{t("claims.viewItem", "View Details")}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </article>
            ))}
          </div>
        )}

        {activeTab === "BADGES" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleAchievements.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border ${
                  badge.isEarned
                    ? "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800"
                    : "bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#102A56] dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {badge.name}
                    </h4>
                    <p className="text-[16px] text-slate-400">
                      {badge.tier} Tier
                    </p>
                  </div>
                </div>
                <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
