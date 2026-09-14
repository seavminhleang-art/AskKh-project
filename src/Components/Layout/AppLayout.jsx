import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
// import Header from '../dashboard/Header/Header';
// import DashboardFooter from '../dashboard/Footer/DashboardFooter';

export default function AppLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full max-w-full flex bg-brand-canvas dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-x-hidden">
      {/* 1. Left Vertical Sidebar (~185px) */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Area (Top Header + Content + Footer) */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen max-w-full overflow-x-hidden">
        <Header onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* 3. Main Content Container */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 min-w-0 max-w-full overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1380px] mx-auto space-y-5">
            {children || <Outlet />}
            <DashboardFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
