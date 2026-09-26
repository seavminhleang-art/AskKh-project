import { profileImageUrl, resolveUserAvatar, getCachedAvatar } from "../../features/workspace/profileImage";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ChevronDown,
  LayoutDashboard,
  UserRound,
  LogOut,
  Home,
} from "lucide-react";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { logout } from "../../store/slices/authSlice";
import { useLogoutApiMutation } from "@/features/auth/authApi";
import { baseApi } from "../../store/api/baseApi";

export default function WorkspaceProfileMenu({ user, mode = "user" }) {
  const { w } = useWorkspaceTranslation();
  const ref = useRef(null);
  const hoverTimer = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutApiMutation();
  const [photoError, setPhotoError] = useState(false);

  const name = user?.displayName || user?.name || w("My profile");
  const cached = getCachedAvatar(user?.id);
  const userCandidate = {
    ...user,
    profileImage: photoError ? null : user?.profileImage,
    avatar: user?.avatar || cached || user?.photoURL,
  };
  const photo = resolveUserAvatar(userCandidate);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const outside = (event) => {
      if (ref.current && !ref.current.contains(event.target))
        ref.current.open = false;
    };
    const escape = (event) => {
      if (event.key === "Escape" && ref.current?.open) {
        ref.current.open = false;
        ref.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
      clearTimeout(hoverTimer.current);
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(hoverTimer.current);
    if (ref.current) ref.current.open = true;
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      if (ref.current) ref.current.open = false;
    }, 180);
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    if (ref.current) ref.current.open = false;
    try {
      await logoutApi();
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate("/login");
    }
  };

  useEffect(() => {
    setPhotoError(false);
  }, [user?.profileImage, user?.avatar]);

  return (
    <details
      className="workspace-profile"
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <summary aria-label={w("My profile")}>
        <span className="workspace-profile-avatar">
          {photo ? (
            <img
              src={photo}
              alt=""
              onError={() => {
                if (!photoError) setPhotoError(true);
              }}
            />
          ) : (
            initials
          )}
        </span>
        <span className="workspace-profile-name">{name}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </summary>
      <div className="workspace-profile-panel">
        <div className="workspace-profile-info">
          <strong>{name}</strong>
          {user?.email && <span>{user.email}</span>}
        </div>
        <Link
          to="/"
          onClick={() => {
            if (ref.current) ref.current.open = false;
          }}
        >
          <Home size={17} />
          {w("Home")}
        </Link>
        <Link
          to={mode === "admin" ? "/admin/dashboard" : "/dashboard"}
          onClick={() => {
            if (ref.current) ref.current.open = false;
          }}
        >
          <LayoutDashboard size={17} />
          {w("Dashboard")}
        </Link>
        <Link
          to={mode === "admin" ? "/admin/settings" : "/dashboard/profile"}
          onClick={() => {
            if (ref.current) ref.current.open = false;
          }}
        >
          <UserRound size={17} />
          {w("Profile")}
        </Link>
        <button
          type="button"
          className="workspace-profile-logout"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          {w("Log out")}
        </button>
      </div>
    </details>
  );
}

