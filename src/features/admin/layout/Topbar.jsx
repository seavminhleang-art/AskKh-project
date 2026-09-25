import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Menu, Bell, ChevronRight } from "lucide-react";
import Avatar from "@/Components/Admin/common/Avatar";
import Dropdown, { DropdownItem } from "@/Components/Admin/common/Dropdown";
import { setSidebarMobileOpen } from "@/redux/slices/uiSlice";
import { useLogoutApiMutation } from "@/features/auth/authApi";
import { useNotifications } from "@/features/notifications/useNotifications";
import { User, Settings, LogOut } from "lucide-react";

function useBreadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean).slice(1); // drop "admin"
  const title = segments.length ? segments[0].replace(/-/g, " ") : "Dashboard";
  return { title, segments };
}

export default function Topbar() {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutApiMutation();
  const navigate = useNavigate();
  const admin = useSelector((s) => s.auth.admin) || { name: "Admin User" };
  const { title, segments } = useBreadcrumb();
  const { data: notifications } = useNotifications();
  const unread = notifications?.filter((n) => !n.read).length || 0;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 h-16 flex items-center px-4 sm:px-6 gap-4">
      <button
        className="lg:hidden text-gray-500"
        onClick={() => dispatch(setSidebarMobileOpen(true))}
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <div>
        <div className="flex items-center gap-1 text-base text-gray-400">
          <span>Admin</span>
          {segments.map((s, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight size={12} />
              <span className="capitalize">{s.replace(/-/g, " ")}</span>
            </span>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 capitalize">
          {title}
        </h2>
      </div>

      <div className="flex-1" />

      <button
        onClick={() => navigate("/admin/notifications")}
        className="relative text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-secondary text-white text-base flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      <Dropdown
        trigger={
          <button className="flex items-center gap-2 cursor-pointer">
            <Avatar name={admin.name} size={32} />
          </button>
        }
      >
        <DropdownItem icon={User} onClick={() => navigate("/admin/settings")}>
          Profile
        </DropdownItem>
        <DropdownItem
          icon={Settings}
          onClick={() => navigate("/admin/settings")}
        >
          Settings
        </DropdownItem>
        <DropdownItem
          icon={LogOut}
          danger
          onClick={async () => {
            await logoutApi();
            navigate("/login");
          }}
        >
          Logout
        </DropdownItem>
      </Dropdown>
    </header>
  );
}
