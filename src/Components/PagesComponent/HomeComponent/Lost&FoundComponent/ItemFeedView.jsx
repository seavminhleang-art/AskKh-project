import React, { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "@/Components/common/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Clock,
  ShieldCheck,
  Search,
  PlusCircle,
  Tag,
  Building2,
  SlidersHorizontal,
  Sparkles,
  Inbox,
  AlertCircle,
  RefreshCw,
  X
} from "lucide-react";

import { useWorkspaceDataQuery } from "@/features/workspace/workspaceApi";
import { rows, message, dateLabel } from "@/features/workspace/workspaceModel";
import { formatMediaUrl } from "@/features/workspace/profileImage";
import { useGetUserByIdQuery } from "@/features/users/userApi";
import ReportDetails from "./ReportDetails";

function ReportAuthor({ item, darkMode }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const scope = String(item.scope || item.visibility || item.reportScope || "")
    .trim()
    .toLowerCase();
  const memberLabel = scope === "istad"
    ? "ISTAD Member"
    : scope === "public"
      ? "Public Member"
      : "Campus Member";
  const embeddedUser =
    item.reporter?.user ||
    item.reporter ||
    item.user ||
    item.createdBy ||
    item.owner ||
    {};
  const embeddedName = [
    item.reporterName,
    item.reporterUsername,
    item.ownerDisplayName,
    item.userDisplayName,
    embeddedUser.displayName,
    embeddedUser.fullName,
    embeddedUser.username,
    embeddedUser.name,
    typeof item.reporter === "string" ? item.reporter : null,
  ].find((value) => typeof value === "string" && value.trim())?.trim();
  const userId = item.userId ?? item.reporterUserId ?? item.ownerId;
  const shouldLookup = userId != null && !embeddedName;
  const profileQuery = useGetUserByIdQuery(userId, {
    skip: !shouldLookup || !isAuthenticated,
  });
  const profile =
    profileQuery.data?.data || profileQuery.data?.user || profileQuery.data || {};
  const name =
    embeddedName ||
    profile.displayName ||
    profile.fullName ||
    profile.username ||
    profile.name ||
    (userId != null && profileQuery.isLoading
      ? "Loading reporter…"
      : memberLabel);
  const avatar =
    item.ownerAvatarUrl ||
    item.reporterAvatarUrl ||
    item.userAvatarUrl ||
    embeddedUser.profileImageUrl ||
    embeddedUser.avatar ||
    embeddedUser.photoURL ||
    profile.profileImageUrl ||
    profile.avatar ||
    profile.photoURL;

  return (
    <div className="flex min-w-0 items-center gap-2.5 group/author" title={name}>
      {avatar ? (
        <img
          src={formatMediaUrl(avatar)}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-transparent transition-all duration-300 group-hover/author:ring-[var(--color-brand-primary,#3b82f6)] shadow-sm"
        />
      ) : (
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold shadow-sm transition-transform duration-300 group-hover/author:scale-105 ${
            darkMode 
              ? "bg-zinc-800 text-blue-400 border border-zinc-700" 
              : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
      )}
      <div className="flex flex-col min-w-0">
        <span
          className={`truncate text-sm font-semibold tracking-tight ${darkMode ? "text-slate-200" : "text-gray-800"}`}
        >
          {name}
        </span>
        <span className={`text-[11px] font-medium ${darkMode ? "text-zinc-500" : "text-gray-400"}`}>
          {scope === "istad" || scope === "public" ? memberLabel : "Verified Member"}
        </span>
      </div>
    </div>
  );
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
    <section className="mb-24 relative z-10 font-[family-name:var(--font-brand)]">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <div className="relative text-center py-12 md:py-16 px-6 mb-6">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border shadow-sm transition-all duration-300 hover:scale-105 ${
            darkMode
              ? "bg-blue-950/80 text-blue-400 border-blue-900/80"
              : "bg-blue-50 text-[var(--color-brand-primary,#3b82f6)] border-blue-100"
          }`}
        >
          <ShieldCheck size={15} /> {t("feedBadge")}
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {t("feedHeroTitle1")}{" "}
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
            {t("feedHeroTitle2")}
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`max-w-2xl mx-auto leading-relaxed text-base md:text-lg ${darkMode ? "text-slate-400" : "text-gray-600"}`}
        >
          {t("feedHeroDescription")}
        </motion.p>
      </div>

      {selectedReport && (
        <ReportDetails
          report={selectedReport}
          darkMode={darkMode}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Global Error Banner Alerts */}
      {[reports, categoryQuery, locationQuery].map(
        (query, index) =>
          query.isError && (
            <div 
              key={index} 
              className={`max-w-4xl mx-auto mb-6 p-4 rounded-2xl flex items-center justify-between border ${
                darkMode ? "bg-red-950/40 border-red-900/60 text-red-200" : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0 text-red-500" />
                <span className="text-sm font-medium">{message(query.error)}</span>
              </div>
              <button 
                onClick={query.refetch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          ),
      )}

      {reports.isFetching && (
        <div className="flex items-center justify-center gap-2 mb-6 text-sm font-medium text-blue-500 animate-pulse">
          <RefreshCw size={16} className="animate-spin" /> Loading reports…
        </div>
      )}

      {selectedLocation && (
        <div className="max-w-7xl mx-auto px-4 mb-4 flex items-center justify-between p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-sm">
          <span className="flex items-center gap-2 font-medium">
            <MapPin size={16} className="text-blue-500" /> Filtered by active location location ID: {selectedLocation}
          </span>
          <button 
            onClick={() => setSelectedLocation("")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500 text-white font-semibold text-xs hover:bg-blue-600 transition-colors"
          >
            <X size={14} /> Clear location filter
          </button>
        </div>
      )}

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Navigation Tabs Bar & Search / Sort controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200/20">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { key: "All Items", label: t("feedTabAll") },
              { key: "Lost Items", label: t("feedTabLost") },
              { key: "Found Items", label: t("feedTabFound") },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : darkMode
                      ? "bg-zinc-900/60 text-slate-400 hover:text-slate-200 hover:bg-zinc-800/80 border border-zinc-800/60"
                      : "bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-100 shadow-sm"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder={t("feedSearchPlaceholder")}
                value={searchQuery}
                onChange={handleSearchChange}
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-sm ${
                  darkMode
                    ? "bg-zinc-900/90 border border-zinc-800 text-slate-100 placeholder-zinc-500"
                    : "bg-white border border-gray-200/80 text-gray-800 placeholder-gray-400"
                }`}
              />
              <Search
                size={16}
                className={`absolute left-3.5 top-3 ${darkMode ? "text-zinc-500" : "text-gray-400"}`}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`flex-1 sm:flex-initial rounded-2xl px-4 py-2.5 text-sm outline-none cursor-pointer font-medium shadow-sm transition-all duration-300 ${
                  darkMode
                    ? "bg-zinc-900/90 border border-zinc-800 text-slate-200"
                    : "bg-white border border-gray-200/80 text-gray-800"
                }`}
              >
                {categories.map((cat, i) => (
                  <option
                    key={i}
                    value={cat.name}
                    className={darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-800"}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={handleSortChange}
                className={`flex-1 sm:flex-initial rounded-2xl px-4 py-2.5 text-sm outline-none cursor-pointer font-medium shadow-sm transition-all duration-300 ${
                  darkMode
                    ? "bg-zinc-900/90 border border-zinc-800 text-slate-200"
                    : "bg-white border border-gray-200/80 text-gray-800"
                }`}
              >
                <option value="Newest" className={darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-800"}>
                  {t("feedSortNewest")}
                </option>
                <option value="Oldest" className={darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-800"}>
                  {t("feedSortOldest")}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Feed List (Left 3 columns) */}
          <div className="lg:col-span-3 space-y-5">
            {!reports.isLoading && !reports.isError && filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-3xl p-16 text-center border shadow-sm flex flex-col items-center justify-center ${
                  darkMode
                    ? "bg-zinc-900/90 border-zinc-800/80 text-slate-400"
                    : "bg-white border-gray-100 text-gray-500 shadow-xl shadow-gray-100/50"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl grid place-items-center mb-4 ${darkMode ? "bg-zinc-800 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
                  <Inbox size={32} />
                </div>
                <h3 className={`text-lg font-bold mb-1 ${darkMode ? "text-slate-200" : "text-gray-800"}`}>No items found</h3>
                <p className="text-sm max-w-sm mb-6">{t("feedNoItemsFound")}</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All Categories"); setSelectedLocation(""); setActiveTab("All Items"); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  Reset all filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className={`rounded-3xl p-5 md:p-6 transition-all duration-300 flex flex-col sm:flex-row gap-6 relative group border shadow-sm hover:shadow-xl ${
                        darkMode
                          ? "bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700 text-slate-100 shadow-black/20"
                          : "bg-white border-gray-100/80 hover:border-blue-200/60 text-gray-800 shadow-xl shadow-gray-100/60"
                      }`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-5 right-5 z-10">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                            item.type === "LOST"
                              ? darkMode
                                ? "bg-red-950/80 text-red-400 border border-red-900/60"
                                : "bg-red-50 text-red-600 border border-red-100"
                              : darkMode
                                ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900/60"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.type === "LOST" ? "bg-red-500" : "bg-emerald-500 animate-pulse"}`} />
                          {item.type === "LOST" ? t("recStatusLost") : t("recStatusFound")}
                        </span>
                      </div>

                      {/* Image Thumbnail */}
                      <div
                        className={`w-full sm:w-48 h-44 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative border ${
                          darkMode ? "bg-zinc-950/60 border-zinc-800/60" : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.style.display = "none";
                            }}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-out"
                          />
                        ) : (
                          <div className={`flex flex-col items-center justify-center gap-1.5 ${darkMode ? "text-zinc-600" : "text-gray-300"}`}>
                            <Sparkles size={24} />
                            <span className="text-[11px] font-medium tracking-wide uppercase">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Meta attributes */}
                          <div className="flex items-center gap-4 text-xs font-semibold mb-2.5">
                            <span className="flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-lg">
                              <MapPin size={13} /> {item.location}
                            </span>
                            <span className={`flex items-center gap-1.5 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                              <Clock size={13} /> {item.timeAgo}
                            </span>
                          </div>

                          <h3
                            className={`text-lg font-bold mb-2 tracking-tight transition-colors duration-200 group-hover:text-blue-500 ${darkMode ? "text-slate-100" : "text-gray-900"}`}
                          >
                            {item.title}
                          </h3>

                          <p
                            className={`text-sm leading-relaxed line-clamp-2 mb-4 ${darkMode ? "text-zinc-400" : "text-gray-600"}`}
                          >
                            {item.description}
                          </p>
                        </div>

                        {/* Footer details: Author & Action Button */}
                        <div
                          className={`flex flex-wrap gap-3 items-center justify-between pt-4 border-t ${
                            darkMode
                              ? "border-zinc-800/80 text-slate-400"
                              : "border-gray-100 text-gray-600"
                          }`}
                        >
                          <ReportAuthor item={item} darkMode={darkMode} />
                          
                          <motion.button
                            onClick={() => setSelectedReport(item)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-sm ${
                              item.type === "FOUND"
                                ? darkMode
                                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900"
                                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20"
                                : darkMode
                                  ? "bg-zinc-800 text-slate-200 hover:bg-zinc-700 border border-zinc-700"
                                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                            }`}
                          >
                            {item.type === "FOUND" ? t("recVerifyBtn") : "View details"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>

          {/* Sidebar / Widgets (Right Column) */}
          <div className="space-y-6">
            {/* Categories Widget */}
            <div
              className={`rounded-3xl p-6 border shadow-sm transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-900/80 border-zinc-800/80 text-slate-100 shadow-black/20"
                  : "bg-white border-gray-100/80 text-gray-800 shadow-xl shadow-gray-100/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    darkMode
                      ? "bg-blue-950/80 text-blue-400 border border-blue-900/60"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  <Tag size={13} /> {t("feedCategoriesTitle")}
                </span>
              </div>
              <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
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
                    className={`flex items-center justify-between text-sm cursor-pointer p-2.5 rounded-2xl transition-all ${
                      selectedCategory === cat.name
                        ? "font-bold text-white bg-blue-600 shadow-md shadow-blue-500/20"
                        : darkMode
                          ? "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="truncate pr-2">{cat.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        selectedCategory === cat.name 
                          ? "bg-blue-700 text-white" 
                          : darkMode ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Popular Locations Widget */}
            <div
              className={`rounded-3xl p-6 border shadow-sm transition-all duration-300 ${
                darkMode
                  ? "bg-zinc-900/80 border-zinc-800/80 text-slate-100 shadow-black/20"
                  : "bg-white border-gray-100/80 text-gray-800 shadow-xl shadow-gray-100/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    darkMode
                      ? "bg-pink-950/80 text-pink-400 border border-pink-900/60"
                      : "bg-pink-50 text-pink-600 border border-pink-100"
                  }`}
                >
                  <Building2 size={13} /> {t("feedPopularLocationsTitle")}
                </span>
              </div>
              <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
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
                    className={`flex items-center justify-between text-sm cursor-pointer p-2.5 rounded-2xl transition-all ${
                      selectedLocation === loc.id
                        ? "font-bold text-white bg-pink-600 shadow-md shadow-pink-500/20"
                        : darkMode
                          ? "text-zinc-300 hover:bg-zinc-800/60 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="truncate pr-2">{loc.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        selectedLocation === loc.id 
                          ? "bg-pink-700 text-white" 
                          : darkMode ? "bg-zinc-800 text-zinc-400" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {loc.count}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Create Report Callout Action Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25"
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <h4 className="font-bold text-lg mb-1">Lost or found something?</h4>
              <p className="text-xs text-blue-100 mb-5 leading-relaxed">
                Create a report instantly to notify the campus community and track status updates.
              </p>
              <button
                onClick={onOpenReport}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-4 rounded-2xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <PlusCircle size={16} /> {t("feedReportBtn")}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </section>
  );
}
