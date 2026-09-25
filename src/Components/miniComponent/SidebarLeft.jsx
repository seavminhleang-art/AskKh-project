import React from "react";
import { Search, Bookmark, Heart } from "lucide-react";
import { Hash } from "lucide-react";
import { useGetPopularTagsQuery } from "../../features/tags/tagApi";
import { rowsOf } from "../../features/qa/model";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SidebarLeft = ({
  onSelectTag,
  activeTab,
  setActiveTab,
  savedCount,
  posts = [],
  darkMode: propDarkMode,
}) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const query = useGetPopularTagsQuery();

  const tagCountsFromPosts = React.useMemo(() => {
    const counts = {};
    (posts || []).forEach((post) => {
      const tagList =
        post.tags ||
        (post.tagResponses ? post.tagResponses.map((t) => t.tagName) : []);
      tagList.forEach((tag) => {
        if (tag) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      });
    });
    return counts;
  }, [posts]);

  const rawTags = rowsOf(query.data);

  const tagsList = [];
  if (rawTags.length > 0) {
    rawTags.forEach((tag) => {
      const tagName = tag.tagName || tag.name || (typeof tag === "string" ? tag : "");
      if (!tagName) return;
      const count = tagCountsFromPosts[tagName] ?? tag.count ?? 0;
      tagsList.push({
        name: tagName,
        countValue: count,
        count: `${count} ${count === 1 ? "post" : "posts"}`,
      });
    });
  }

  Object.entries(tagCountsFromPosts).forEach(([tagName, count]) => {
    if (!tagsList.some((t) => t.name === tagName)) {
      tagsList.push({
        name: tagName,
        countValue: count,
        count: `${count} ${count === 1 ? "post" : "posts"}`,
      });
    }
  });

  const tags = tagsList
    .sort((a, b) => b.countValue - a.countValue)
    .slice(0, 8)
    .map((tag) => ({
      ...tag,
      icon: Hash,
    }));

  return (
    <aside className="w-full min-w-0 space-y-6">
      {/* Navigation Card */}
      <div
        className={`rounded-2xl p-2.5 space-y-1.5 transition-colors ${
          darkMode ? "bg-zinc-900" : "bg-white"
        }`}
      >
        {/* Newest Button */}
        <button
          onClick={() => setActiveTab("newest")}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${
            activeTab === "newest"
              ? "bg-blue-600 text-white"
              : darkMode
                ? "text-slate-300 hover:bg-zinc-800"
                : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div
            className={`p-2 rounded-lg ${
              activeTab === "newest"
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "bg-emerald-950/60 text-emerald-400"
                  : "bg-green-100 text-emerald-600"
            }`}
          >
            <Search className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-base">{t("nav.newest")}</p>
            <p
              className={`text-base ${
                activeTab === "newest"
                  ? "text-blue-100"
                  : darkMode
                    ? "text-zinc-400"
                    : "text-gray-400"
              }`}
            >
              {t("nav.newestDesc")}
            </p>
          </div>
        </button>

        {/* Bookmarks Button */}
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
            activeTab === "bookmarks"
              ? "bg-blue-600 text-white"
              : darkMode
                ? "text-slate-300 hover:bg-zinc-800"
                : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                activeTab === "bookmarks"
                  ? "bg-blue-500 text-white"
                  : darkMode
                    ? "bg-amber-950/60 text-amber-400"
                    : "bg-amber-100 text-amber-600"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-base">{t("nav.bookmarks")}</p>
              <p
                className={`text-base ${
                  activeTab === "bookmarks"
                    ? "text-blue-100"
                    : darkMode
                      ? "text-zinc-400"
                      : "text-gray-400"
                }`}
              >
                {t("nav.bookmarksDesc")}
              </p>
            </div>
          </div>
          {savedCount > 0 && (
            <span
              className={`text-base font-bold px-2 py-0.5 rounded-full ${
                activeTab === "bookmarks"
                  ? "bg-white text-blue-600"
                  : darkMode
                    ? "bg-blue-950/80 text-blue-400 border border-blue-800/50"
                    : "bg-blue-100 text-blue-600"
              }`}
            >
              {savedCount}
            </span>
          )}
        </button>

        {/* Following/Your Post Button */}
        <button
          onClick={() => setActiveTab("following")}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl transition-all ${
            activeTab === "following"
              ? "bg-blue-600 text-white"
              : darkMode
                ? "text-slate-300 hover:bg-zinc-800"
                : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <div
            className={`p-2 rounded-lg ${
              activeTab === "following"
                ? "bg-blue-500 text-white"
                : darkMode
                  ? "bg-orange-950/60 text-orange-400"
                  : "bg-orange-100 text-orange-600"
            }`}
          >
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-base">{t("nav.yourPost")}</p>
            <p
              className={`text-base ${
                activeTab === "following"
                  ? "text-blue-100"
                  : darkMode
                    ? "text-zinc-400"
                    : "text-gray-400"
              }`}
            >
              {t("nav.yourPostDesc")}
            </p>
          </div>
        </button>
      </div>

      {/* Popular Tags Card */}
      <div
        className={`rounded-2xl p-4 transition-colors ${
          darkMode ? "bg-zinc-900" : "bg-white"
        }`}
      >
        <h3
          className={`font-bold text-base mb-3 ${darkMode ? "text-slate-200" : "text-gray-800"}`}
        >
          {t("sidebar.popularTags")}
        </h3>
        {query.isLoading && (
          <p role="status" className="text-base">
            Loading tags…
          </p>
        )}
        {query.isError && (
          <button className="text-base" onClick={query.refetch}>
            Retry loading tags
          </button>
        )}
        <div className="space-y-3">
          {tags.map((tag, idx) => {
            const IconComponent = tag.icon;
            return (
              <button
                type="button"
                onClick={() => onSelectTag?.(tag.name)}
                key={idx}
                className="flex w-full text-left items-center space-x-3 cursor-pointer group"
              >
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-zinc-800 text-zinc-400 group-hover:bg-blue-950/50 group-hover:text-blue-400"
                      : "bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p
                    className={`text-base font-bold transition-colors ${
                      darkMode
                        ? "text-slate-200 group-hover:text-blue-400"
                        : "text-gray-800 group-hover:text-blue-600"
                    }`}
                  >
                    {tag.name}
                  </p>
                  <p
                    className={`text-base ${darkMode ? "text-zinc-400" : "text-gray-400"}`}
                  >
                    {tag.count}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default SidebarLeft;
