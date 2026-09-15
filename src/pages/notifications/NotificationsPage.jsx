import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Trash2,
  Settings,
  ChevronRight,
  Info,
} from "lucide-react";
import { sampleNotifications } from "../../data/notificationData";
import { useLanguage } from "../../context/LanguageContext";

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState("ALL");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.isRead;
    return true;
  });

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {t("notifications.title", "Notifications")}
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-lg font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                {unreadCount} {t("notifications.unread", "unread")}
              </span>
            )}
          </div>
          <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t(
              "notifications.description",
              "Claim-match alerts and property recovery updates for your claims.",
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#102A56] dark:text-blue-400" />
              <span>{t("notifications.markAllRead", "Mark all read")}</span>
            </button>
          )}

          <Link
            to="/settings"
            className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notification Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Specific Policy Notice */}
      <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl flex items-start gap-2.5 text-lg text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-[#102A56] dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-white">
            Claim-Match Policy:
          </strong>{" "}
          Notifications are reserved strictly for claim-match alerts and
          verification updates related to your lost or found items. General
          forum posts and community activities do not generate push
          notifications.
        </p>
      </div>

      {/* Filter Tabs */}
      <nav
        aria-label="Notification Filters"
        className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none"
      >
        {[
          {
            id: "ALL",
            label: `${t("notifications.all", "All Claim Matches")} (${notifications.length})`,
          },
          {
            id: "UNREAD",
            label: `${t("notifications.unread", "Unread")} (${unreadCount})`,
          },
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

      {/* Notification List */}
      <main className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-2xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t("notifications.noNotifications", "No claim notifications")}
            </h3>
            <p className="text-lg text-slate-500">
              {t(
                "notifications.claimMatched",
                "You will receive alerts here when a reported item matches one of your active claims.",
              )}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <article
              key={notif.id}
              className={`p-4 transition-colors flex items-start gap-3.5 group ${
                !notif.isRead
                  ? "bg-blue-50/40 dark:bg-blue-950/20"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {/* Type Icon */}
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200/60 dark:border-blue-900/40 text-[#102A56] dark:text-blue-300">
                <Sparkles className="w-4 h-4 text-[#16803C]" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                    {notif.title}
                  </h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#102A56] dark:bg-blue-400 shrink-0" />
                  )}
                  {notif.matchScore && (
                    <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#16803C] border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {notif.matchScore} {t("matchCenter.confidence", "Match")}
                    </span>
                  )}
                </div>

                <p className="text-lg text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {notif.description}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[16px] text-slate-400">
                    {notif.time}
                  </span>
                  <Link
                    to={notif.link}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="inline-flex items-center gap-1 text-[16px] font-semibold text-[#102A56] dark:text-blue-400 hover:underline"
                  >
                    <span>{t("claims.viewItem", "View matched claim")}</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {/* Footer Clear action */}
      {filteredNotifications.length > 0 && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleClearAll}
            className="inline-flex items-center gap-1.5 text-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {t("notifications.clearAll", "Clear notification list")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
