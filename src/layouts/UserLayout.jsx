import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/common/Sidebar';
import WorkspaceTopbar from './WorkspaceTopbar';
import PageBackground from '../Components/common/PageBackground';

export default function UserLayout({ mode = 'user', dashboardPath = '/dashboard' }) {
  return (
    <div className="shared-page min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <PageBackground />
      <WorkspaceTopbar mode={mode} />
      <div className="flex-1 flex w-full min-h-0">
        <Sidebar mode={mode} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
