import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  MessageSquare,
  Sparkles,
  Bookmark,
  CheckCheck,
  ExternalLink,
  Loader2,
  RefreshCw,
  Volume2,
  VolumeX,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useLanguage } from "../Language/LanguageContext.jsx";
import { ThemeToggle } from "../motion/theme-toggle.jsx";
import { useTranslation } from "react-i18next";
import BrandLogo from "@/Components/common/BrandLogo";
import LanguageFlag from "../common/LanguageFlag";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "../../features/notifications/notificationApi";
import { logout } from "../../store/slices/authSlice";
import { useLogoutApiMutation } from "../../features/auth/authApi";
import { baseApi } from "../../store/api/baseApi";
import { profileImageUrl } from "../../features/workspace/profileImage";
import { notificationTarget } from "../../features/notifications/notificationTarget";

let notificationAudioContext;
function armNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    notificationAudioContext ??= new AudioContextClass();
    if (notificationAudioContext.state === "suspended") {
      notificationAudioContext.resume().catch(() => {});
    }
  } catch {
    // Audio is optional; keep notifications working when the browser blocks it.
  }
}

function playNotificationSound() {
  if (!notificationAudioContext || notificationAudioContext.state !== "running") return;
  const context = notificationAudioContext;
  const now = context.currentTime;
  [880, 1175].forEach((frequency, index) => {
    const start = now + index * 0.13;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.12, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.19);
  });
}

