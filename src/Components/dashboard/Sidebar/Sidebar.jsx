import React from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo';
import NavigationSection from './NavigationSection';
import UserProfile from './UserProfile';
import HelpCard from './HelpCard';
import { navigationSections } from '../../../constants/navigation';

export default function Sidebar({
  activeItem = 'Dashboard',
  onSelectItem,
  mobileOpen = false,
  onCloseMobile,
}) {
  const location = useLocation();

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between py-3 px-2.5 overflow-y-auto">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Logo />
          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="space-y-0.5">
          {navigationSections.map((sec) => (
            <NavigationSection
              key={sec.title}
              title={sec.title}
              sectionKey={sec.sectionKey}
              items={sec.items}
              activeItem={activeItem}
              location={location}
              onSelect={(id) => {
                if (onSelectItem) onSelectItem(id);
                if (onCloseMobile) onCloseMobile();
              }}
            />
          ))}
        </nav>
      </div>

      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
        <UserProfile />
        <HelpCard />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (approx 185px wide) */}
      <aside className="hidden md:block w-[185px] shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[210px] max-w-[80vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full shadow-2xl z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
