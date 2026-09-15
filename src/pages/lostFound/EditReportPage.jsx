import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  Upload,
  CheckCircle2,
} from "lucide-react";
import {
  lostFoundCategories,
  campusLocations,
  sampleLostFoundItems,
} from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function EditReportPage() {
  const { t } = useLanguage();
  const { itemId } = useParams();
  const navigate = useNavigate();

  // Find target item from sample data or fallback
  const existingItem =
    sampleLostFoundItems.find((i) => i.id === itemId) ||
    sampleLostFoundItems[0];

  const [itemType, setItemType] = useState(existingItem.type || "LOST");
  const [title, setTitle] = useState(existingItem.title || "");
  const [category, setCategory] = useState(
    existingItem.category || "Electronics",
  );
  const [location, setLocation] = useState(
    existingItem.location || campusLocations[1],
  );
  const [date, setDate] = useState("2026-09-08");
  const [status, setStatus] = useState(existingItem.status || "ACTIVE");
  const [description, setDescription] = useState(
    existingItem.description || "",
  );
  const [hiddenDetails, setHiddenDetails] = useState(
    existingItem.hiddenDetails || "",
  );

  const handleSave = (e) => {
    e.preventDefault();
    // Static UI only per instructions; redirect back to item detail
    navigate(`/lost-found/${existingItem.id}`);
  };

  const handleCancel = () => {
    navigate(`/lost-found/${existingItem.id}`);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <header className="space-y-0.5 pb-1">
        <Link
          to={`/lost-found/${existingItem.id}`}
          className="inline-flex items-center gap-1 text-lg text-slate-500 hover:text-blue-600 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t("lostFound.itemDetails", "Back to Item Details")}</span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("lostFound.editReport", "Edit Report")} #{existingItem.id}
            </h1>
            <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400">
              {t(
                "lostFound.editReportDesc",
                "Update details or mark item status when resolved.",
              )}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 text-lg font-semibold rounded-full ${
              itemType === "LOST"
                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            }`}
          >
            {itemType === "LOST"
              ? t("lostFound.lost", "LOST ITEM")
              : t("lostFound.found", "FOUND ITEM")}
          </span>
        </div>
      </header>

      {/* Form Card */}
      <main className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
        {/* Status selection */}
        <section className="space-y-1.5 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60">
          <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#16803C]" />
            {t("lostFound.status", "Item Status")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: "ACTIVE",
                label: t("lostFound.active", "Active"),
                desc: "Still missing / uncollected",
              },
              {
                id: "CLAIM_PENDING",
                label: t("claims.pending", "Claim Pending"),
                desc: "Ownership verification underway",
              },
              {
                id: "RESOLVED",
                label: t("lostFound.resolved", "Resolved / Returned"),
                desc: "Safely returned to owner",
              },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  status === s.id
                    ? "bg-blue-50 border-blue-400 dark:bg-blue-950 dark:border-blue-700 text-blue-900 dark:text-blue-200 shadow-2xs"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                }`}
              >
                <div className="text-lg font-semibold">{s.label}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        </section>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t("lostFound.itemTitle", "Item Title / Name")} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ThinkPad T14 Laptop"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {t("lostFound.category", "Category")} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                {lostFoundCategories
                  .filter((c) => c !== "All Categories")
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {t("lostFound.date", "Date Reported")} *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {t("lostFound.location", "Campus Location")} *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              {campusLocations
                .filter((l) => l !== "All Locations")
                .map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t("common.description", "Public Description")} *
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, size, brand, and where you saw it last..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
            />
          </div>

          {/* Private / Verification Proof Details */}
          <div className="space-y-1.5 p-3.5 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl">
            <label className="text-lg font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              {t(
                "lostFound.hiddenDetails",
                "Hidden Verification Details (Optional / Confidential)",
              )}
            </label>
            <p className="text-[16px] text-amber-800/80 dark:text-amber-400">
              {t(
                "lostFound.reportItemDesc",
                "Only visible to campus moderators and verified claimants. E.g., serial number, specific wallpapers, or hidden marks.",
              )}
            </p>
            <input
              type="text"
              value={hiddenDetails}
              onChange={(e) => setHiddenDetails(e.target.value)}
              placeholder="e.g. Serial ending in 4982, cracked bottom clip"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-amber-300/80 dark:border-amber-800/60 rounded-lg text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-lg font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t("common.cancel", "Cancel")}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#102A56] hover:bg-[#102A56]/90 text-white rounded-lg text-lg font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t("settings.saveChanges", "Save Changes")}</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
