import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import DashboardFooter from './Footer/DashboardFooter';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');

  return (
    <div className="min-h-screen w-full max-w-full flex bg-[#f5f7f9] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-x-hidden">
      {/* 1. Left Vertical Sidebar (~185px) */}
      <Sidebar
        activeItem={activeNavItem}
        onSelectItem={(item) => setActiveNavItem(item)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Area (Top Header + Dashboard Content) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen max-w-full overflow-x-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* 3. Main Dashboard Content */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1380px] mx-auto space-y-5">
            {children}
            <DashboardFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
