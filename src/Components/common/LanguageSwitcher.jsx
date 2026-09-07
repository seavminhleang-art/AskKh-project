import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function LanguageSwitcher({ className = '' }) {
  const [lang, setLang] = useState('EN');

  const toggleLanguage = () => {
    const nextLang = lang === 'EN' ? 'KH' : 'EN';
    setLang(nextLang);
    toast.info(`Language switched to ${nextLang === 'KH' ? 'Khmer (ភាសាខ្មែរ)' : 'English'}`);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`h-10 px-3.5 rounded-xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-slate-900 text-[#667085] hover:text-[#111827] dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer select-none ${className}`}
      aria-label="Switch Language"
      title="Switch Language (KH / EN)"
    >
      <Globe className="w-4 h-4 text-[#667085] dark:text-slate-400" />
      <span className="tracking-wide">{lang === 'EN' ? 'KH / EN' : 'EN / KH'}</span>
    </button>
  );
}
