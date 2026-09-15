import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  PackagePlus,
  Filter,
  PackageSearch,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import {
  sampleLostFoundItems,
  lostFoundCategories,
  campusLocations,
} from "../../data/lostFoundData";
import { useLanguage } from "../../context/LanguageContext";

export default function LostFoundPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const filteredItems = sampleLostFoundItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "ALL" || item.type === selectedType;
    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;
    const matchesLocation =
      selectedLocation === "All Locations" ||
      item.location === selectedLocation;

    return matchesSearch && matchesType && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-5">
      {/* 1. Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("lostFound.title", "Lost & Found Community")}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              Preview Architecture
            </span>
          </div>
          <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400">
            {t(
              "lostFound.description",
              "Help reunite lost items with their owners across the ISTAD campus.",
            )}
          </p>
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            to="/lost-found/report?type=LOST"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors shadow-2xs"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>{t("lostFound.reportLost", "Report Lost Item")}</span>
          </Link>
          <Link
            to="/lost-found/report?type=FOUND"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-lg font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("lostFound.reportFound", "Report Found Item")}</span>
          </Link>
        </div>
      </header>

      {/* 2. Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t(
            "common.searchPlaceholder",
            "Search lost or found items by name, model, campus location...",
          )}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs transition-colors"
        />
      </div>

      {/* 3. Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pb-1">
        {/* Type Toggle */}
        <div className="flex rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 shadow-2xs">
          {["ALL", "LOST", "FOUND"].map((tType) => (
            <button
              key={tType}
              type="button"
              onClick={() => setSelectedType(tType)}
              className={`flex-1 py-1 rounded-lg text-lg font-semibold transition-colors cursor-pointer ${
                selectedType === tType
                  ? "bg-brand-primary text-white shadow-2xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
              }`}
            >
              {tType === "ALL"
                ? t("common.all", "All")
                : tType === "LOST"
                  ? t("lostFound.lost", "Lost Items")
                  : t("lostFound.found", "Found Items")}
            </button>
          ))}
        </div>

        {/* Category Select */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs"
        >
          {lostFoundCategories.map((c) => (
            <option key={c} value={c}>
              {c === "All Categories"
                ? t("lostFound.allCategories", "All Categories")
                : c}
            </option>
          ))}
        </select>

        {/* Location Select */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-2xs"
        >
          {campusLocations.map((l) => (
            <option key={l} value={l}>
              {l === "All Locations"
                ? t("lostFound.allLocations", "All Locations")
                : l}
            </option>
          ))}
        </select>

        {/* Match Center Quick Link */}
        <Link
          to="/lost-found/matches"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-lg font-semibold hover:bg-amber-100/60 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t("matchCenter.title", "Review Match Center")}</span>
        </Link>
      </div>

      {/* 4. Main Grid & Secondary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Items Grid (8 cols) */}
        <main className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-lg font-semibold text-slate-500 dark:text-slate-400">
              {t("common.view", "Showing")} {filteredItems.length}{" "}
              {t("lostFound.title", "campus reports")}
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3 p-6">
              <PackageSearch className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {t("lostFound.noItems", "No matching reports found")}
              </p>
              <p className="text-lg text-slate-400 max-w-sm mx-auto">
                {t(
                  "common.noData",
                  "No items match your active filters. Try searching with a broader keyword or report a missing item.",
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isLost = item.type === "LOST";
                return (
                  <article
                    key={item.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
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

                        <div className="absolute top-2.5 right-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 backdrop-blur-xs">
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-3.5 space-y-2">
                        <div className="flex items-center justify-between gap-1 text-[16px] text-slate-400">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {item.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.date}
                          </span>
                        </div>

                        <Link
                          to={`/lost-found/${item.id}`}
                          className="block text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1 transition-colors"
                        >
                          {item.title}
                        </Link>

                        <p className="text-lg text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center gap-1 text-[16px] text-slate-400 truncate pt-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="p-3.5 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <img
                          src={item.reporter.avatar}
                          alt={item.reporter.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-[16px] text-slate-500 dark:text-slate-400 truncate">
                          {item.reporter.name}
                        </span>
                      </div>

                      <Link
                        to={`/lost-found/${item.id}`}
                        className="inline-flex items-center gap-1 text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                      >
                        <span>{t("claims.viewItem", "Details")}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        {/* Secondary Content (4 cols) */}
        <aside className="hidden lg:block lg:col-span-4 space-y-4">
          {/* Quick Statistics */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {t("lostFound.recoveryStatus", "Campus Recovery Status")}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/60 dark:border-rose-900/30">
                <span className="text-base font-bold text-rose-700 dark:text-rose-300 block">
                  3
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 uppercase font-medium">
                  {t("lostFound.lost", "Active Lost")}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/60 dark:border-blue-900/30">
                <span className="text-base font-bold text-blue-700 dark:text-blue-300 block">
                  2
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-medium">
                  {t("lostFound.found", "Active Found")}
                </span>
              </div>
            </div>
          </section>

          {/* Guidelines */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t("lostFound.verificationRules", "Claim Verification Rules")}
              </h3>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              {t(
                "lostFound.reportItemDesc",
                "When claiming a found item, you will be asked for unique details (e.g. serial numbers, passcodes, internal contents) to prevent false claims.",
              )}
            </p>
          </section>

          {/* Contact Security Office */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2 text-lg">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[16px]">
              {t("lostFound.securityDesk", "Campus Security Desk")}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Valuable recovered items (laptops, wallets, keys) are handed
              directly to the Main Lobby Security Desk.
            </p>
            <div className="pt-1 text-slate-700 dark:text-slate-300 font-semibold">
              Open: Mon - Sat (7:30 AM - 6:00 PM)
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
