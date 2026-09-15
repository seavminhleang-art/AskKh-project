import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  HelpCircle,
} from "lucide-react";
import { sampleClaims } from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function MyClaimsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("ALL");
  const [claims, setClaims] = useState(sampleClaims);

  const filteredClaims = claims.filter((claim) => {
    if (filter === "PENDING") return claim.status === "Pending";
    if (filter === "APPROVED") return claim.status === "Approved";
    if (filter === "COMPLETED") return claim.status === "Completed";
    return true;
  });

  const handleCancelClaim = (id) => {
    setClaims((prev) => prev.filter((c) => c.id !== id));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-lg font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16803C]" />
            {t("claims.approved", "Approved")}
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-lg font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#102A56]" />
            {t("claims.completed", "Completed")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-lg font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t("claims.pending", "Pending Review")}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t("claims.title", "My Claims")}
          </h1>
          <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t(
              "claims.description",
              "Track and manage your verified ownership claims for found property.",
            )}
          </p>
        </div>

        <Link
          to="/lost-found"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
        >
          <span>{t("navigation.lostFound", "Find Lost Items")}</span>
        </Link>
      </header>

      {/* Summary Stats */}
      <section aria-label="Claims Summary" className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-amber-600 dark:text-amber-400">
            {t("claims.pending", "Pending Claims")}
          </div>
          <div className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            1
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Awaiting staff check
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-emerald-600 dark:text-emerald-400">
            {t("claims.approved", "Approved")}
          </div>
          <div className="text-3xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">
            1
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Ready for pickup
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 sm:p-4 shadow-2xs">
          <div className="text-[16px] font-medium text-blue-600 dark:text-blue-400">
            {t("claims.completed", "Completed")}
          </div>
          <div className="text-3xl sm:text-3xl font-bold text-[#102A56] dark:text-blue-300 mt-1">
            1
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Successfully collected
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <nav
        aria-label="Claim Filter Tabs"
        className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none"
      >
        {[
          { id: "ALL", label: t("common.all", "All Claims") },
          { id: "PENDING", label: t("claims.pending", "Pending Review") },
          {
            id: "APPROVED",
            label: t("claims.approved", "Approved for Pickup"),
          },
          { id: "COMPLETED", label: t("claims.completed", "Completed") },
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

      {/* Claims List */}
      <main className="space-y-4">
        {filteredClaims.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-10 text-center space-y-2">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t("claims.noClaims", "No claims match this status")}
            </h3>
            <p className="text-lg text-slate-500">
              {t(
                "common.noData",
                'If you found your item in Lost & Found, click "Claim This Item" to begin verification.',
              )}
            </p>
          </div>
        ) : (
          filteredClaims.map((claim) => (
            <article
              key={claim.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4"
            >
              {/* Claim Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-mono font-bold text-slate-500 uppercase">
                    {claim.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {claim.itemTitle}
                  </h3>
                </div>
                <div>{getStatusBadge(claim.status)}</div>
              </div>

              {/* Claim Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-lg">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {t("claims.claimDate", "Claim Date")}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {claim.claimDate}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {t("common.author", "Handling Authority / Owner")}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {claim.owner}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {t("claims.status", "Last Status Update")}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {claim.lastUpdated}
                  </span>
                </div>
              </div>

              {/* Submitted Proof Description */}
              <div className="p-3.5 rounded-lg bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-lg">
                <span className="text-[16px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {t("lostFound.hiddenDetails", "Submitted Verification Proof")}
                  :
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {claim.proofDescription}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  to={`/lost-found/${claim.itemId}`}
                  className="inline-flex items-center gap-1 text-lg font-semibold text-[#102A56] dark:text-blue-400 hover:underline"
                >
                  <span>{t("claims.viewItem", "View Original Post")}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  {claim.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancelClaim(claim.id)}
                      className="px-3 py-1.5 text-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      {t("claims.cancelClaim", "Withdraw Claim")}
                    </button>
                  )}
                  {claim.status === "Approved" && (
                    <span className="text-lg font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" />
                      Pickup location: ISTAD Security Desk, Floor 1
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {/* Bottom Guideline */}
      <aside
        aria-label="Claim Collection Guidelines"
        className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 dark:border-blue-900/40 flex items-start gap-3"
      >
        <ShieldCheck className="w-5 h-5 text-[#102A56] dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-lg font-bold text-[#102A56] dark:text-blue-300">
            Physical Collection Procedure
          </h4>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 leading-relaxed">
            When your claim status turns to{" "}
            <strong className="text-emerald-700 dark:text-emerald-400">
              Approved
            </strong>
            , please present your student or national ID to the holding office
            or desk noted above within 7 days.
          </p>
        </div>
      </aside>
    </div>
  );
}
