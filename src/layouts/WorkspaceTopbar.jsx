import WorkspaceProfileMenu from "../Components/common/WorkspaceProfileMenu";
import WorkspaceLanguageSwitcher from "../Components/common/WorkspaceLanguageSwitcher";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useState } from "react";
import Sidebar from "../Components/common/Sidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useTheme } from "../context/ThemeContext";
import { useWorkspaceDataQuery } from "../features/workspace/workspaceApi";
export default function WorkspaceTopbar({
  mode = "user",
  collapsed = false,
  onToggleSidebar,
}) {
  const { w } = useWorkspaceTranslation();
  const [menuPath, setMenuPath] = useState(null);
  const { pathname } = useLocation();
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open) => setMenuPath(open ? pathname : null);
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const storedUser = useSelector((state) => state.auth.user);
  const profile = useWorkspaceDataQuery({
    resource: "profile",
  });
  const apiUser = profile.data?.data ?? profile.data;
  const user = {
    ...storedUser,
    ...(apiUser || {}),
    profileImage:
      apiUser?.profileImage ||
      apiUser?.avatar ||
      apiUser?.photoURL ||
      apiUser?.image ||
      storedUser?.profileImage ||
      storedUser?.avatar ||
      storedUser?.photoURL,
  };
  const unread = useWorkspaceDataQuery({
    resource: "unread",
  });
  return (
    <header className="uw-topbar">
      <Link
        to="/"
        className="flex items-center gap-2 md:hidden"
        title={w("Home")}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <LayoutDashboard size={21} />
        </span>
        <span className="font-bold">ASKKH</span>
      </Link>
      <button
        className="uw-desktop-toggle"
        aria-label={w("Toggle sidebar")}
        aria-expanded={!collapsed}
        onClick={onToggleSidebar}
      >
        <Menu size={18} />
      </button>
      <form
        className="uw-top-search"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(
            `/dashboard/questions?search=${encodeURIComponent(new FormData(event.currentTarget).get("search"))}`,
          );
        }}
      >
        <Search size={17} />
        <input
          name="search"
          aria-label={w("Search community questions")}
          placeholder={w("Search community questions\u2026")}
          className="min-w-0 flex-1 bg-transparent text-base outline-none"
        />
      </form>
      <div className="workspace-topbar-actions">
        <button
          className="workspace-icon-button"
          aria-label={darkMode ? w("Use light theme") : w("Use dark theme")}
          onClick={toggleTheme}
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <WorkspaceLanguageSwitcher />
        <Link
          to="/dashboard/notifications"
          aria-label={w("Notifications{{value0}}", {
            value0: unread.data?.unreadCount
              ? w(", {{value0}} unread", {
                  value0: unread.data.unreadCount,
                })
              : "",
          })}
          className="workspace-icon-button relative"
        >
          <Bell size={20} />
          {unread.data?.unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Link>
        <WorkspaceProfileMenu user={user} mode={mode} />
        <button
          type="button"
          className="workspace-icon-button md:hidden"
          aria-label={w("Toggle workspace navigation")}
          aria-expanded={menuOpen}
          aria-controls="workspace-mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {menuOpen && (
        <div
          id="workspace-mobile-menu"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b bg-[var(--bg-card)] md:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape") setMenuOpen(false);
          }}
        >
          <Sidebar mode={mode} mobile />
        </div>
      )}
    </header>
  );
}
