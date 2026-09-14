import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  PackagePlus,
  Upload,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { lostFoundCategories, campusLocations } from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function ReportItemPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") === "FOUND" ? "FOUND" : "LOST";

  const [itemType, setItemType] = useState(initialType);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [location, setLocation] = useState(campusLocations[1]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [hiddenDetails, setHiddenDetails] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static UI only per instructions; redirect to lost-found home
    navigate("/lost-found");
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-0.5 pb-1">
        <Link
          to="/lost-found"
          className="inline-flex items-center gap-1 text-lg text-slate-500 hover:text-blue-600 mb-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {t("lostFound.backToLostFound", "Back to Lost & Found Community")}
          </span>
        </Link>
        <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {t("lostFound.reportItem", "Report a Campus Item")}
        </h1>
        <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400">
          {t(
            "lostFound.reportItemDesc",
            "Provide accurate details to assist matching and safe recovery.",
          )}
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
        {/* Report Type Selector (LOST vs FOUND) */}
        <div className="space-y-1.5">
          <label className="text-lg font-bold text-slate-900 dark:text-white">
            {t("lostFound.reportType", "Report Type")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setItemType("LOST")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                itemType === "LOST"
                  ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300 shadow-2xs"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg font-bold block">
                {t("lostFound.reportLost", "I Lost an Item")}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {t("lostFound.lost", "Looking for missing property")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setItemType("FOUND")}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                itemType === "FOUND"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-300 shadow-2xs"
                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-lg font-bold block">
                {t("lostFound.reportFound", "I Found an Item")}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {t("lostFound.found", "Recovered campus property")}
              </span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
              placeholder="e.g. Black Lenovo ThinkPad Laptop & Charger"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-lg font-bold text-slate-900 dark:text-white">
                {t("lostFound.category", "Category")} *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
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
              <label className="text-lg font-bold text-slate-900 dark:text-white">
                {t("lostFound.date", "Date")}{" "}
                {itemType === "LOST"
                  ? t("lostFound.lost", "Lost")
                  : t("lostFound.found", "Found")}{" "}
                *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t("lostFound.location", "Campus Location")} *
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors"
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
              placeholder="Color, brand, distinguishing marks, stickers, where exactly it was seen..."
              className="w-full p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Hidden Verification Details (for anti-fraud) */}
          <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700">
            <label className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {t(
                  "lostFound.hiddenDetails",
                  "Hidden Verification Detail (Private)",
                )}
              </span>
            </label>
            <p className="text-[16px] text-slate-400">
              {t(
                "lostFound.reportItemDesc",
                "Only visible to you and campus moderators to verify legitimate claims (e.g. serial number, lockscreen wallpaper, internal pocket items).",
              )}
            </p>
            <input
              type="text"
              value={hiddenDetails}
              onChange={(e) => setHiddenDetails(e.target.value)}
              placeholder="e.g. Serial ending in 4982, blue keychain inside"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 mt-1"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              {t(
                "lostFound.contactInfo",
                "Contact Information / Telegram Username",
              )}
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. @vichekasan or +855 12 345 678"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Image Upload Mock Area */}
          <div className="space-y-1.5">
            <label className="text-lg font-bold text-slate-900 dark:text-white">
              Photos (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center space-y-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Click or drag images to upload
              </p>
              <p className="text-[16px] text-slate-400">
                PNG, JPG or WEBP up to 5MB
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              to="/lost-found"
              className="px-4 py-2 rounded-xl text-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {t("common.cancel", "Cancel")}
            </Link>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs cursor-pointer"
            >
              {t("lostFound.submitClaim", "Submit Report")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
