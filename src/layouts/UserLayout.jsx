import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/common/Sidebar";
import WorkspaceTopbar from "./WorkspaceTopbar";
import { usePageSEO } from "../Components/common/SEO";

export default function UserLayout() {
  const [collapsed, setCollapsed] = useState(false);

  usePageSEO({
    title: "User Dashboard | NEXA",
    description: "Manage your personal questions, answers, lost & found reports, and notifications on NEXA.",
    noIndex: true,
  });

  return (
    <div
      className={`user-workspace uw-shell ${collapsed ? "sidebar-collapsed" : ""}`}
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
