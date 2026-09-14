import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "../../../hooks/useLanguage";

export default function SearchBar({ autoFocus = false }) {
  const [query, setQuery] = useState("");
  const { t } = useLanguage();

  return (
    <div className="relative w-full max-w-[440px]">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("common.searchPlaceholder")}
        autoFocus={autoFocus}
        className="w-full h-[34px] pl-8 pr-7 text-lg rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-1.5 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          aria-label={t("common.clear")}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
