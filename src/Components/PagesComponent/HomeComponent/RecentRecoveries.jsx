import recoveryOneImage from "@/assets/Website/kwfinwtieBa9DJNMHRxB63.jpg";
import recoveryTwoImage from "@/assets/Website/OIP.webp";
import recoveryThreeImage from "@/assets/Website/OIP (1).webp";
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useWorkspaceDataQuery } from "@/features/workspace/workspaceApi";
import { rows, dateLabel } from "@/features/workspace/workspaceModel";
import { formatMediaUrl } from "@/features/workspace/profileImage";

export default function RecentRecoveries({ darkMode }) {
  const { t, i18n } = useTranslation();
  const reportsQuery = useWorkspaceDataQuery({ resource: "reports" });
  const categoryQuery = useWorkspaceDataQuery({ resource: "categories" });
  const locationQuery = useWorkspaceDataQuery({ resource: "locations" });

  const locationRows = rows(locationQuery.data);
  const categoryRows = rows(categoryQuery.data);

  const fallbackImages = [
    recoveryOneImage,
    recoveryTwoImage,
    recoveryThreeImage,
  ];

  const apiItems = rows(reportsQuery.data)
    .slice(0, 3)
    .map((item, idx) => {
      const isLost = String(item.itemType || "").toLowerCase() === "lost";
      const loc =
        item.freeTextLocation ||
        locationRows
          .filter((l) => String(l.id) === String(item.locationId))
          .map((l) =>
            [l.building, l.floor, l.room].filter(Boolean).join(", "),
          )[0] ||
        t("recLocation");

      return {
        id: item.id,
        status: isLost ? t("recStatusLost") : t("recStatusFound"),
        statusBg: isLost
          ? "bg-[var(--color-brand-secondary)] text-white"
          : "bg-[var(--color-brand-primary)] text-white",
        title: item.title,
        desc: item.description || "Reported on campus via NEXA.",
        location: loc,
        date: dateLabel(item.createdAt || item.itemDate, i18n.language),
        author: item.reporterName || item.user?.username || "Campus Member",
        avatar:
          item.user?.profileImageUrl ||
          `https://randomuser.me/api/portraits/men/${22 + idx * 10}.jpg`,
        img: item.photoUrl
          ? formatMediaUrl(
              item.photoUrl,
              fallbackImages[idx % fallbackImages.length],
            )
          : fallbackImages[idx % fallbackImages.length],
        fallbackImg: fallbackImages[idx % fallbackImages.length],
      };
    });

  const fallbackItems = [
    {
      id: 201,
      status: t("recStatusLost"),
      statusBg: "bg-[var(--color-brand-secondary)] text-white",
      title: t("rec1Title"),
      desc: t("rec1Desc"),
      location: "ISTAD, Mobile Lab 302",
      date: "Today, 10:30 AM",
      author: "Chan Moniza",
      avatar: "https://randomuser.me/api/portraits/women/24.jpg",
      img: recoveryOneImage,
    },
    {
      id: 202,
      status: t("recStatusLost"),
      statusBg: "bg-[var(--color-brand-secondary)] text-white",
      title: t("rec2Title"),
      desc: t("rec2Desc"),
      location: "ISTAD, Cafeteria Ground Floor",
      date: "Yesterday, 3:15 PM",
      author: "Sothearith Sroeun",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      img: recoveryTwoImage,
    },
    {
      id: 203,
      status: t("recStatusFound"),
      statusBg: "bg-[var(--color-brand-primary)] text-white",
      title: t("rec3Title"),
      desc: t("rec3Desc"),
      location: "ISTAD, Library 2nd Floor",
      date: "2 days ago",
      author: "Lyheng Cheakching",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      img: recoveryThreeImage,
    },
  ];

  const items = apiItems.length >= 3 ? apiItems : fallbackItems;

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
          className={`inline-block text-base font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 cursor-pointer ${
            darkMode
              ? "bg-zinc-800 text-[var(--home-secondary-text)]"
              : "bg-[var(--color-brand-secondary-light)] text-[var(--home-secondary-text)]"
          }`}
        >
          {t("recBadge")}
        </motion.div>

        <h2 className="text-5xl md:text-5xl font-bold text-[var(--home-secondary-text)] mb-3">
          {t("recTitle")}
        </h2>

        <p
          className={`max-w-xl mx-auto text-base md:text-base leading-relaxed ${
            darkMode ? "text-slate-400" : "text-gray-600"
          }`}
        >
          {t("recSubtitle")}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <Link
            to="/community/lost-found"
            key={item.id || idx}
            className="no-underline block"
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`h-full backdrop-blur-md rounded-3xl p-5 flex flex-col justify-between transition-colors duration-300 ${
                darkMode
                  ? "bg-zinc-900/90 text-slate-100 hover:border-zinc-700"
                  : "bg-white/95 text-gray-800 hover:shadow-lg"
              }`}
            >
              <div>
                <div
                  className={`relative h-48 rounded-2xl overflow-hidden mb-4 ${
                    darkMode ? "bg-zinc-950" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`absolute top-3 left-3 z-10 text-base font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.statusBg} shadow-md`}
                  >
                    {item.status}
                  </span>
                  <img
                    src={item.img}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      if (item.fallbackImg)
                        e.currentTarget.src = item.fallbackImg;
                    }}
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                  />
                </div>

                <div
                  className={`flex items-center justify-between text-base mb-2 ${
                    darkMode ? "text-slate-400" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`flex items-center gap-1 font-medium truncate max-w-[180px] ${
                      darkMode ? "text-slate-300" : "text-gray-500"
                    }`}
                  >
                    <MapPinIcon className="w-3.5 h-3.5 text-[var(--home-secondary-text)] flex-shrink-0" />
                    {item.location}
                  </span>
                  <span className="flex-shrink-0">{item.date}</span>
                </div>

                <h3
                  className={`text-base font-bold mb-1.5 leading-snug line-clamp-1 ${
                    darkMode ? "text-slate-100" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`text-base leading-relaxed mb-6 line-clamp-2 ${
                    darkMode ? "text-slate-400" : "text-gray-600"
                  }`}
                >
                  {item.desc}
                </p>
              </div>

              <div
                className={`flex items-center justify-between pt-4 border-t ${
                  darkMode ? "border-zinc-800" : "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className={`w-7 h-7 rounded-full object-cover border ${
                      darkMode ? "border-zinc-700" : "border-gray-200"
                    }`}
                  />
                  <span
                    className={`text-base font-medium truncate max-w-[120px] ${
                      darkMode ? "text-slate-300" : "text-gray-700"
                    }`}
                  >
                    {item.author}
                  </span>
                </div>

                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`text-base font-semibold px-3.5 py-1.5 rounded-full transition ${
                    darkMode
                      ? "bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900/80"
                      : "bg-emerald-50 text-[var(--color-brand-accent)] hover:bg-emerald-100"
                  }`}
                >
                  {t("recVerifyBtn")}
                </motion.span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
