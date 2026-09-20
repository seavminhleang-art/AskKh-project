import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  PlusCircle,
  Tag,
  Building2,
  X,
  CheckCircle2,
} from "lucide-react";
import {
  useGetReportsQuery,
  useGetCategoriesQuery,
  useGetLocationsQuery,
  useCreateClaimMutation,
} from "../../../../features/lostFound/lostFoundApi";

export default function ItemFeedView({ onOpenReport, darkMode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("All Items"); // 'All Items' | 'Lost Items' | 'Found Items'
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Newest");

  // Claim modal state
  const [claimModalItem, setClaimModalItem] = useState(null);
  const [claimProof, setClaimProof] = useState("");
  const [createClaim, { isLoading: isClaiming }] = useCreateClaimMutation();

  // API Queries
  const itemTypeParam =
    activeTab === "Lost Items"
      ? "LOST"
      : activeTab === "Found Items"
        ? "FOUND"
        : undefined;
  const {
    data: apiReports = [],
    isLoading,
    isError,
    refetch,
  } = useGetReportsQuery(itemTypeParam);
  const { data: apiCategories = [] } = useGetCategoriesQuery();
  const { data: apiLocations = [] } = useGetLocationsQuery();

  const handleOpenClaim = (item) => {
    if (!isAuthenticated) {
      toast.info("Please log in to submit a claim for this item");
      navigate("/login");
      return;
    }
    setClaimModalItem(item);
    setClaimProof("");
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!claimProof.trim()) {
      toast.error("Please describe details only the rightful owner would know");
      return;
    }
    try {
      await createClaim({
        reportId: claimModalItem.id,
        describedHiddenDetail: claimProof.trim(),
      }).unwrap();
      toast.success(
        "Claim submitted successfully! Campus staff will review your proof.",
      );
      setClaimModalItem(null);
      setClaimProof("");
    } catch (err) {
      console.error("Failed to submit claim:", err);
      toast.error(err?.data?.message || "Failed to submit claim");
    }
  };

  const filteredItems = Array.isArray(apiReports)
    ? apiReports.filter((item) => {
        const matchesSearch =
          !searchQuery ||
          (item.title &&
            item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.description &&
            item.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.locationLabel &&
            item.locationLabel
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (item.freeTextLocation &&
            item.freeTextLocation
              .toLowerCase()
              .includes(searchQuery.toLowerCase()));

        const matchesCategory =
          selectedCategory === "All Categories" ||
          item.categoryName === selectedCategory ||
          (item.categoryId &&
            apiCategories.find((c) => c.id === item.categoryId)?.name ===
              selectedCategory);

        return matchesSearch && matchesCategory;
      })
    : [];

  if (sortBy === "Oldest") {
    filteredItems.sort(
      (a, b) =>
        new Date(a.createdAt || a.itemDate || 0) -
        new Date(b.createdAt || b.itemDate || 0),
    );
  } else {
    filteredItems.sort(
      (a, b) =>
        new Date(b.createdAt || b.itemDate || 0) -
        new Date(a.createdAt || a.itemDate || 0),
    );
  }

  return (
    <section className="mb-20 relative z-10 font-[family-name:var(--font-brand)]">
      <div className="relative text-center py-12 md:py-16 px-6 mb-8">
        <span
          className={`inline-flex items-center gap-1.5 text-base font-semibold px-3 py-1 rounded-full mb-3 border transition-all duration-300 hover:scale-105 ${
            darkMode
              ? "bg-blue-950/60 text-blue-400 border-blue-900 hover:border-blue-700"
              : "bg-blue-50 text-[var(--color-brand-primary,#3b82f6)] border-blue-100 hover:border-blue-300"
          }`}
        >
          <ShieldCheck size={14} /> {t("feedBadge")}
        </span>
        <h1
          className={`text-2xl md:text-5xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {t("feedHeroTitle1")}{" "}
          <span className="text-[var(--color-brand-primary,#3b82f6)]">
            {t("feedHeroTitle2")}
          </span>
        </h1>
        <p
          className={`max-w-2xl mx-auto leading-relaxed text-lg md:text-lg ${darkMode ? "text-slate-400" : "text-gray-600"}`}
        >
          {t("feedHeroDescription")}
        </p>

        <div className="mt-8">
          <h2
            className={`text-xl md:text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {t("feedActiveRecoveryTitle")}
          </h2>
          <p
            className={`text-base mt-1 ${darkMode ? "text-slate-500" : "text-gray-500"}`}
          >
            {t("feedActiveRecoverySub")}
          </p>
        </div>
      </div>

      <main className="w-full">
        <div
          className={`flex border-b mb-6 gap-8 ${darkMode ? "border-zinc-800" : "border-gray-200"}`}
        >
          {[
            { key: "All Items", label: t("feedTabAll") },
            { key: "Lost Items", label: t("feedTabLost") },
            { key: "Found Items", label: t("feedTabFound") },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-lg font-semibold relative transition-all duration-200 cursor-pointer hover:opacity-100 ${
                activeTab === tab.key
                  ? "text-[var(--color-brand-primary,#3b82f6)] font-bold"
                  : darkMode
                    ? "text-slate-400 hover:text-slate-200"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-brand-primary,#3b82f6)] rounded-t-md"></span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="relative w-full min-w-0 sm:flex-1 sm:min-w-[240px]">
            <input
              type="text"
              placeholder={t("feedSearchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-2xl pl-9 pr-4 py-2.5 text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#3b82f6)]/40 hover:border-[var(--color-brand-primary,#3b82f6)]/50 ${
                darkMode
                  ? "bg-zinc-900/90 border border-zinc-800 text-slate-100 placeholder-zinc-500"
                  : "bg-white/95 border border-gray-100 text-gray-800 placeholder-gray-400"
              }`}
            />
            <Search
              size={16}
              className={`absolute left-3 top-3.5 ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`rounded-2xl px-3.5 py-2.5 text-base outline-none cursor-pointer font-medium transition-all duration-200 hover:border-[var(--color-brand-primary,#3b82f6)]/50 ${
                darkMode
                  ? "bg-zinc-900/90 border border-zinc-800 text-slate-200"
                  : "bg-white/95 border border-gray-100 text-gray-800"
              }`}
            >
              <option
                value="All Categories"
                className={
                  darkMode
                    ? "bg-zinc-900 text-slate-100"
                    : "bg-white text-gray-800"
                }
              >
                All Categories
              </option>
              {apiCategories.map((cat, i) => (
                <option
                  key={cat.id || i}
                  value={cat.name}
                  className={
                    darkMode
                      ? "bg-zinc-900 text-slate-100"
                      : "bg-white text-gray-800"
                  }
                >
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-2xl px-3.5 py-2.5 text-base outline-none cursor-pointer font-medium transition-all duration-200 hover:border-[var(--color-brand-primary,#3b82f6)]/50 ${
                darkMode
                  ? "bg-zinc-900/90 border border-zinc-800 text-slate-200"
                  : "bg-white/95 border border-gray-100 text-gray-800"
              }`}
            >
              <option
                value="Newest"
                className={
                  darkMode
                    ? "bg-zinc-900 text-slate-100"
                    : "bg-white text-gray-800"
                }
              >
                {t("feedSortNewest")}
              </option>
              <option
                value="Oldest"
                className={
                  darkMode
                    ? "bg-zinc-900 text-slate-100"
                    : "bg-white text-gray-800"
                }
              >
                {t("feedSortOldest")}
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`animate-pulse rounded-3xl p-5 flex flex-col md:flex-row gap-6 ${
                      darkMode ? "bg-zinc-900/60" : "bg-white/80"
                    }`}
                  >
                    <div className="w-full md:w-56 h-48 rounded-2xl bg-gray-300 dark:bg-zinc-800 shrink-0" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 w-1/3 bg-gray-300 dark:bg-zinc-800 rounded" />
                      <div className="h-6 w-3/4 bg-gray-300 dark:bg-zinc-800 rounded" />
                      <div className="h-4 w-full bg-gray-200 dark:bg-zinc-800/80 rounded" />
                      <div className="h-4 w-2/3 bg-gray-200 dark:bg-zinc-800/80 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div
                className={`backdrop-blur-md rounded-3xl p-12 text-center text-lg font-medium border ${
                  darkMode
                    ? "bg-zinc-900/90 border-zinc-800 text-slate-400"
                    : "bg-white/95 border-gray-100 text-gray-500"
                }`}
              >
                <p className="mb-3">Unable to load lost and found reports.</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              <div
                className={`backdrop-blur-md rounded-3xl p-12 text-center text-lg font-medium ${
                  darkMode
                    ? "bg-zinc-900/90 text-slate-400"
                    : "bg-white/95 text-gray-500"
                }`}
              >
                {t("feedNoItemsFound")}
              </div>
            ) : (
              filteredItems.map((item) => {
                const isLost = item.itemType === "LOST";
                const location =
                  item.locationLabel || item.freeTextLocation || "Campus Area";
                const date =
                  item.itemDate ||
                  (item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "Recent");
                const reporterName = item.categoryName || "Campus Member";
                const img =
                  item.photoUrl ||
                  (isLost
                    ? "src/assets/Website/kwfinwtieBa9DJNMHRxB63.jpg"
                    : "src/assets/Website/OIP (1).webp");

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01, y: -4 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`backdrop-blur-md rounded-3xl p-5 transition-all duration-300 flex flex-col md:flex-row gap-6 relative group ${
                      darkMode
                        ? "bg-zinc-900/90 text-slate-100"
                        : "bg-white/95 text-gray-800"
                    }`}
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <span
                        className={`inline-block text-[14px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider transition-transform duration-200 group-hover:scale-105 ${
                          isLost
                            ? darkMode
                              ? "bg-red-950/80 text-red-400 border border-red-800"
                              : "bg-red-50 text-red-600 font-bold"
                            : darkMode
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                              : "bg-amber-50 text-amber-600 font-bold"
                        }`}
                      >
                        {isLost ? t("recStatusLost") : t("recStatusFound")}
                      </span>
                    </div>

                    <div
                      className={`w-full md:w-56 h-48 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 ${
                        darkMode ? "bg-zinc-950/60" : "bg-gray-50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "src/assets/Website/kwfinwtieBa9DJNMHRxB63.jpg";
                        }}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition duration-500 ease-out"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between pt-6 md:pt-0">
                      <div>
                        <div className="flex items-center gap-4 text-base text-gray-400 mb-2">
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <MapPin size={13} /> {location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {date}
                          </span>
                        </div>
                        <h3
                          className={`text-lg font-bold mb-2 transition-colors duration-200 group-hover:text-[var(--color-brand-primary,#3b82f6)] ${darkMode ? "text-slate-100" : "text-gray-900"}`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-base leading-relaxed line-clamp-3 ${darkMode ? "text-slate-400" : "text-gray-600"}`}
                        >
                          {item.description ||
                            "No detailed description available."}
                        </p>
                      </div>

                      <div
                        className={`flex flex-wrap gap-3 items-center justify-between pt-4 mt-2 border-t ${
                          darkMode
                            ? "border-zinc-800 text-slate-400"
                            : "border-gray-100 text-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-base">
                            {reporterName.charAt(0).toUpperCase()}
                          </div>
                          <span
                            className={`text-base font-medium ${darkMode ? "text-slate-300" : "text-gray-700"}`}
                          >
                            {reporterName}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOpenClaim(item)}
                          className={`text-base font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                            darkMode
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 hover:border-emerald-600"
                              : "bg-emerald-50 text-[var(--color-brand-accent,#10b981)] hover:bg-emerald-100"
                          }`}
                        >
                          {t("recVerifyBtn")}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="space-y-4">
            <div
              className={`backdrop-blur-md rounded-3xl p-5 transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-900/90 text-slate-100"
                  : "bg-white/95 text-gray-800"
              }`}
            >
              <span
                className={`inline-block text-base font-semibold px-3 py-1 rounded-full mb-4 transition-transform duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-zinc-800 text-[var(--color-brand-primary,#3b82f6)] border border-zinc-700"
                    : "bg-[var(--color-brand-primary-light,#eff6ff)] text-[var(--color-brand-primary,#3b82f6)]"
                }`}
              >
                <Tag size={12} className="inline mr-1" />{" "}
                {t("feedCategoriesTitle")}
              </span>
              <ul className="space-y-2.5">
                <motion.li
                  onClick={() => setSelectedCategory("All Categories")}
                  whileHover={{ x: 4 }}
                  className={`flex items-center justify-between text-base cursor-pointer p-1.5 rounded-xl transition-colors ${
                    selectedCategory === "All Categories"
                      ? "font-bold text-[var(--color-brand-primary,#3b82f6)] bg-[var(--color-brand-primary,#3b82f6)]/10"
                      : darkMode
                        ? "text-slate-300 hover:bg-zinc-800/60"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="pl-1">All Categories</span>
                  <span
                    className={`pr-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}
                  >
                    {apiReports.length}
                  </span>
                </motion.li>
                {apiCategories.map((cat, idx) => (
                  <motion.li
                    key={cat.id || idx}
                    onClick={() => setSelectedCategory(cat.name)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center justify-between text-base cursor-pointer p-1.5 rounded-xl transition-colors ${
                      selectedCategory === cat.name
                        ? "font-bold text-[var(--color-brand-primary,#3b82f6)] bg-[var(--color-brand-primary,#3b82f6)]/10"
                        : darkMode
                          ? "text-slate-300 hover:bg-zinc-800/60 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="pl-1">{cat.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div
              className={`backdrop-blur-md rounded-3xl p-5 transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-900/90 text-slate-100"
                  : "bg-white/95 text-gray-800"
              }`}
            >
              <span
                className={`inline-block text-base font-semibold px-3 py-1 rounded-full mb-4 transition-transform duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-zinc-800 text-[var(--color-brand-secondary,#ec4899)] border border-zinc-700"
                    : "bg-[var(--color-brand-secondary-light,#fdf2f8)] text-[var(--color-brand-secondary,#ec4899)]"
                }`}
              >
                <Building2 size={12} className="inline mr-1" />{" "}
                {t("feedPopularLocationsTitle")}
              </span>
              <ul className="space-y-2.5">
                {apiLocations.map((loc, idx) => (
                  <motion.li
                    key={loc.id || idx}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center justify-between text-base p-1.5 rounded-xl transition-colors ${
                      darkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    <span className="pl-1">
                      {[loc.building, loc.floor, loc.room]
                        .filter(Boolean)
                        .join(" - ") || "Campus"}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.button
              onClick={onOpenReport}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[var(--color-brand-primary,#3b82f6)] hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle size={16} /> {t("feedReportBtn")}
            </motion.button>
          </div>
        </div>
      </main>

      {/* Claim Submission Modal */}
      <AnimatePresence>
        {claimModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg rounded-3xl p-6 shadow-2xl ${
                darkMode
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "bg-white text-gray-900"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-base">
                    Claim Ownership Verification
                  </h3>
                </div>
                <button
                  onClick={() => setClaimModalItem(null)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleClaimSubmit} className="mt-4 space-y-4">
                <div>
                  <p className="text-base text-gray-500 dark:text-zinc-400 mb-1">
                    Item Title
                  </p>
                  <p className="text-lg font-semibold">
                    {claimModalItem.title}
                  </p>
                </div>

                <div>
                  <label className="block text-base font-semibold mb-1">
                    Describe Unique Identifying Features{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <p className="text-[14px] text-gray-500 dark:text-zinc-400 mb-2">
                    To verify ownership, describe private details not mentioned
                    in the public listing (e.g., serial numbers, stickers,
                    scratches, contents).
                  </p>
                  <textarea
                    required
                    rows="4"
                    value={claimProof}
                    onChange={(e) => setClaimProof(e.target.value)}
                    placeholder="Enter identifying details only the rightful owner knows..."
                    className={`w-full rounded-2xl p-3 text-base border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-500"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setClaimModalItem(null)}
                    className="px-4 py-2 rounded-xl text-base font-semibold border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isClaiming}
                    className="px-5 py-2 rounded-xl text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isClaiming ? "Submitting..." : "Submit Claim"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
