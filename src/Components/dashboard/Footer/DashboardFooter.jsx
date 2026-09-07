import React from 'react';

export default function DashboardFooter() {
  return (
    <footer className="pt-6 pb-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
      <div>
        <p>© 2024 ISTAD Lost & Found Platform. All rights reserved.</p>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="#guidelines"
          onClick={(e) => e.preventDefault()}
          className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Community Guidelines
        </a>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <a
          href="#privacy"
          onClick={(e) => e.preventDefault()}
          className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Privacy Policy
        </a>
        <span className="text-slate-300 dark:text-slate-700">•</span>
        <a
          href="#about"
          onClick={(e) => e.preventDefault()}
          className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          About Us
        </a>
      </div>
    </footer>
  );
}
