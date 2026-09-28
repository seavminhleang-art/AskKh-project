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
import { useAppDispatch } from "../../hooks/useAppStore";
import { logout } from "../../store/slices/authSlice";
import { useLogoutApiMutation } from "@/features/auth/authApi";
import { baseApi } from "../../store/api/baseApi";
export default function Sidebar({ mobile = false }) {
  const { w } = useWorkspaceTranslation();
  const indicatorId = useId();
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutApiMutation();
  const dispatch = useAppDispatch();
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
              <h2 className="text-base">{w(label)}</h2>
              {items.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/dashboard"}
                  className={({ isActive }) =>
                    `text-base ${isActive ? "active" : ""}`
                  }
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
      <button className="uw-signout text-base" onClick={handleLogout}>
        <LogOut size={17} />
        {w("Sign Out")}
      </button>
    </aside>
  );
}
