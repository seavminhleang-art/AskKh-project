import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Languages,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sun,
} from "lucide-react";
import Avatar from "../common/Avatar";
import {
  openMobileSidebar,
  toggleSidebar,
} from "../../feature/ui/uiSlice";
import { logout, selectCurrentUser } from "../../feature/auth/authSlice";

// ---- i18n --------------------------------------------------------------
// Swap this for your real i18n solution (react-i18next, etc.) if you have
// one already wired up. Kept local/minimal so it drops in with no other
// dependencies.
const TRANSLATIONS = {
  en: {
    dashboard: "Dashboard",
    search: "Search for lost items, found items, or locations...",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    expandSidebar: "Expand sidebar",
    collapseSidebar: "Collapse sidebar",
    openMenu: "Open menu",
    toggleTheme: "Toggle theme",
    switchLanguage: "Switch language",
  },
  km: {
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    search: "ស្វែងរក របស់បាត់ ឬទីតាំង...",
    notifications: "ការជូនដំណឹង",
    profile: "ប្រវត្តិរូប",
    settings: "ការកំណត់",
    logout: "ចាកចេញ",
    expandSidebar: "ពង្រីកគ្រឹះ",
    collapseSidebar: "បង្រួមគ្រឹះ",
    openMenu: "បើកម៉ឺនុយ",
    toggleTheme: "ប្តូរស្បែក",
    switchLanguage: "ប្តូរភាសា",
  },
};

const LANG_STORAGE_KEY = "app_lang";
const THEME_STORAGE_KEY = "app_theme";

function useBreadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { path, label };
  });
}

// Reads a previously saved preference, falling back to system preference
// (theme) or browser language (locale) on first load.
function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialLang() {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
  if (saved === "en" || saved === "km") return saved;
  return navigator.language?.toLowerCase().startsWith("km") ? "km" : "en";
}

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crumbs = useBreadcrumb();
  const user = useSelector(selectCurrentUser);
  const sidebarCollapsed = useSelector(
    (state) => state.ui.sidebarCollapsed
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const [theme, setTheme] = useState(getInitialTheme);
  const [lang, setLang] = useState(getInitialLang);
  const t = TRANSLATIONS[lang];

  // Apply theme to <html> so Tailwind's `dark:` variants take effect
  // app-wide, and persist the choice.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Persist language choice and expose it on <html lang> for
  // accessibility/SEO. Swap the body for your i18n library's setter
  // (e.g. i18next.changeLanguage(lang)) if you have one.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr"; // Khmer is LTR, so this stays fixed
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }


    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global "/" shortcut focuses the search box, unless the person is
  // already typing somewhere (an input, textarea, or contentEditable).
  useEffect(() => {
    function handleShortcut(event) {
      const target = event.target;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
  }

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function toggleLang() {
    setLang((prev) => (prev === "en" ? "km" : "en"));
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Desktop Sidebar Toggle */}
        <button
          type="button"
          onClick={() => dispatch(toggleSidebar())}
          aria-label={
            sidebarCollapsed ? t.expandSidebar : t.collapseSidebar
          }
          className="hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:block"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={() => dispatch(openMobileSidebar())}
          aria-label={t.openMenu}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="hidden min-w-0 md:block"
        >
          <ol className="flex items-center gap-1 truncate text-sm text-gray-500 dark:text-gray-400">
            {crumbs.length === 0 && (
              <li className="font-medium text-gray-900 dark:text-white">
                {t.dashboard}
              </li>
            )}

            {crumbs.map((crumb, index) => (
              <li
                key={crumb.path}
                className="flex items-center gap-1"
              >
                {index > 0 && (
                  <span className="text-gray-300 dark:text-gray-600">
                    /
                  </span>
                )}

                {index === crumbs.length - 1 ? (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-gray-700 dark:hover:text-white"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500">
        <Search className="h-4 w-4 shrink-0" />

        <input
          ref={searchRef}
          type="search"
          placeholder={t.search}
          className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-500"
        />
      </div>


      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Language Switch */}
        <button
          type="button"
          onClick={toggleLang}
          aria-label={t.switchLanguage}
          title={t.switchLanguage}
          className="flex items-center gap-1 rounded-md p-2 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Languages className="h-5 w-5" />
          <span className="hidden sm:inline">
            {lang === "en" ? "EN" : "KH"}
          </span>
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t.toggleTheme}
          title={t.toggleTheme}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        <Link
          to="/notifications"
          aria-label={t.notifications}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Bell className="h-5 w-5" />
        </Link>

        {/* User Menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Avatar name={user?.displayName ?? user?.email} />

            <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-300" />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-md border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <Link
                to="/users/me"
                role="menuitem"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                {t.profile}
              </Link>

              <Link
                to="/settings"
                role="menuitem"
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                {t.settings}
              </Link>

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="block w-full px-3 py-2 text-left text-sm text-brand-secondary hover:bg-brand-secondary-light dark:hover:bg-gray-700"
              >
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
