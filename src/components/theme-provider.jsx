import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "theme",
}) {
  const [theme, setTheme] = useState(() => localStorage.getItem(storageKey) || defaultTheme);
  const resolvedTheme = theme === "system" && enableSystem ? systemTheme() : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (attribute === "class") root.classList.remove("light", "dark");
    if (attribute === "class") root.classList.add(resolvedTheme);
    else root.setAttribute(attribute, resolvedTheme);
    localStorage.setItem(storageKey, theme);
  }, [attribute, resolvedTheme, storageKey, theme]);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [resolvedTheme, theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
