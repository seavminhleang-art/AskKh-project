import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../hooks/useLanguage';

export default function HelpCard() {
  const { t } = useLanguage();

  return (
    <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
      <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-300">
        <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <h4 className="text-lg font-bold leading-tight">{t('navigation.needHelp')}</h4>
      </div>
      <p className="text-[16px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
        {t('navigation.helpDesc')}
      </p>
      <Link
        to="/settings"
        className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-[16px] font-semibold transition-all shadow-2xs flex items-center justify-center gap-1 cursor-pointer select-none"
      >
        <span>{t('navigation.helpCenter')}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
