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

import { ThemeToggle } from "@/components/motion/theme-toggle";

import { useLanguage } from "../Language/LanguageContext.jsx";

const NAVIGATION = {
  km: [
    {
      label: "ទំព័រដើម",
      href: "#home",
    },
    {
      label: "សហគមន៍",
      href: "#community",
      dropdown: [
        {
          label: "សំណួរ និង ចម្លើយ",
          href: "#qa",
        },
        {
          label: "បាត់ និង រកឃើញ",
          href: "#lost-and-found",
        },
      ],
    },
    {
      label: "តារាងពិន្ទុ",
      href: "#leaderboard",
    },
    {
      label: "អំពីយើង",
      href: "#about",
    },
  ],

  en: [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "Community",
      href: "#community",
      dropdown: [
        {
          label: "Question & Answer",
          href: "#qa",
        },
        {
          label: "Lost & Found Community",
          href: "#lost-and-found",
        },
      ],
    },
    {
      label: "Leaderboard",
      href: "#leaderboard",
    },
    {
      label: "About Us",
      href: "#about",
    },
  ],
};

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
        ? "font-semibold text-brand-primary"
        : "text-muted-foreground hover:bg-brand-primary/5 hover:text-brand-primary"
    }`;

  const NotificationBadge =
    () => {
      if (
        notificationCount <= 0
      ) {
        return null;
      }

      return (
        <span
          className={`notification-badge ${
            badgeAnimate
              ? "notification-badge-animate"
              : ""
          }`}
        >
          {notificationCount > 99
            ? "99+"
            : notificationCount}
        </span>
      );
    };

  return (
    <nav
      className={`sticky top-0 z-[1000] w-full bg-background text-foreground transition-colors duration-300 ${
        isKhmer
          ? "font-khmer"
          : "font-brand"
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <a
          href="#home"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() =>
            handleNavClick(
              navItems[0].label,
            )
          }
        >
          <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-brand-primary text-lg font-bold !text-white">
            A
          </span>

          <span className="text-xl font-bold tracking-tight text-brand-primary">
            AskKH
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
                    className={`absolute left-1/2 top-[calc(100%+8px)] flex min-w-[240px] -translate-x-1/2 flex-col rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-xl transition-all duration-200 ${
                      communityOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1.5 opacity-0 pointer-events-none"
                    }`}
                  >
                    {item.dropdown.map(
                      (
                        sub,
                      ) => (
                        <a
                          key={
                            sub.label
                          }
                          href={
                            sub.href
                          }
                          className="block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-brand-secondary/10 hover:text-brand-secondary"
                          onClick={() =>
                            handleNavClick(
                              item.label,
                            )
                          }
                        >
                          {
                            sub.label
                          }
                        </a>
                      ),
                    )}
                  </div>
                </li>
              ) : (
                <li
                  key={
                    item.label
                  }
                >
                  <a
                    href={
                      item.href
                    }
                    className={linkClasses(
                      item.label,
                    )}
                    onClick={() =>
                      handleNavClick(
                        item.label,
                      )
                    }
                  >
                    {
                      item.label
                    }
                  </a>
                </li>
              ),
          )}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
          <ThemeToggle
            variant="circle"
            start="top-right"
            className="h-9 w-9 rounded-full bg-transparent text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-brand-primary"
            iconClassName="h-[18px] w-[18px]"
          />

          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-brand-primary"
            aria-label="Notifications"
          >
            <Bell size={18} />

            <NotificationBadge />
          </button>

          <button
            type="button"
            onClick={
              toggleLanguage
            }
            className="inline-flex h-9 items-center gap-2 rounded-full bg-transparent px-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-brand-primary"
          >
            <Globe
              size={17}
            />

            <span>
              {isKhmer
                ? "ខ្មែរ / EN"
                : "KH / English"}
            </span>
          </button>

          {/* Get Started */}
          <Link
            to="/register"
            className="ml-1 inline-flex h-10 items-center justify-center rounded-[10px] bg-brand-primary px-5 text-sm font-semibold !text-white no-underline transition-all duration-200 hover:bg-brand-secondary hover:!text-white focus:!text-white active:!text-white visited:!text-white dark:!text-white"
          >
            {isKhmer
              ? "ចាប់ផ្តើម"
              : "Get Started"}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-brand-primary transition-colors hover:bg-muted lg:hidden"
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
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {navItems.map(
            (item) =>
              item.dropdown ? (
                <li
                  key={
                    item.label
                  }
                  className="border-b border-border/60"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between bg-transparent px-1 py-3.5 text-base font-medium"
                    onClick={() =>
                      setMobileCommunityOpen(
                        (
                          previous,
                        ) =>
                          !previous,
                      )
                    }
                  >
                    {
                      item.label
                    }

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        mobileCommunityOpen
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all ${
                      mobileCommunityOpen
                        ? "max-h-[200px] pb-2.5"
                        : "max-h-0"
                    }`}
                  >
                    {item.dropdown.map(
                      (
                        sub,
                      ) => (
                        <a
                          key={
                            sub.label
                          }
                          href={
                            sub.href
                          }
                          className="block rounded-lg px-4 py-3 text-sm hover:bg-muted"
                          onClick={() =>
                            handleNavClick(
                              item.label,
                            )
                          }
                        >
                          {
                            sub.label
                          }
                        </a>
                      ),
                    )}
                  </div>
                </li>
              ) : (
                <li
                  key={
                    item.label
                  }
                  className="border-b border-border/60"
                >
                  <a
                    href={
                      item.href
                    }
                    className="block py-3.5 font-medium"
                    onClick={() =>
                      handleNavClick(
                        item.label,
                      )
                    }
                  >
                    {
                      item.label
                    }
                  </a>
                </li>
              ),
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

            <NotificationBadge />
          </button>
        </div>

        {/* Mobile Language */}
        <button
          type="button"
          onClick={
            toggleLanguage
          }
          className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-muted text-foreground"
        >
          <Globe size={18} />

          {isKhmer
            ? "ប្តូរទៅ English"
            : "ប្តូរទៅ ខ្មែរ"}
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