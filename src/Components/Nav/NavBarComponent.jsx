import React, {
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
  Sun,
  X,
} from "lucide-react";

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

export default function Navbar() {
  const {
    language,
    toggleLanguage,
    isKhmer,
  } = useLanguage();

  const navItems = NAVIGATION[language];

  const [activeItem, setActiveItem] = useState(
    navItems[0].label,
  );

  const [communityOpen, setCommunityOpen] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [
    mobileCommunityOpen,
    setMobileCommunityOpen,
  ] = useState(false);

  const communityRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    setActiveItem(navItems[0].label);
  }, [language, navItems]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        communityRef.current &&
        !communityRef.current.contains(event.target)
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
      mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

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
    setMobileOpen(false);
    setMobileCommunityOpen(false);
    setCommunityOpen(false);
  };

  const linkClasses = (label) =>
    `inline-flex items-center gap-1 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors duration-200 ${
      activeItem === label
        ? "text-[#0050F3] font-semibold"
        : "text-gray-600 hover:text-[#0050F3] hover:bg-[#EEF4FF]"
    }`;

  return (
    <nav
      className={`bg-white border-b border-gray-200 sticky top-0 z-[1000] w-full ${
        isKhmer ? "font-khmer" : "font-brand"
      }`}
      aria-label="Main navigation"
    >
      <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
        {/* Logo */}
        <a
          href="#home"
          className="flex items-center gap-2.5 shrink-0 no-underline"
          onClick={() =>
            handleNavClick(navItems[0].label)
          }
        >
          <span className="flex items-center justify-center w-[38px] h-[38px] rounded-[10px] bg-[#0050F3] text-white font-bold text-lg">
            A
          </span>

          <span className="text-xl font-bold text-[#0050F3] tracking-tight">
            AskKH
          </span>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-2 flex-1 justify-center list-none m-0 p-0">
          {navItems.map((item) =>
            item.dropdown ? (
              <li
                key={item.label}
                className="relative"
                ref={communityRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={linkClasses(item.label)}
                  onClick={() => {
                    setActiveItem(item.label);
                    setCommunityOpen(
                      (previous) => !previous,
                    );
                  }}
                >
                  {item.label}

                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      communityOpen
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[240px] bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col transition-all ${
                    communityOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                >
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-3.5 py-2.5 rounded-lg text-sm text-gray-800 hover:bg-[#FFF1F1] hover:text-[#ED2B2A]"
                      onClick={() =>
                        handleNavClick(item.label)
                      }
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
                  className={linkClasses(item.label)}
                  onClick={() =>
                    handleNavClick(item.label)
                  }
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            className="inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-gray-200 bg-white text-gray-600 hover:text-[#0050F3]"
          >
            <Sun size={20} />
          </button>

          <button
            type="button"
            className="relative inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-gray-200 bg-white text-gray-600"
          >
            <Bell size={20} />

            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#ED2B2A] text-white text-[11px] font-bold flex items-center justify-center">
              5
            </span>
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-[10px] border border-gray-200 bg-white text-gray-600 text-sm font-medium hover:border-[#0050F3] hover:text-[#0050F3]"
          >
            <Globe size={18} />

            <span>
              {isKhmer ? "ខ្មែរ / EN" : "KH / English"}
            </span>
          </button>

          <Link
            to="/register"
            className="h-10 px-5.5 rounded-[10px] bg-[#0050F3] text-white text-sm font-semibold inline-flex items-center justify-center hover:bg-[#ED2B2A]"
          >
            {isKhmer
              ? "ចាប់ផ្តើម"
              : "Get Started"}
          </Link>
        </div>

        {/* Mobile */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[10px] border border-gray-200 bg-white text-[#0050F3]"
          onClick={() =>
            setMobileOpen(
              (previous) => !previous,
            )
          }
        >
          {mobileOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden flex flex-col gap-4 overflow-hidden bg-white transition-all ${
          mobileOpen
            ? "max-h-[700px] px-5 py-5 border-t"
            : "max-h-0 px-5 py-0"
        }`}
      >
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {navItems.map((item) =>
            item.dropdown ? (
              <li
                key={item.label}
                className="border-b"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between py-3.5"
                  onClick={() =>
                    setMobileCommunityOpen(
                      (previous) => !previous,
                    )
                  }
                >
                  {item.label}

                  <ChevronDown
                    size={16}
                    className={
                      mobileCommunityOpen
                        ? "rotate-180"
                        : ""
                    }
                  />
                </button>

                <div
                  className={`overflow-hidden ${
                    mobileCommunityOpen
                      ? "max-h-[200px]"
                      : "max-h-0"
                  }`}
                >
                  {item.dropdown.map((sub) => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-3"
                      onClick={() =>
                        handleNavClick(item.label)
                      }
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              </li>
            ) : (
              <li
                key={item.label}
                className="border-b"
              >
                <a
                  href={item.href}
                  className="block py-3.5"
                  onClick={() =>
                    handleNavClick(item.label)
                  }
                >
                  {item.label}
                </a>
              </li>
            ),
          )}
        </ul>

        <button
          type="button"
          onClick={toggleLanguage}
          className="w-full h-11 border border-gray-200 rounded-[10px] flex items-center justify-center gap-2"
        >
          <Globe size={18} />

          {isKhmer
            ? "ប្តូរទៅ English"
            : "ប្តូរទៅ ខ្មែរ"}
        </button>

        <Link
          to="/register"
          onClick={() => setMobileOpen(false)}
          className="w-full h-11 rounded-[10px] bg-[#0050F3] text-white flex items-center justify-center"
        >
          {isKhmer
            ? "ចាប់ផ្តើម"
            : "Get Started"}
        </Link>
      </div>
    </nav>
  );
}