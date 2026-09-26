import React, { useState } from "react";
import Pagination from "@/Components/common/Pagination";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  PlusCircle,
  Tag,
  Building2,
} from "lucide-react";

import { useWorkspaceDataQuery } from "@/features/workspace/workspaceApi";
import { rows, message, dateLabel } from "@/features/workspace/workspaceModel";
import { formatMediaUrl } from "@/features/workspace/profileImage";
import ReportDetails from "./ReportDetails";

function memberLabel(item) {
  const scope = String(item.scope || item.visibility || item.reportScope || "")
    .trim()
    .toLowerCase();
  if (scope === "istad") return "ISTAD Member";
  if (scope === "public") return "Public Member";
  return "Campus Member";
}

export default function ItemFeedView({ onOpenReport, darkMode }) {
  const { t } = useTranslation();
  const reports = useWorkspaceDataQuery({ resource: "reports" });
  const categoryQuery = useWorkspaceDataQuery({ resource: "categories" });
  const locationQuery = useWorkspaceDataQuery({ resource: "locations" });
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const locationRows = rows(locationQuery.data);
  const categoryRows = rows(categoryQuery.data);
  const items = rows(reports.data).map((item) => ({
    ...item,
    scope: item.scope || item.visibility || item.reportScope,
    type: String(item.itemType || "").toUpperCase(),
    title: item.title || "",
    description: item.description || "",
    category:
      item.categoryName ||
      categoryRows.find((c) => String(c.id) === String(item.categoryId))
        ?.name ||
      "Uncategorized",
    location:
      item.freeTextLocation ||
      locationRows
        .filter((l) => String(l.id) === String(item.locationId))
        .map((l) =>
          [l.building, l.floor, l.room].filter(Boolean).join(", "),
        )[0] ||
      "—",
    timeAgo: dateLabel(item.createdAt || item.itemDate),
    reporter:
      item.reporterName ||
      item.user?.username ||
      memberLabel(item),
    avatar: item.user?.profileImageUrl,
    image: item.photoUrl ? formatMediaUrl(item.photoUrl) : null,
  }));
  const categories = [
    { name: "All Categories", count: items.length },
    ...categoryRows.map((c) => ({
      name: c.name || c.categoryName,
      count: items.filter((i) => String(i.categoryId) === String(c.id)).length,
    })),
  ];
  const locations = locationRows.map((l) => ({
    id: String(l.id),
    name: [l.building, l.floor, l.room].filter(Boolean).join(", "),
    count: items.filter((i) => String(i.locationId) === String(l.id)).length,
  }));
  const [activeTab, setActiveTab] = useState("All Items");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };
  const handleCategoryChange = (name) => {
    setSelectedCategory(name);
    setCurrentPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const filteredItems = items
    .filter((item) => {
      const matchesTab =
        activeTab === "All Items" ||
        (activeTab === "Lost Items" && item.type === "LOST") ||
        (activeTab === "Found Items" && item.type === "FOUND");

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        item.category === selectedCategory;

      return (
        matchesTab &&
        matchesSearch &&
        matchesCategory &&
        (!selectedLocation || String(item.locationId) === selectedLocation)
      );
    })
    .sort(
      (a, b) =>
        (sortBy === "Newest" ? -1 : 1) *
        ((Date.parse(a.createdAt || a.itemDate) || 0) -
          (Date.parse(b.createdAt || b.itemDate) || 0)),
    );

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
          className="text-5xl md:text-5xl font-bold mb-2 text-[var(--home-primary-text)]"
        >
          {t("feedHeroTitle1")}{" "}
          <span className="text-[var(--home-secondary-text)]">
            {t("feedHeroTitle2")}
          </span>
        </h1>
        <p
          className={`max-w-2xl mx-auto leading-relaxed text-base md:text-base ${darkMode ? "text-slate-400" : "text-gray-600"}`}
        >
          {t("feedHeroDescription")}
        </p>

        <div className="mt-8">
          <h2
            className="text-xl md:text-5xl font-bold text-[var(--home-primary-text)]"
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

      {selectedReport && (
        <ReportDetails
          report={selectedReport}
          darkMode={darkMode}
          onClose={() => setSelectedReport(null)}
        />
      )}
      {[reports, categoryQuery, locationQuery].map(
        (query, index) =>
          query.isError && (
            <p role="alert" key={index}>
              {message(query.error)}{" "}
              <button onClick={query.refetch}>Retry</button>
            </p>
          ),
      )}
      {reports.isFetching && <p role="status">Loading reports…</p>}
      {selectedLocation && (
        <button onClick={() => setSelectedLocation("")}>
          Clear location filter
        </button>
      )}
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
              onClick={() => handleTabChange(tab.key)}
              className={`pb-3 text-base font-semibold relative transition-all duration-200 cursor-pointer hover:opacity-100 ${
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
              onChange={handleSearchChange}
              className={`w-full rounded-2xl pl-9 pr-4 py-2.5 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#3b82f6)]/40 hover:border-[var(--color-brand-primary,#3b82f6)]/50 ${
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
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`rounded-2xl px-3.5 py-2.5 text-base outline-none cursor-pointer font-medium transition-all duration-200 hover:border-[var(--color-brand-primary,#3b82f6)]/50 ${
                darkMode
                  ? "bg-zinc-900/90 border border-zinc-800 text-slate-200"
                  : "bg-white/95 border border-gray-100 text-gray-800"
              }`}
            >
              {categories.map((cat, i) => (
                <option
                  key={i}
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
              onChange={handleSortChange}
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
            {!reports.isLoading &&
            !reports.isError &&
            filteredItems.length === 0 ? (
              <div
                className={`backdrop-blur-md rounded-3xl p-12 text-center text-base font-medium ${
                  darkMode
                    ? "bg-zinc-900/90 text-slate-400"
                    : "bg-white/95 text-gray-500"
                }`}
              >
                {t("feedNoItemsFound")}
              </div>
            ) : (
              <>
                {paginatedItems.map((item) => (
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
                        className={`inline-block text-base font-semibold px-3 py-1 rounded-full uppercase tracking-wider transition-transform duration-200 group-hover:scale-105 ${
                          item.type === "LOST"
                            ? darkMode
                              ? "bg-red-950/80 text-red-400 border border-red-800"
                              : "bg-red-50 text-red-600 font-bold"
                            : darkMode
                              ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                              : "bg-amber-50 text-amber-600 font-bold"
                        }`}
                      >
                        {item.type === "LOST"
                          ? t("recStatusLost")
                          : t("recStatusFound")}
                      </span>
                    </div>

                    <div
                      className={`w-full md:w-56 h-48 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 ${
                        darkMode ? "bg-zinc-950/60" : "bg-gray-50"
                      }`}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = "none";
                          }}
                          className="w-full h-full object-contain transform group-hover:scale-110 transition duration-500 ease-out"
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between pt-6 md:pt-0">
                      <div>
                        <div className="flex items-center gap-4 text-base text-gray-400 mb-2">
                          <span className="flex items-center gap-1 text-red-500 font-medium">
                            <MapPin size={13} /> {item.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} /> {item.timeAgo}
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
                          {item.description}
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
                          {item.avatar && (
                            <img
                              src={item.avatar}
                              alt={item.reporter}
                              className="w-7 h-7 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[var(--color-brand-primary,#3b82f6)]/50 transition-all duration-200"
                            />
                          )}
                          <span
                            className={`text-base font-medium ${darkMode ? "text-slate-300" : "text-gray-700"}`}
                          >
                            {item.reporter}
                          </span>
                        </div>
                        <motion.button
                          onClick={() => setSelectedReport(item)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`text-base font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                            darkMode
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 hover:border-emerald-600"
                              : "bg-emerald-50 text-[var(--color-brand-accent,#10b981)] hover:bg-emerald-100"
                          }`}
                        >
                          {item.type === "FOUND"
                            ? t("recVerifyBtn")
                            : "View details"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
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
                {categories.map((cat, idx) => (
                  <motion.li
                    key={idx}
                    onClick={() => handleCategoryChange(cat.name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleCategoryChange(cat.name);
                      }
                    }}
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
                    <span
                      className={`pr-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}
                    >
                      {cat.count}
                    </span>
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
                {locations.map((loc, idx) => (
                  <motion.li
                    key={idx}
                    onClick={() => setSelectedLocation(loc.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedLocation(loc.id);
                      }
                    }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.15 }}
                    className={`flex items-center justify-between text-base cursor-pointer p-1.5 rounded-xl transition-colors ${
                      darkMode
                        ? "text-slate-300 hover:bg-zinc-800/60 hover:text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="pl-1">{loc.name}</span>
                    <span
                      className={`pr-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}
                    >
                      {loc.count}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.button
              onClick={onOpenReport}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-[var(--color-brand-primary,#3b82f6)] hover:bg-blue-600 text-white font-semibold py-3.5 px-4 rounded-2xl text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle size={16} /> {t("feedReportBtn")}
            </motion.button>
          </div>
        </div>
      </main>
    </section>
  );
}
