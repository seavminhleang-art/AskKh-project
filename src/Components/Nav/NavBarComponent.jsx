import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useLanguage } from "../Language/LanguageContext.jsx";
import { ThemeToggle } from "../motion/theme-toggle.jsx";
import { useTranslation } from "react-i18next";

export default function Navbar({
  notificationCount = 0,
}) {
  const {
    language,
    toggleLanguage,
    isKhmer,
  } = useLanguage();
  const { t } = useTranslation();

  const navItems = [
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
  ];

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
    setActiveItem(
      navItems[0].label,
    );
  }, [language]);

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
    `inline-flex items-center gap-1 rounded-lg px-4 py-2.5 text-[15px] font-medium transition-colors duration-200 ${
      activeItem === label
        ? "text-brand-primary font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-brand-primary hover:bg-brand-primary-light dark:hover:bg-gray-800"
    }`;

  return (
    <nav
      className="site-navbar font-brand sticky top-0 z-[1000] w-full rounded-b-2xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(37,99,235,0.08)] transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 no-underline"
          onClick={() => handleNavClick("Home")}
        >
          <span className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-brand-primary text-white font-bold text-lg">
            N
          </span>
          <span className="text-xl font-bold text-brand-primary tracking-tight">
            Nexa
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="m-0 hidden flex-1 list-none items-center justify-center gap-2 rounded-full border border-gray-200 p-2 dark:border-gray-700 lg:flex">
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
                  onMouseEnter={
                    handleMouseEnter
                  }
                  onMouseLeave={
                    handleMouseLeave
                  }
                >
                  <button
                    type="button"
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
                  className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[240px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-[0_4px_16px_rgba(37,99,235,0.12)] p-2 flex flex-col gap-0.5 transition-all duration-200 ${
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
              <li key={item.label}>
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

        {/* Right side actions (desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
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
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
              {notificationCount}
            </span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-brand-primary bg-white dark:bg-gray-800 text-brand-secondary text-sm font-semibold transition-all duration-200 hover:bg-brand-primary-light dark:hover:bg-gray-700 hover:-translate-y-0.5"
            aria-label={isKhmer ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
            onClick={toggleLanguage}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              {isKhmer ? "🇬🇧" : "🇰🇭"}
            </span>
            <span>{isKhmer ? "EN" : "ខ្មែរ"}</span>
          </button>

          <Link
            to="/register"
            className="h-10 px-5.5 inline-flex items-center rounded-full border border-[rgba(255,255,255,0.35)] bg-brand-primary text-white text-sm font-semibold no-underline transition-all duration-200 hover:bg-brand-secondary hover:border-brand-secondary hover:shadow-[0_6px_16px_rgba(237,43,42,0.25)] hover:-translate-y-0.5"
          >
            {t("getStarted")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-brand-primary shrink-0"
          aria-label="Toggle menu"
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
        className={`flex flex-col gap-4 overflow-hidden bg-white dark:bg-gray-900 text-foreground transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[750px] px-5 py-5 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl"
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
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-gray-900">
              {notificationCount}
            </span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-full border border-brand-primary bg-white dark:bg-gray-800 text-brand-secondary text-sm font-semibold"
            aria-label={isKhmer ? "Switch to English" : "ប្តូរទៅភាសាខ្មែរ"}
            onClick={toggleLanguage}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              {isKhmer ? "🇬🇧" : "🇰🇭"}
            </span>
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
