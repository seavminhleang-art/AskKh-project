import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useGetReportsQuery } from "../../../features/lostFound/lostFoundApi";

export default function RecentRecoveries({ darkMode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: reports, isLoading, isError, refetch } = useGetReportsQuery();
  const items = Array.isArray(reports) ? reports.slice(0, 3) : [];

  return (
    <section className="mt-28 mb-16 relative z-10 font-[family-name:var(--font-brand)]">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`inline-block text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 cursor-pointer ${
            darkMode
              ? "bg-zinc-800 text-[var(--home-secondary-text)]"
              : "bg-[var(--color-brand-secondary-light)] text-[var(--home-secondary-text)]"
          }`}
        >
          {t("recBadge")}
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-bold text-[var(--home-secondary-text)] mb-3">
          {t("recTitle")}
        </h2>

        <p className={`max-w-xl mx-auto text-sm md:text-base leading-relaxed ${
          darkMode ? "text-slate-400" : "text-gray-600"
        }`}>
          {t("recSubtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`animate-pulse rounded-3xl p-5 flex flex-col justify-between h-80 ${
                darkMode ? "bg-zinc-900/60" : "bg-white/80"
              }`}
            >
              <div className="h-44 w-full bg-gray-300 dark:bg-zinc-800 rounded-2xl mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-1/3 bg-gray-300 dark:bg-zinc-800 rounded" />
                <div className="h-5 w-3/4 bg-gray-300 dark:bg-zinc-800 rounded" />
                <div className="h-3.5 w-full bg-gray-200 dark:bg-zinc-800/80 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className={`rounded-3xl p-8 text-center border ${
          darkMode ? "bg-zinc-900/60 border-zinc-800 text-zinc-400" : "bg-white border-gray-100 text-gray-500"
        }`}>
          <p className="text-sm mb-3">Unable to load recent recoveries at the moment.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className={`rounded-3xl p-8 text-center border ${
          darkMode ? "bg-zinc-900/60 border-zinc-800 text-zinc-400" : "bg-white border-gray-100 text-gray-500"
        }`}>
          <p className="text-sm">No recent lost or found items reported yet.</p>
          <Link
            to="/community/lost-found"
            className="mt-3 inline-block px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Report an Item
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const isFound = item.itemType === 'FOUND';
            const statusBg = isFound
              ? "bg-[var(--color-brand-primary)] text-white"
              : "bg-[var(--color-brand-secondary)] text-white";
            const location = item.locationLabel || item.freeTextLocation || 'Campus';
            const date = item.itemDate || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent');
            const author = item.categoryName || 'General';
            const img = item.photoUrl || (isFound ? "src/assets/Website/OIP (1).webp" : "src/assets/Website/kwfinwtieBa9DJNMHRxB63.jpg");

            return (
              <motion.div
                key={item.id || idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate('/community/lost-found')}
                className={`backdrop-blur-md rounded-3xl p-5 flex flex-col justify-between cursor-pointer transition-colors duration-300 ${
                  darkMode
                    ? "bg-zinc-900/90 text-slate-100"
                    : "bg-white/95 text-gray-800"
                }`}
              >
                <div>
                  <div className={`relative h-48 rounded-2xl overflow-hidden mb-4 ${
                    darkMode ? "bg-zinc-950" : "bg-gray-100"
                  }`}>
                    <span className={`absolute top-3 left-3 z-10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusBg} shadow-md`}>
                      {item.itemType || (isFound ? t("recStatusFound") : t("recStatusLost"))}
                    </span>
                    <img
                      src={img}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "src/assets/Website/kwfinwtieBa9DJNMHRxB63.jpg";
                      }}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className={`flex items-center justify-between text-xs mb-2 ${
                    darkMode ? "text-slate-400" : "text-gray-400"
                  }`}>
                    <span className={`flex items-center gap-1 font-medium truncate max-w-[180px] ${
                      darkMode ? "text-slate-300" : "text-gray-500"
                    }`}>
                      <MapPinIcon className="w-3.5 h-3.5 text-[var(--home-secondary-text)] flex-shrink-0" />
                      {location}
                    </span>
                    <span className="flex-shrink-0">{date}</span>
                  </div>

                  <h3 className={`text-base font-bold mb-1.5 leading-snug line-clamp-1 ${
                    darkMode ? "text-slate-100" : "text-gray-900"
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-6 line-clamp-2 ${
                    darkMode ? "text-slate-400" : "text-gray-600"
                  }`}>
                    {item.description || 'No additional description provided.'}
                  </p>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t ${
                  darkMode ? "border-zinc-800" : "border-gray-100"
                }`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      {author.charAt(0).toUpperCase()}
                    </div>
                    <span className={`text-xs font-medium ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                      {author}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/community/lost-found');
                    }}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition ${
                      darkMode
                        ? "bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900/80"
                        : "bg-emerald-50 text-[var(--color-brand-accent)] hover:bg-emerald-100"
                    }`}
                  >
                    {t("recVerifyBtn")}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}