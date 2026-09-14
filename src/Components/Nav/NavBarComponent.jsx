import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router";

import {
  Bell,
  ChevronDown,
  Globe,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  {
    label: "Community",
    href: "#community",
    dropdown: [
      { label: "Question & Answer", href: "#qa" },
      { label: "Lost & Found Community", href: "#lost-and-found" },
    ],
  },
  { label: "Leaderboard", href: "#leaderboard" },
  { label: "About Us", href: "about" },
];

export default function Navbar({
  notificationCount = 0,
}) {
  const {
    language,
    toggleLanguage,
    isKhmer,
  } = useLanguage();

  const navItems =
    NAVIGATION[language];

  const [
    activeItem,
    setActiveItem,
  ] = useState(
    navItems[0].label,
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
        : "text-gray-600 hover:text-brand-primary hover:bg-brand-primary-light"
    }`;

  return (
    <nav
      className="font-brand bg-white border-b border-gray-200 sticky top-0 z-[1000] w-full"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2.5 shrink-0 no-underline"
          onClick={() => handleNavClick("Home")}
        >
          <span className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-brand-primary text-white font-bold text-lg">
            N
          </span>
          <span className="text-xl font-bold text-brand-primary tracking-tight">
            Nexa
          </span>
        </a>

        {/* Desktop Navigation */}
        <ul className="m-0 hidden flex-1 list-none items-center justify-center gap-2 p-0 lg:flex">
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
                  className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-[0_4px_16px_rgba(11,42,74,0.08)] p-2 flex flex-col gap-0.5 transition-all duration-200 ${
                    communityOpen
                      ? "opacity-100 visible translate-y-0 pointer-events-auto"
                      : "opacity-0 invisible -translate-y-1.5 pointer-events-none"
                  }`}
                >
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      role="menuitem"
                      className="block px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-800 no-underline transition-colors duration-150 hover:bg-brand-secondary-light hover:text-brand-secondary"
                      onClick={() => {
                        setCommunityOpen(false);
                        handleNavClick(item.label);
                      }}
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={linkClasses(item.label) + " no-underline"}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>

        {/* Right side actions (desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:bg-brand-primary-light hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
            aria-label="Toggle theme"
          >
            <Sun size={20} />
          </button>

          <button
            type="button"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:bg-brand-primary-light hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
              5
            </span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-[10px] border border-gray-200 bg-white text-gray-600 text-sm font-medium transition-all duration-200 hover:bg-brand-primary-light hover:border-brand-primary hover:text-brand-primary"
            aria-label="Change language"
          >
            <Globe size={18} />
            <span>KH / EN</span>
          </button>

          <button
            type="button"
            className="h-10 px-5.5 rounded-[10px] border-none bg-brand-primary text-white text-sm font-semibold transition-all duration-200 hover:bg-brand-secondary hover:shadow-[0_6px_16px_rgba(237,43,42,0.25)] hover:-translate-y-0.5"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-gray-200 bg-white text-brand-primary shrink-0"
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
        className={`flex flex-col gap-4 overflow-hidden bg-background text-foreground transition-all duration-300 lg:hidden ${
          mobileOpen
            ? "max-h-[750px] px-5 py-5 shadow-sm"
            : "max-h-0 px-5 py-0"
        }`}
      >
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {NAV_ITEMS.map((item) =>
            item.dropdown ? (
              <li key={item.label} className="border-b border-gray-200">
                <button
                  type="button"
                  className={`w-full flex items-center justify-between bg-transparent border-none text-base py-3.5 px-1 cursor-pointer ${
                    activeItem === item.label
                      ? "text-brand-primary font-semibold"
                      : "text-gray-800 font-medium"
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
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="mx-1 my-0.5 px-4 py-2.5 rounded-lg bg-brand-primary-light text-gray-800 no-underline text-sm font-medium transition-colors duration-150 hover:bg-brand-secondary-light hover:text-brand-secondary"
                      onClick={() => handleNavClick(item.label)}
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              </li>
            ) : (
              <li key={item.label} className="border-b border-gray-200">
                <a
                  href={item.href}
                  className={`block py-3.5 px-1 no-underline text-base ${
                    activeItem === item.label
                      ? "text-brand-primary font-semibold"
                      : "text-gray-800 font-medium"
                  }`}
                  onClick={() => handleNavClick(item.label)}
                >
                  {item.label}
                </a>
              </li>
            )
          )}
        </ul>

        {/* Mobile Theme + Notification */}
        <div className="flex items-center gap-2">
          <ThemeToggle
            variant="circle"
            start="top-right"
            className="h-10 w-10 rounded-full bg-muted/60 text-foreground"
            iconClassName="h-5 w-5"
          />

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-foreground"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-secondary text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
              5
            </span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 h-10 px-3.5 rounded-[10px] border border-gray-200 bg-white text-gray-600 text-sm font-medium"
            aria-label="Change language"
          >
            <Globe size={18} />
            <span>KH / EN</span>
          </button>
        </div>

        {/* Mobile Language */}
        <button
          type="button"
          className="w-full h-11 rounded-[10px] border-none bg-brand-primary text-white text-sm font-semibold transition-colors duration-200 hover:bg-brand-secondary"
        >
          Get Started
        </button>

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
          {isKhmer
            ? "ចាប់ផ្តើម"
            : "Get Started"}
        </Link>
      </div>
    </nav>
  );
}
