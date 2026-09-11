import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Icons from "lucide-react";
import { ChevronDown, X, ArrowRightFromLine, Circle } from "lucide-react";
import { NAV_ITEMS } from "../../utils/constants";
import { closeMobileSidebar } from "../../feature/ui/uiSlice";
import { logout, selectCurrentUser } from "../../feature/auth/authSlice";
import Avatar from "../common/Avatar";

// NOTE: update NAV_ITEMS in ../../utils/constants to the 7 items used here,
// each with a `path`, `label`, and `icon` (a lucide-react icon name), e.g.:
//   { path: "/", label: "Dashboard", icon: "LayoutGrid" }
//   { path: "/moderation", label: "Moderation", icon: "ShieldAlert" }
//   { path: "/location", label: "Location", icon: "MapPin" }
//   { path: "/claim-log", label: "Claim Log", icon: "ClipboardList" }
//   { path: "/leaderboard", label: "Leaderboard", icon: "Trophy" }
//   { path: "/users", label: "User Management", icon: "Users" }
//   { path: "/settings", label: "Setting", icon: "Settings" }

function NavIcon({ name, className }) {
  const Icon = Icons[name] ?? Circle;
  return <Icon className={className} />;
}

function SidebarContent({ collapsed, onNavigate }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <>
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-100 px-4 dark:border-gray-700">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white dark:bg-white dark:text-gray-900">
          N
        </div>
        {!collapsed && (
          <>
            <span className="truncate text-[15px] font-semibold text-gray-900 dark:text-white">
              NEXA
            </span>
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-gray-400" />
          </>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                      : "text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`
                }
              >
                <NavIcon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-3 dark:border-gray-700">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-full bg-gray-50 px-2.5 py-2 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Avatar name={user?.displayName ?? user?.email} />
          {!collapsed && <span className="text-sm font-medium">Log out</span>}
          {!collapsed && (
            <ArrowRightFromLine className="ml-auto h-4 w-4 text-gray-400" />
          )}
        </button>
      </div>
    </>
  );
}

export default function Sidebar() {
  const collapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const mobileOpen = useSelector((state) => state.ui.mobileSidebarOpen);
  const dispatch = useDispatch();

  return (
    <>
      <aside
        className={`hidden shrink-0 flex-col border-r border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-900 md:flex ${
          collapsed ? "w-16" : "w-60"
        } transition-all duration-150`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>


      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex w-64 flex-col bg-white dark:bg-gray-900">
            <div className="flex justify-end px-2 pt-2">
              <button
                type="button"
                onClick={() => dispatch(closeMobileSidebar())}
                aria-label="Close menu"
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              collapsed={false}
              onNavigate={() => dispatch(closeMobileSidebar())}
            />
          </div>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="flex-1 bg-black/30"
            onClick={() => dispatch(closeMobileSidebar())}
          />
        </div>
      )}
    </>
  );
}
