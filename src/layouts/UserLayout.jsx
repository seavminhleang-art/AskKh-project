import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/common/Sidebar";
import WorkspaceTopbar from "./WorkspaceTopbar";
import "../pages/user/workspace.css";

export default function UserLayout({ mode = "user" }) {
  const [collapsed, setCollapsed] = useState(false);
  if (mode === "admin") {
    return (
      <div className="admin-workspace min-h-screen flex text-slate-100">
        <Sidebar mode="admin" />
        <div className="min-w-0 flex-1 w-full">
          <WorkspaceTopbar mode="admin" />
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`user-workspace uw-shell ${collapsed ? "sidebar-collapsed" : ""}`}
    >
      <Sidebar mode={mode} />
      <div className="uw-shell-content">
        <WorkspaceTopbar
          mode={mode}
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