export default function Navbar({
  notificationCount: propNotificationCount = 0,
}) {
  const { language, toggleLanguage, isKhmer } = useLanguage();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const [hoveredItem, setHoveredItem] = useState(null);

  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector(
    (state) => !!state.auth.accessToken || !!state.auth.isAuthenticated,
  );

  const { data: unreadData, isSuccess: unreadCountLoaded } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000,
  });

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(() => {
    try {
      return window.localStorage.getItem("askkh:notification-sound") !== "off";
    } catch {
      return true;
    }
  });
  const notificationRef = useRef(null);

  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    isFetching: notificationsFetching,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery(
    { page: 0, size: 8 },
    {
      skip: !isAuthenticated || !notificationOpen,
      refetchOnMountOrArgChange: true,
      pollingInterval: notificationOpen ? 30000 : 0,
    },
  );

  const [markRead] = useMarkReadMutation();
  const [markAllRead, { isLoading: isMarkingAll }] = useMarkAllReadMutation();

  const rawUnreadCount =
    typeof unreadData === "number"
      ? unreadData
      : (unreadData?.unreadCount ?? unreadData?.count ?? propNotificationCount);
  const notificationCount = isAuthenticated ? rawUnreadCount : 0;

  const navItems = useMemo(
    () => [
      { label: t("home"), to: "/" },
      {
        label: t("community"),
        dropdown: [
          { label: t("qaCommunity"), to: "/community/qa" },
          { label: t("lostFoundCommunity"), to: "/community/lost-found" },
        ],
      },
      { label: t("leaderboard"), to: "/leaderboard" },
      { label: t("about"), to: "/about" },
    ],
    [t],
  );

  const [activeItem, setActiveItem] = useState("Home");

  const [communityOpen, setCommunityOpen] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false);

  const [badgeAnimate, setBadgeAnimate] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);

  const [photoFailed, setPhotoFailed] = useState(false);

  const communityRef = useRef(null);

  const profileRef = useRef(null);

  const closeTimer = useRef(null);

  const profileCloseTimer = useRef(null);

  const dispatch = useDispatch();

  const [logoutApi] = useLogoutApiMutation();

  const previousNotificationCount = useRef(notificationCount);
  const hasNotificationBaseline = useRef(false);

  useEffect(() => {
    const armSound = () => armNotificationSound();
    document.addEventListener("pointerdown", armSound, { once: true, capture: true });
    document.addEventListener("keydown", armSound, { once: true, capture: true });
    return () => {
      document.removeEventListener("pointerdown", armSound, true);
      document.removeEventListener("keydown", armSound, true);
    };
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("askkh:notification-sound", notificationSoundEnabled ? "on" : "off");
    } catch {
      // Sound preference is optional when browser storage is unavailable.
    }
  }, [notificationSoundEnabled]);

  const userName = authUser?.displayName || authUser?.name || t("dashboard", "Dashboard");
  const userPhoto = profileImageUrl(
    authUser?.profileImage || authUser?.avatar || authUser?.photoURL,
  );
  const userInitials = (userName || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0])
    .join("")
    .toUpperCase();

  const handleProfileMouseEnter = () => {
    clearTimeout(profileCloseTimer.current);
    setProfileOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileCloseTimer.current = setTimeout(() => {
      setProfileOpen(false);
    }, 180);
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    setProfileOpen(false);
    setMobileOpen(false);
    try {
      await logoutApi();
    } finally {
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      navigate("/login");
    }
  };

  useEffect(() => {
    const current = navItems.find((item) =>
      item.dropdown
        ? item.dropdown.some((sub) => pathname.startsWith(sub.to))
        : item.to === pathname,
    );
    setActiveItem(current?.label ?? null);
    setHoveredItem(null);
    setCommunityOpen(false);
    setMobileOpen(false);
    setProfileOpen(false);
  }, [language, pathname, navItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        communityRef.current &&
        !communityRef.current.contains(event.target)
      ) {
        setCommunityOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setCommunityOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(profileCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = () => {
      if (desktop.matches) {
        setMobileOpen(false);
        setMobileCommunityOpen(false);
      }
    };

    closeOnDesktop();
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const notificationsList = Array.isArray(notificationsData)
    ? notificationsData
    : (notificationsData?.content ?? notificationsData?.data ?? []);

  const handleNotificationClick = (item) => {
    if (!item.read) markRead(item.id);
    setNotificationOpen(false);
    setMobileOpen(false);

    const target = notificationTarget(item);
    if (target) {
      navigate(target);
    } else if (item.type === "COMMENT_ON_POST" || item.type === "POST_VOTE") {
      navigate(item.targetId ? `/dashboard/questions/${item.targetId}` : "/dashboard/questions");
    } else if (item.type === "LOST_FOUND_MATCH") {
      navigate("/dashboard/matches");
    } else if (item.type?.startsWith("LOST_FOUND_CLAIM")) {
      navigate("/dashboard/claims");
    } else {
      navigate("/dashboard/notifications");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "COMMENT_ON_POST":
      case "question_answer":
      case "comment":
        return <MessageSquare size={16} className="text-blue-500 shrink-0" />;
      case "LOST_FOUND_MATCH":
      case "match_found":
      case "POST_VOTE":
        return <Sparkles size={16} className="text-amber-500 shrink-0" />;
      case "LOST_FOUND_CLAIM_SUBMITTED":
      case "LOST_FOUND_CLAIM_APPROVED":
      case "LOST_FOUND_CLAIM_REJECTED":
      case "claim_update":
        return <Bookmark size={16} className="text-emerald-500 shrink-0" />;
      default:
        return <Bell size={16} className="text-indigo-500 shrink-0" />;
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSeconds < 60) return isKhmer ? "អម្បាញ់មិញ" : "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60)
      return isKhmer ? `${diffMinutes} នាទីមុន` : `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return isKhmer ? `${diffHours} ម៉ោងមុន` : `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7)
      return isKhmer ? `${diffDays} ថ្ងៃមុន` : `${diffDays}d ago`;
    return date.toLocaleDateString(isKhmer ? "km-KH" : "en-US", {
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (!unreadCountLoaded) return;
    if (!hasNotificationBaseline.current) {
      previousNotificationCount.current = notificationCount;
      hasNotificationBaseline.current = true;
      return;
    }

    if (notificationCount > previousNotificationCount.current) {
      if (notificationSoundEnabled) playNotificationSound();
      setBadgeAnimate(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setBadgeAnimate(true);
        });
      });

      const timer = window.setTimeout(() => {
        setBadgeAnimate(false);
      }, 650);

      previousNotificationCount.current = notificationCount;

      return () => {
        window.clearTimeout(timer);
      };
    }

    previousNotificationCount.current = notificationCount;
  }, [notificationCount, notificationSoundEnabled, unreadCountLoaded]);

  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);

    setCommunityOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => {
      setCommunityOpen(false);
    }, 150);
  };

  const handleNavClick = (label) => {
    setActiveItem(label);

    setCommunityOpen(false);
    setMobileOpen(false);

    setMobileCommunityOpen(false);
  };

  const linkClasses = (label) =>
    `relative z-10 inline-flex items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary px-4 py-2.5 text-[18px] font-medium transition-colors duration-200 ${
      activeItem === label
        ? "text-brand-primary font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-brand-primary"
    }`;

  const renderPill = (label) =>
    (hoveredItem ?? activeItem) === label && (
      <motion.span
        layoutId="nav-pill"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-brand-primary-light dark:bg-slate-700"
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 35 }
        }
      />
    );

  return (
    <nav
      className="site-navbar font-brand sticky top-0 z-[1000] w-full rounded-b-2xl border border-gray-200 bg-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 no-underline"
          onClick={() => handleNavClick("Home")}
        >
          <BrandLogo
            alt="NEXA"
            className="h-12 w-auto max-w-[160px] object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <LayoutGroup id="main-navigation">
          <ul
            className="m-0 hidden list-none items-center justify-center gap-1 rounded-full border border-gray-200 bg-gray-50/80 p-1.5 dark:border-gray-700 dark:bg-slate-900 xl:flex"
            onMouseLeave={() => setHoveredItem(null)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget))
                setHoveredItem(null);
            }}
          >
            {navItems.map((item) =>
              item.dropdown ? (
                <li
                  key={item.label}
                  ref={communityRef}
                  className="relative"
                  onFocus={() => setHoveredItem(item.label)}
                  onMouseEnter={() => {
                    setHoveredItem(item.label);
                    handleMouseEnter();
                  }}
                  onMouseLeave={handleMouseLeave}
                >
                  {renderPill(item.label)}
                  <button
                    type="button"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setCommunityOpen(false);
                    }}
                    className={linkClasses(item.label)}
                    aria-haspopup="true"
                    aria-expanded={communityOpen}
                    onClick={() => {
                      setActiveItem(item.label);

                      setCommunityOpen((previous) => !previous);
                    }}
                  >
                    {item.label}

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        communityOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    role="menu"
                    className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[240px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex flex-col gap-0.5 transition-all duration-200 ${
                      communityOpen
                        ? "opacity-100 visible translate-y-0 pointer-events-auto"
                        : "opacity-0 invisible -translate-y-1.5 pointer-events-none"
                    }`}
                  >
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.to}
                        role="menuitem"
                        className="block px-3.5 py-2.5 rounded-lg text-base font-medium text-gray-800 dark:text-gray-200 no-underline transition-colors duration-150 hover:bg-brand-secondary-light dark:hover:bg-gray-700 hover:text-brand-secondary"
                        onClick={() => {
                          setCommunityOpen(false);
                          handleNavClick(item.label);
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onFocus={() => setHoveredItem(item.label)}
                >
                  {renderPill(item.label)}
                  <Link
                    to={item.to}
                    className={linkClasses(item.label) + " no-underline"}
                    onClick={() => handleNavClick(item.label)}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </LayoutGroup>

        {/* Right side actions (desktop) */}
        <div className="hidden xl:flex items-center gap-2.5 shrink-0">
          <ThemeToggle
            variant="circle"
            start="top-right"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:bg-brand-primary-light dark:hover:bg-gray-700 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
            iconClassName="h-5 w-5"
          />

          {/* Desktop Notifications Bell & Popover */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:bg-brand-primary-light dark:hover:bg-gray-700 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
              aria-label={t("notificationLabel", "Notifications")}
              aria-expanded={notificationOpen}
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                  return;
                }
                setNotificationOpen((prev) => !prev);
              }}
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <span
                  className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-base font-bold flex items-center justify-center border-2 border-white dark:border-gray-900 transition-transform ${
                    badgeAnimate ? "scale-125" : "scale-100"
                  }`}
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                      {t("notificationLabel", "Notifications")}
                    </h3>
                    {notificationCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-base font-semibold bg-brand-primary-light dark:bg-gray-800 text-brand-primary">
                        {notificationCount} {isKhmer ? "ថ្មី" : "new"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNotificationSoundEnabled((enabled) => !enabled)}
                      className="text-base text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1 transition-colors"
                      aria-label={notificationSoundEnabled ? (isKhmer ? "បិទសំឡេង" : "Mute notification sound") : (isKhmer ? "បើកសំឡេង" : "Enable notification sound")}
                      title={notificationSoundEnabled ? (isKhmer ? "បិទសំឡេង" : "Mute notification sound") : (isKhmer ? "បើកសំឡេង" : "Enable notification sound")}
                    >
                      {notificationSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                    <button
                      type="button"
                      disabled={notificationsFetching}
                      onClick={() => refetchNotifications()}
                      className="text-base text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                      aria-label={isKhmer ? "ផ្ទុកការជូនដំណឹងឡើងវិញ" : "Refresh notifications"}
                      title={isKhmer ? "ផ្ទុកការជូនដំណឹងឡើងវិញ" : "Refresh notifications"}
                    >
                      <RefreshCw size={14} className={notificationsFetching ? "animate-spin" : ""} />
                      {isKhmer ? "ផ្ទុកឡើងវិញ" : "Refresh"}
                    </button>
                    {notificationCount > 0 && (
                      <button
                        type="button"
                        disabled={isMarkingAll}
                        onClick={() => markAllRead()}
                        className="text-base text-brand-primary hover:text-brand-secondary font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <CheckCheck size={14} />
                        {isKhmer ? "អានទាំងអស់" : "Mark all read"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60">
                  {notificationsLoading ? (
                    <div className="py-8 flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Loader2
                        size={22}
                        className="animate-spin text-brand-primary"
                      />
                      <span className="text-base">
                        {isKhmer ? "កំពុងផ្ទុក..." : "Loading notifications..."}
                      </span>
                    </div>
                  ) : notificationsList.length === 0 ? (
                    <div className="py-8 text-center px-4">
                      <Bell
                        size={28}
                        className="mx-auto text-gray-300 dark:text-gray-600 mb-2"
                      />
                      <p className="text-base font-medium text-gray-600 dark:text-gray-300">
                        {isKhmer
                          ? "មិនមានការជូនដំណឹងថ្មីទេ"
                          : "No notifications yet"}
                      </p>
                      <p className="text-base text-gray-400 mt-1">
                        {isKhmer
                          ? "ការជូនដំណឹងនឹងបង្ហាញនៅទីនេះពេលមានសកម្មភាពថ្មី"
                          : "You'll be notified when there's new activity"}
                      </p>
                    </div>
                  ) : (
                    notificationsList.map((item) => {
                      const isUnread = !item.read && !item.isRead;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                            isUnread ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                            {getNotificationIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1">
                              <h4
                                className={`text-base leading-snug truncate ${
                                  isUnread
                                    ? "font-semibold text-gray-900 dark:text-white"
                                    : "font-normal text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {item.title || item.body || item.message || "Notification"}
                              </h4>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1" />
                              )}
                            </div>
                            {(item.body || item.message) && item.title && (
                              <p className="text-base text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                                {item.message}
                              </p>
                            )}
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 block">
                              {formatTimeAgo(item.createdAt || item.date)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-center">
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="text-base font-semibold text-brand-primary hover:text-brand-secondary inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>
                      {isKhmer
                        ? "មើលការជូនដំណឹងទាំងអស់"
                        : "View all notifications"}
                    </span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-brand-primary bg-white dark:bg-gray-800 text-brand-secondary text-base font-semibold transition-all duration-200 hover:bg-brand-primary-light dark:hover:bg-gray-700 hover:-translate-y-0.5"
            aria-label={isKhmer ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
            onClick={toggleLanguage}
          >
            <LanguageFlag isKhmer={isKhmer} />
            <span>{isKhmer ? "EN" : "ខ្មែរ"}</span>
          </button>

          {isAuthenticated ? (
            <div
              className="relative"
              ref={profileRef}
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 h-10 pl-1.5 pr-3.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-base font-semibold transition-all duration-200 hover:border-brand-primary hover:bg-brand-primary-light/50 dark:hover:bg-gray-700 hover:-translate-y-0.5 shadow-xs cursor-pointer select-none"
                aria-label={t("profile", "Profile")}
                aria-haspopup="true"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((prev) => !prev)}
              >
                <span className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs overflow-hidden shrink-0">
                  {userPhoto && !photoFailed ? (
                    <img
                      src={userPhoto}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={() => setPhotoFailed(true)}
                    />
                  ) : (
                    userInitials
                  )}
                </span>
                <span className="max-w-[120px] truncate text-base font-medium">
                  {userName}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Desktop Avatar Profile Dropdown */}
              <div
                role="menu"
                className={`absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl z-50 p-2 flex flex-col gap-1 transition-all duration-200 ${
                  profileOpen
                    ? "opacity-100 visible translate-y-0 pointer-events-auto"
                    : "opacity-0 invisible -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="p-3 border-b border-gray-100 dark:border-gray-800/80 mb-1">
                  <p className="font-semibold text-base text-gray-900 dark:text-white truncate">
                    {userName}
                  </p>
                  {authUser?.email && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {authUser.email}
                    </p>
                  )}
                </div>

                {/* Option 1: Dashboard */}
                <Link
                  to={authUser?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-primary-light dark:hover:bg-gray-800 hover:text-brand-primary transition-colors no-underline"
                  onClick={() => setProfileOpen(false)}
                >
                  <LayoutDashboard size={18} className="text-brand-primary shrink-0" />
                  <span>{t("dashboard", "Dashboard")}</span>
                </Link>

                {/* Option 2: Profile */}
                <Link
                  to={authUser?.role === "admin" ? "/admin/settings" : "/dashboard/profile"}
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-primary-light dark:hover:bg-gray-800 hover:text-brand-primary transition-colors no-underline"
                  onClick={() => setProfileOpen(false)}
                >
                  <User size={18} className="text-brand-primary shrink-0" />
                  <span>{t("profile", "Profile")}</span>
                </Link>

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                {/* Option 3: Logout */}
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer text-left border-none bg-transparent"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="text-red-500 shrink-0" />
                  <span>{t("logout", "Log out")}</span>
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/register"
              className="h-10 px-5.5 inline-flex items-center rounded-full border border-[rgba(255,255,255,0.35)] bg-brand-primary text-white text-base font-semibold no-underline transition-all duration-200 hover:bg-brand-secondary hover:border-brand-secondary hover:-translate-y-0.5"
            >
              {t("getStarted")}
            </Link>
          )}
        </div>

        {/* Mobile / Tablet Actions Header (320px - 1279px) */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
          <ThemeToggle
            variant="circle"
            start="top-right"
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            iconClassName="h-4.5 w-4.5"
          />

          <button
            type="button"
            className="relative inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label={t("notificationLabel", "Notifications")}
            onClick={() => {
              if (!isAuthenticated) {
                navigate("/login");
                return;
              }
              navigate("/dashboard/notifications");
            }}
          >
            <Bell size={18} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-brand-secondary text-white text-xs font-bold flex items-center justify-center border border-white dark:border-gray-900">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-brand-primary shrink-0"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((previous) => !previous)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-navigation"
        inert={!mobileOpen}
        className={`flex flex-col gap-4 [&>*]:shrink-0 bg-white dark:bg-gray-900 text-foreground transition-all duration-300 xl:hidden ${
          mobileOpen
            ? "max-h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-auto px-5 py-5 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl"
            : "max-h-0 overflow-hidden px-5 py-0 border-t border-transparent"
        }`}
      >
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {navItems.map((item) =>
            item.dropdown ? (
              <li
                key={item.label}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <button
                  type="button"
                  className={`w-full flex items-center justify-between bg-transparent border-none text-base py-3.5 px-1 cursor-pointer ${
                    activeItem === item.label
                      ? "text-brand-primary font-semibold"
                      : "text-gray-800 dark:text-gray-200 font-medium"
                  }`}
                  onClick={() => setMobileCommunityOpen((prev) => !prev)}
                >
                  {item.label}
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      mobileCommunityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex flex-col gap-0.5 overflow-hidden transition-all duration-200 ${
                    mobileCommunityOpen ? "max-h-[200px] pb-2.5" : "max-h-0"
                  }`}
                >
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.label}
                      to={sub.to}
                      className="mx-1 my-0.5 px-4 py-2.5 rounded-lg bg-brand-primary-light dark:bg-gray-800 text-gray-800 dark:text-gray-200 no-underline text-base font-medium transition-colors duration-150 hover:bg-brand-secondary-light dark:hover:bg-gray-700 hover:text-brand-secondary"
                      onClick={() => handleNavClick(item.label)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </li>
            ) : (
              <li
                key={item.label}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <Link
                  to={item.to}
                  className={`block py-3.5 px-1 no-underline text-base ${
                    activeItem === item.label
                      ? "text-brand-primary font-semibold"
                      : "text-gray-800 dark:text-gray-200 font-medium"
                  }`}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
          {isAuthenticated && (
            <li className="border-b border-gray-200 dark:border-gray-700">
              <Link
                to="/dashboard"
                className="block py-3.5 px-1 no-underline text-base text-brand-primary font-semibold"
                onClick={() => setMobileOpen(false)}
              >
                {t("dashboard", "Dashboard")}
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Theme + Notification + Language */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle
            variant="circle"
            start="top-right"
            className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            iconClassName="h-5 w-5"
          />

          <Link
            to={isAuthenticated ? "/dashboard/notifications" : "/login"}
            onClick={() => setMobileOpen(false)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label={t("notificationLabel", "Notifications")}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-base font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-brand-primary bg-white dark:bg-gray-800 text-brand-secondary text-base font-semibold"
            aria-label={isKhmer ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
            onClick={toggleLanguage}
          >
            <LanguageFlag isKhmer={isKhmer} />
            <span>{isKhmer ? "EN" : "ខ្មែរ"}</span>
          </button>
        </div>

        {/* Mobile Get Started / User Profile with 3 options */}
        {isAuthenticated ? (
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
              <span className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm overflow-hidden shrink-0">
                {userPhoto && !photoFailed ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={() => setPhotoFailed(true)}
                  />
                ) : (
                  userInitials
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                {authUser?.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {authUser.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                to={authUser?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 h-10 rounded-xl bg-brand-primary text-white font-medium text-base no-underline hover:bg-brand-secondary transition-colors"
              >
                <LayoutDashboard size={16} />
                <span>{t("dashboard", "Dashboard")}</span>
              </Link>
              <Link
                to={authUser?.role === "admin" ? "/admin/settings" : "/dashboard/profile"}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium text-base no-underline hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <User size={16} />
                <span>{t("profile", "Profile")}</span>
              </Link>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 h-10 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-medium text-base hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>{t("logout", "Log out")}</span>
            </button>
          </div>
        ) : (
          <Link
            to="/register"
            onClick={() => setMobileOpen(false)}
            className="flex h-11 w-full items-center justify-center rounded-[10px] bg-brand-primary font-semibold !text-white no-underline hover:bg-brand-secondary hover:!text-white focus:!text-white active:!text-white visited:!text-white dark:!text-white"
          >
            {t("getStarted")}
          </Link>
        )}
      </div>
    </nav>
  );
}
