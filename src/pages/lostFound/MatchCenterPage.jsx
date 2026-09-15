import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Clock,
  Layers,
  ExternalLink,
} from "lucide-react";
import { sampleMatches } from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function MatchCenterPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("ALL");
  const [matches, setMatches] = useState(sampleMatches);

  const filteredMatches = matches.filter((m) => {
    if (filter === "PENDING") return m.status === "Pending Review";
    if (filter === "CONFIRMED") return m.status === "Confirmed";
    return true;
  });

  const handleConfirm = (id) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "Confirmed", statusVariant: "success" }
          : m,
      ),
    );
  };

  const handleReject = (id) => {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: "Rejected", statusVariant: "danger" } : m,
      ),
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("matchCenter.title", "Match Center")}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="w-3 h-3 text-[#16803C]" />
              {t("matchCenter.smartMatching", "Smart Matching")}
            </span>
          </div>
          <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t(
              "matchCenter.description",
              "Review smart paired correlations between reported lost and found campus property.",
            )}
          </p>
        </div>

        <Link
          to="/lost-found"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <span>{t("navigation.lostFound", "Browse All Items")}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Metric Cards */}
      <section
        aria-label="Matching Statistics"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-slate-500 dark:text-slate-400">
            {t("matchCenter.possibleMatches", "Total Correlations")}
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            2
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Calculated across campus logs
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-amber-600 dark:text-amber-400">
            {t("matchCenter.pending", "Pending Review")}
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-1">
            1
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Awaiting reporter confirmation
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-emerald-600 dark:text-emerald-400">
            {t("matchCenter.confirmed", "Confirmed Matches")}
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            1
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Ready for safe handover
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-blue-600 dark:text-blue-400">
            {t("matchCenter.confidence", "Average Confidence")}
          </div>
          <div className="text-2xl font-bold text-[#102A56] dark:text-blue-300 mt-1">
            91.5%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Based on category & location
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <nav
        aria-label="Match Filter Tabs"
        className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none"
      >
        {[
          { id: "ALL", label: t("common.all", "All Matches") },
          { id: "PENDING", label: t("matchCenter.pending", "Pending Review") },
          { id: "CONFIRMED", label: t("matchCenter.confirmed", "Confirmed") },
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

      {/* Matches List */}
      <main className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-10 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No matches found in this view
            </h3>
            <p className="text-lg text-slate-500">
              Check back later when new lost or found property is logged.
            </p>
          </div>
        ) : (
          filteredMatches.map((match) => (
            <article
              key={match.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {match.id}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-lg font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-[#16803C] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    {match.confidence}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[16px] font-semibold ${
                      match.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : match.status === "Rejected"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    {match.status}
                  </span>
                </div>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lost Item */}
                <div className="p-3.5 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex gap-3.5">
                  <img
                    src={match.lostItem.image}
                    alt={match.lostItem.title}
                    className="w-20 h-20 rounded-lg object-cover border border-rose-200 dark:border-rose-800 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                      {t("matchCenter.lostItem", "Reported Lost Item")}
                    </span>
                    <h4 className="text-lg sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {match.lostItem.title}
                    </h4>
                    <p className="text-[16px] text-slate-500 dark:text-slate-400">
                      {t("lostFound.category", "Category")}:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {match.lostItem.category}
                      </span>
                    </p>
                    <p className="text-[16px] text-slate-500 dark:text-slate-400">
                      {t("lostFound.location", "Location")}:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {match.lostItem.location}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Found Item */}
                <div className="p-3.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex gap-3.5">
                  <img
                    src={match.foundItem.image}
                    alt={match.foundItem.title}
                    className="w-20 h-20 rounded-lg object-cover border border-emerald-200 dark:border-emerald-800 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {t("matchCenter.foundItem", "Reported Found Item")}
                    </span>
                    <h4 className="text-lg sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {match.foundItem.title}
                    </h4>
                    <p className="text-[16px] text-slate-500 dark:text-slate-400">
                      {t("lostFound.category", "Category")}:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {match.foundItem.category}
                      </span>
                    </p>
                    <p className="text-[16px] text-slate-500 dark:text-slate-400">
                      {t("lostFound.location", "Location")}:{" "}
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {match.foundItem.location}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Match correlation note */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5 text-lg text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#102A56] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {t("matchCenter.matchDetails", "Matching Criteria")}:{" "}
                  </span>
                  {match.details}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  to="/lost-found/lf-2"
                  className="inline-flex items-center gap-1 text-lg font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <span>{t("claims.viewItem", "Inspect Item Details")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                {match.status === "Pending Review" && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(match.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-lg font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-[#C62828]" />
                      <span>
                        {t("matchCenter.rejectMatch", "Reject Match")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleConfirm(match.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-lg font-semibold text-white bg-[#102A56] hover:bg-[#102A56]/90 rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {t("matchCenter.confirmMatch", "Confirm Match")}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </main>

      {/* Informational Guidance Footer */}
      <aside
        aria-label="Security & Verification Policy"
        className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 flex items-start gap-3"
      >
        <ShieldCheck className="w-5 h-5 text-[#102A56] dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-lg font-bold text-[#102A56] dark:text-blue-300">
            How Match Center Works
          </h4>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed">
            The AskKH correlation system matches loss and recovery timestamps,
            physical attributes, categories, and campus locations. To safeguard
            privacy, contact numbers and confidential marks are verified by
            authorized staff prior to handover.
          </p>
        </div>
      </aside>
    </div>
  );
}
