import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Tag,
  ShieldCheck,
  Edit,
  Phone,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  X,
  Send,
} from "lucide-react";
import { sampleLostFoundItems } from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function ItemDetailPage() {
  const { t } = useLanguage();
  const { itemId } = useParams();
  const navigate = useNavigate();
  const item =
    sampleLostFoundItems.find((i) => i.id === itemId) ||
    sampleLostFoundItems[0];

  const [activeImage, setActiveImage] = useState(item.image);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimProof, setClaimProof] = useState("");
  const [claimSubmitted, setClaimSubmitted] = useState(false);

  const isLost = item.type === "LOST";

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    setClaimSubmitted(true);
    setTimeout(() => {
      setClaimModalOpen(false);
      setClaimSubmitted(false);
    }, 1500);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-lg text-slate-500 dark:text-slate-400">
        <Link
          to="/lost-found"
          className="hover:text-blue-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("lostFound.title", "Lost & Found Community")}</span>
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-md">
          {item.title}
        </span>
      </nav>

      {/* 2. Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Image Gallery & Details (8 cols) */}
        <main className="lg:col-span-8 space-y-4">
          <article className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
            {/* Main Featured Image */}
            <div className="relative h-72 sm:h-96 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={activeImage}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-lg font-bold border uppercase tracking-wider ${
                    isLost
                      ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300"
                      : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300"
                  }`}
                >
                  {isLost
                    ? t("lostFound.lost", "LOST")
                    : t("lostFound.found", "FOUND")}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-lg font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-xs shadow-xs">
                  {item.status}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === img
                        ? "border-blue-600 scale-105"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Item Content Information */}
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-lg text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {item.category}
                  </span>
                  <span>•</span>
                  <span>Report ID: #{item.id}</span>
                </div>
                <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                  {item.title}
                </h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 text-lg">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{item.date}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {t("common.description", "Description")}
                </h2>
                <p className="text-lg sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {item.hiddenDetails && (
                <div className="p-3.5 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-lg space-y-1">
                  <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t(
                      "lostFound.hiddenDetails",
                      "Anti-Fraud Verification Enabled",
                    )}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-[16px]">
                    {t(
                      "lostFound.reportItemDesc",
                      "This item has private security markers registered by the reporter to verify authenticity before handover.",
                    )}
                  </p>
                </div>
              )}
            </div>
          </article>
        </main>

        {/* Right Column: Reporter & Action Card (4 cols) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Action Card */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("common.actions", "Actions")}
            </h3>

            {item.type === "FOUND" && (
              <button
                type="button"
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-2.5 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t("lostFound.claimItem", "Claim This Item")}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <Link
                to={`/lost-found/${item.id}/edit`}
                className="flex-1 py-2 rounded-xl text-lg font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-center inline-flex items-center justify-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>{t("lostFound.editReport", "Edit Report")}</span>
              </Link>
            </div>
          </section>

          {/* Reporter Information */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("common.author", "Reported By")}
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={item.reporter.avatar}
                alt={item.reporter.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div className="min-w-0">
                <span className="text-lg font-bold text-slate-900 dark:text-white block truncate">
                  {item.reporter.name}
                </span>
                <span className="text-[16px] text-slate-400 truncate block">
                  {item.reporter.role}
                </span>
              </div>
            </div>

            {item.reporter.phone && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-lg text-slate-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{item.reporter.phone}</span>
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Claim Modal (Static UI) */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t("lostFound.submitClaim", "Submit Claim for Item")}
              </h3>
              <button
                type="button"
                onClick={() => setClaimModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {claimSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {t("claims.approved", "Claim Submitted for Review")}
                </p>
                <p className="text-[16px] text-slate-400">
                  {t(
                    "claims.description",
                    "Campus security and the finder will review your details shortly.",
                  )}
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-3">
                <p className="text-lg text-slate-500 leading-relaxed">
                  {t(
                    "lostFound.hiddenDetails",
                    "To prevent unauthorized claims, please describe identifying details not listed in the public description (e.g. lockscreen pattern, serial digits, internal marks).",
                  )}
                </p>
                <textarea
                  rows={4}
                  required
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
                  placeholder={t(
                    "lostFound.hiddenDetails",
                    "Describe secret identifying proof...",
                  )}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-lg font-semibold text-slate-600 dark:text-slate-400"
                  >
                    {t("common.cancel", "Cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover shadow-2xs"
                  >
                    {t("lostFound.submitClaim", "Submit Claim")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
