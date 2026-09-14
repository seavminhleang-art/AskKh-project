import React from 'react';
import { useLocation } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import SidebarItem from './SidebarItem';
import UserAccount from './UserAccount';
import HelpCenterCard from './HelpCenterCard';
import { navigationSections, isNavItemActive } from '../../constants/navigation';
import { useLanguage } from '../../hooks/useLanguage';

export default function Sidebar({ mobileOpen = false, onCloseMobile }) {
  const location = useLocation();
  const { t } = useLanguage();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-3 px-2.5 overflow-y-auto">
      <div className="space-y-2">
        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Search className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                AskKH
              </span>
              <span className="text-[16px] text-slate-400 dark:text-slate-500 font-medium truncate">
                {t('navigation.lostFoundCommunity')}
              </span>
            </div>
          </div>

          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close navigation sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav aria-label="Main Navigation" className="space-y-3">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {section.sectionKey ? t(section.sectionKey) : section.title}
              </div>
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isActive={isNavItemActive(location.pathname, item)}
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                  }}
                />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Account & Help Center Card */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
        <UserAccount />
        <HelpCenterCard />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed / Sticky Sidebar (approx 185px wide) */}
      <aside
        aria-label="Sidebar Navigation"
        className="hidden md:block w-[185px] shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen sticky top-0 z-30"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside
            aria-label="Mobile Navigation Drawer"
            className="relative w-[210px] max-w-[80vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full shadow-2xl z-50"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
