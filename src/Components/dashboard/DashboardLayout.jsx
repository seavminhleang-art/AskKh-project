import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import DashboardFooter from './Footer/DashboardFooter';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');

  return (
    <div className="min-h-screen flex bg-[#f5f7f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* 1. Left Vertical Sidebar (~185px) */}
      <Sidebar
        activeItem={activeNavItem}
        onSelectItem={(item) => setActiveNavItem(item)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Area (Top Header + Dashboard Content) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* 3. Main Dashboard Content */}
        <main className="flex-1 p-4 sm:p-5 lg:p-6 min-w-0 overflow-y-auto">
          <div className="max-w-[1380px] mx-auto space-y-5">
            {children}
            <DashboardFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
