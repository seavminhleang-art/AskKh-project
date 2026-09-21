import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Link, useLocation } from "react-router-dom";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";

import {
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../Language/LanguageContext.jsx";
import { ThemeToggle } from "../motion/theme-toggle.jsx";
import { useTranslation } from "react-i18next";
import nexaLogo from "../../assets/Website/nexa-logo.svg";

function LanguageFlag({ isKhmer }) {
  if (isKhmer) {
    return (
      <svg viewBox="0 0 32 20" width="24" height="15" aria-hidden="true" className="shrink-0 rounded-sm shadow-sm">
        <rect width="32" height="20" fill="#012169" />
        <path d="M0 0 32 20M32 0 0 20" stroke="#fff" strokeWidth="5" />
        <path d="M0 0 32 20M32 0 0 20" stroke="#C8102E" strokeWidth="2" />
        <path d="M16 0v20M0 10h32" stroke="#fff" strokeWidth="7" />
        <path d="M16 0v20M0 10h32" stroke="#C8102E" strokeWidth="4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 20" width="24" height="15" aria-hidden="true" className="shrink-0 rounded-sm shadow-sm">
      <rect width="32" height="20" fill="#032EA1" />
      <rect y="5" width="32" height="10" fill="#E00025" />
      <path d="M5 14h22v1H5zm2-2h18v2H7zm2-3h14v3H9zm3-3h2v3h-2zm6 0h2v3h-2zm-3-2h2v8h-2zM8 10l2-2 2 2m8 0 2-2 2 2m-9-4 1-3 1 3" fill="#fff" />
    </svg>
  );
}

export default function Navbar({
  notificationCount = 0,
}) {
  const {
    language,
    toggleLanguage,
    isKhmer,
  } = useLanguage();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const reducedMotion = useReducedMotion();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = useMemo(() => [
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
  ], [t]);

  const [
    activeItem,
    setActiveItem,
  ] = useState(
    "Home",
  );

  const [
    communityOpen,
    setCommunityOpen,
  ] = useState(false);

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    mobileCommunityOpen,
    setMobileCommunityOpen,
  ] = useState(false);

  const [
    badgeAnimate,
    setBadgeAnimate,
  ] = useState(false);

  const communityRef =
    useRef(null);

  const closeTimer =
    useRef(null);

  const previousNotificationCount =
    useRef(notificationCount);

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
  }, [language, pathname, navItems]);

  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      if (
        communityRef.current &&
        !communityRef.current.contains(
          event.target,
        )
      ) {
        setCommunityOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      mobileOpen
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (
      notificationCount >
      previousNotificationCount.current
    ) {
      setBadgeAnimate(false);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setBadgeAnimate(
            true,
          );
        });
      });

      const timer =
        window.setTimeout(
          () => {
            setBadgeAnimate(
              false,
            );
          },
          650,
        );

      previousNotificationCount.current =
        notificationCount;

      return () => {
        window.clearTimeout(
          timer,
        );
      };
    }

    previousNotificationCount.current =
      notificationCount;
  }, [notificationCount]);

  const handleMouseEnter =
    () => {
      clearTimeout(
        closeTimer.current,
      );

      setCommunityOpen(true);
    };

  const handleMouseLeave =
    () => {
      closeTimer.current =
        setTimeout(() => {
          setCommunityOpen(
            false,
          );
        }, 150);
    };

  const handleNavClick = (
    label,
  ) => {
    setActiveItem(label);

    setCommunityOpen(false);
    setMobileOpen(false);

    setMobileCommunityOpen(
      false,
    );
  };

  const linkClasses = (
    label,
  ) =>
    `relative z-10 inline-flex items-center gap-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary px-4 py-2.5 text-[15px] font-medium transition-colors duration-200 ${
      activeItem === label
        ? "text-brand-primary font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-brand-primary"
    }`;

  const renderPill = (label) => (hoveredItem ?? activeItem) === label && (
    <motion.span
      layoutId="nav-pill"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-full bg-brand-primary-light dark:bg-slate-700"
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 35 }}
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
          <img src={nexaLogo} alt="NEXA" className="h-12 w-auto max-w-[160px] object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <LayoutGroup id="main-navigation">
        <ul
          className="m-0 hidden list-none items-center justify-center gap-1 rounded-full border border-gray-200 bg-gray-50/80 p-1.5 dark:border-gray-700 dark:bg-slate-900 xl:flex"
          onMouseLeave={() => setHoveredItem(null)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHoveredItem(null);
          }}
        >
          {navItems.map(
            (item) =>
              item.dropdown ? (
                <li
                  key={
                    item.label
                  }
                  ref={
                    communityRef
                  }
                  className="relative"
                  onFocus={() => setHoveredItem(item.label)}
                  onMouseEnter={() => {
                    setHoveredItem(item.label);
                    handleMouseEnter();
                  }}
                  onMouseLeave={
                    handleMouseLeave
                  }
                >
                  {renderPill(item.label)}
                  <button
                    type="button"
                    onKeyDown={(event) => {
                      if (event.key === "Escape") setCommunityOpen(false);
                    }}
                    className={linkClasses(
                      item.label,
                    )}
                    aria-haspopup="true"
                    aria-expanded={
                      communityOpen
                    }
                    onClick={() => {
                      setActiveItem(
                        item.label,
                      );

                      setCommunityOpen(
                        (
                          previous,
                        ) =>
                          !previous,
                      );
                    }}
                  >
                    {item.label}

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        communityOpen
                          ? "rotate-180"
                          : ""
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
                      className="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 no-underline transition-colors duration-150 hover:bg-brand-secondary-light dark:hover:bg-gray-700 hover:text-brand-secondary"
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
              <li key={item.label} className="relative" onMouseEnter={() => setHoveredItem(item.label)} onFocus={() => setHoveredItem(item.label)}>
                {renderPill(item.label)}
                <Link
                  to={item.to}
                  className={linkClasses(item.label) + " no-underline"}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </Link>
              </li>
            )
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

          <button
            type="button"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all duration-200 hover:bg-brand-primary-light dark:hover:bg-gray-700 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-sm font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
              {notificationCount}
            </span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-brand-primary bg-white dark:bg-gray-800 text-brand-secondary text-sm font-semibold transition-all duration-200 hover:bg-brand-primary-light dark:hover:bg-gray-700 hover:-translate-y-0.5"
            aria-label={isKhmer ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
            onClick={toggleLanguage}
          >
            <LanguageFlag isKhmer={isKhmer} />
            <span>{isKhmer ? "EN" : "ខ្មែរ"}</span>
          </button>

          <Link
            to="/register"
            className="h-10 px-5.5 inline-flex items-center rounded-full border border-[rgba(255,255,255,0.35)] bg-brand-primary text-white text-sm font-semibold no-underline transition-all duration-200 hover:bg-brand-secondary hover:border-brand-secondary hover:-translate-y-0.5"
          >
            {t("getStarted")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-brand-primary shrink-0"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() =>
            setMobileOpen(
              (
                previous,
              ) =>
                !previous,
            )
          }
        >
          {mobileOpen ? (
            <X size={24} />
          ) : (
            <Menu
              size={24}
            />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-navigation"
        inert={!mobileOpen}
        className={`flex flex-col gap-4 overflow-hidden bg-white dark:bg-gray-900 text-foreground transition-all duration-300 xl:hidden ${
          mobileOpen
            ? "max-h-[calc(100dvh-5rem)] overflow-y-auto px-5 py-5 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl"
            : "max-h-0 px-5 py-0 border-t border-transparent"
        }`}
      >
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {navItems.map((item) =>
            item.dropdown ? (
              <li key={item.label} className="border-b border-gray-200 dark:border-gray-700">
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
                      className="mx-1 my-0.5 px-4 py-2.5 rounded-lg bg-brand-primary-light dark:bg-gray-800 text-gray-800 dark:text-gray-200 no-underline text-sm font-medium transition-colors duration-150 hover:bg-brand-secondary-light dark:hover:bg-gray-700 hover:text-brand-secondary"
                      onClick={() => handleNavClick(item.label)}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.label} className="border-b border-gray-200 dark:border-gray-700">
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
            )
          )}
        </ul>

        {/* Mobile Theme + Notification */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle
            variant="circle"
            start="top-right"
            className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            iconClassName="h-5 w-5"
          />

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-sm font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
              {notificationCount}
            </span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-brand-primary bg-white dark:bg-gray-800 text-brand-secondary text-sm font-semibold"
            aria-label={isKhmer ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
            onClick={toggleLanguage}
          >
            <LanguageFlag isKhmer={isKhmer} />
            <span>{isKhmer ? "EN" : "ខ្មែរ"}</span>
          </button>
        </div>

        {/* Mobile Get Started */}
        <Link
          to="/register"
          onClick={() =>
            setMobileOpen(
              false,
            )
          }
          className="flex h-11 w-full items-center justify-center rounded-[10px] bg-brand-primary font-semibold !text-white no-underline hover:bg-brand-secondary hover:!text-white focus:!text-white active:!text-white visited:!text-white dark:!text-white"
        >
          {t("getStarted")}
        </Link>
      </div>
    </nav>
  );
}
