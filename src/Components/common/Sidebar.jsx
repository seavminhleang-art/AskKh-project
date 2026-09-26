import BrandLogo from "@/Components/common/BrandLogo";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import React, { useId } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Settings,
  Bookmark,
  Sparkles,
  Bell,
  User,
  HelpCircle,
  Search,
  BarChart3,
  LogOut,
} from "lucide-react";
import Avatar from "../ui/Avatar";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppStore";
import { logout } from "../../store/slices/authSlice";
import { useLogoutApiMutation } from "@/features/auth/authApi";
import { baseApi } from "../../store/api/baseApi";
import { useWorkspaceDataQuery } from "../../features/workspace/workspaceApi";
import { profileImageUrl, resolveUserAvatar } from "../../features/workspace/profileImage";
import { cn } from "@/lib/utils";
export default function Sidebar({ mode = "user", mobile = false }) {
  const { w } = useWorkspaceTranslation();
  const indicatorId = useId();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutApiMutation();
  const dispatch = useAppDispatch();
  const { user: storedUser, role } = useAppSelector((state) => state.auth);
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
  const userNavItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Activity",
      path: "/dashboard/activity",
      icon: BarChart3,
    },
    {
      label: "Questions",
      path: "/dashboard/questions",
      icon: HelpCircle,
    },
    {
      label: "Lost & Found",
      path: "/dashboard/lost-found",
      icon: Search,
    },
    {
      label: "Smart Matches",
      path: "/dashboard/matches",
      icon: Sparkles,
    },
    {
      label: "My Claims",
      path: "/dashboard/claims",
      icon: Bookmark,
    },
    {
      label: "Notifications",
      path: "/dashboard/notifications",
      icon: Bell,
    },
    {
      label: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];
  const adminNavItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
  ];
  const navItems = mode === "admin" ? adminNavItems : userNavItems;
  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      await logoutApi();
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate("/login");
    }
  };
  if (mode === "user") {
    const groups = [
      ["Overview", userNavItems.slice(0, 3)],
      [
        "Ask & Help",
        [
          {
            ...userNavItems[3],
            label: "Q & A",
          },
        ],
      ],
      [
        "Lost & Found",
        [
          userNavItems[4],
          {
            ...userNavItems[5],
            label: "Match Center",
          },
          userNavItems[6],
        ],
      ],
      ["Workspace", userNavItems.slice(7)],
    ];
    return (
      <aside className={`uw-sidebar ${mobile ? "is-mobile" : ""}`}>
        {!mobile && (
          <NavLink to="/" className="uw-brand" title={w("Home")}>
            <BrandLogo
              alt="NEXA"
              style={{ width: 168, height: 56, objectFit: "contain" }}
            />
          </NavLink>
        )}
        <LayoutGroup id={indicatorId}>
          <nav aria-label={w("Workspace")}>
            {groups.map(([label, items]) => (
              <section key={label}>
                <h2>{w(label)}</h2>
                {items.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/dashboard"}
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            className="uw-nav-indicator"
                            layoutId="active-navigation"
                            aria-hidden="true"
                            initial={false}
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : {
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 36,
                                  }
                            }
                          />
                        )}
                        <Icon size={17} strokeWidth={1.5} />
                        <span className="uw-nav-label">{w(label)}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </section>
            ))}
          </nav>
        </LayoutGroup>
        <button className="uw-signout" onClick={handleLogout}>
          <LogOut size={17} />
          {w("Sign Out")}
        </button>
      </aside>
    );
  }
  return (
    <aside
      className={cn(
        mobile
          ? "w-full flex flex-col gap-6 p-4"
          : "w-56 lg:w-64 shrink-0 hidden md:flex flex-col min-h-screen p-4 justify-between transition-colors",
        mode === "admin"
          ? "admin-sidebar"
          : "border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md",
      )}
    >
      <div className="space-y-6">
        {mode === "admin" && (
          <div className="flex items-center gap-3 px-2 pt-2">
            <span className="admin-brand-mark">N</span>
            <div>
              <p className="text-base font-black tracking-wide text-white">
                NEXA
              </p>
              <p className="text-base font-bold uppercase tracking-[.18em] text-indigo-400">
                {w("Administration")}
              </p>
            </div>
          </div>
        )}

        {/* User / Admin Mini Profile Badge */}
        {user && (
          <div
            className={cn(
              "p-3.5 rounded-2xl border flex items-center gap-3",
              mode === "admin"
                ? "admin-profile"
                : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/60 dark:border-slate-800",
            )}
          >
            <Avatar
              src={resolveUserAvatar(user)}
              name={user.displayName || user.name}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-base font-bold truncate",
                  mode === "admin"
                    ? "text-white"
                    : "text-slate-900 dark:text-white",
                )}
              >
                {user.displayName || user.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-base font-extrabold uppercase",
                    mode === "admin"
                      ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      : "bg-blue-500/15 text-blue-600 dark:text-blue-400",
                  )}
                >
                  {role}
                </span>
                <span className="text-base text-slate-500 dark:text-slate-400 font-medium">
                  {user.reputation != null
                    ? w("{{value0}} pts", {
                        value0: user.reputation,
                      })
                    : w("Member")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Section Label */}
        <div>
          <p
            className={cn(
              "px-3 text-base font-extrabold uppercase tracking-wider mb-2",
              mode === "admin"
                ? "text-slate-400"
                : "text-slate-400 dark:text-slate-500",
            )}
          >
            {mode === "admin"
              ? w("Campus Administration")
              : w("Member Workspace")}
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={
                    item.path === "/admin/dashboard" ||
                    item.path === "/dashboard"
                  }
                  className={({ isActive }) =>
                    cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-base font-semibold transition-all select-none",
                      isActive
                        ? mode === "admin"
                          ? "admin-nav-active font-bold"
                          : "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-bold"
                        : mode === "admin"
                          ? "admin-nav-idle"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60",
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-base font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-3.5 py-2 text-base font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{w("Sign Out")}</span>
        </button>
      </div>
    </aside>
  );
}
