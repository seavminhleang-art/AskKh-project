import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

export default function LanguageSwitcher({ className = "" }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`h-10 px-3.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#667085] hover:text-[#111827] dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2 text-lg font-semibold cursor-pointer select-none ${className}`}
      aria-label="Switch Language"
      title="Switch Language (KH / EN)"
    >
      <Globe className="w-4 h-4 text-[#667085] dark:text-slate-400" />
      <span className="tracking-wide">
        {language === "en" ? "EN / ខ្មែរ" : "ខ្មែរ / EN"}
      </span>
    </button>
  );
}
