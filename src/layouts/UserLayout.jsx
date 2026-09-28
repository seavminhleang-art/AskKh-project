import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/common/Sidebar";
import WorkspaceTopbar from "./WorkspaceTopbar";
import { usePageSEO } from "../Components/common/SEO";
import { useRealtimeNotifications } from "../features/notifications/useRealtimeNotifications.jsx";

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);
  // Establish WebSocket connection for real-time claim approve/reject notifications
  useRealtimeNotifications();

  usePageSEO({
    title: "User Dashboard | NEXA",
    description: "Manage your personal questions, answers, lost & found reports, and notifications on NEXA.",
    noIndex: true,
  });

  return (
    <div
      className={`user-workspace uw-shell text-sm ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar />
      <div className="uw-shell-content">
        <WorkspaceTopbar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((value) => !value)}
        />
        <main className="uw-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
