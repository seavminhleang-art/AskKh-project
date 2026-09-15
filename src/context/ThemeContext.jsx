import { createContext, useContext, useMemo } from "react";
import { useTheme as useLegacyTheme } from "../Components/theme-provider.jsx";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { resolvedTheme, setTheme } = useLegacyTheme();
  const darkMode = resolvedTheme === "dark";

  const value = useMemo(() => {
    const setDarkMode = (nextValue) => {
      setTheme((currentTheme) => {
        const currentIsDark = currentTheme === "system"
          ? resolvedTheme === "dark"
          : currentTheme === "dark";
        const nextIsDark = typeof nextValue === "function"
          ? nextValue(currentIsDark)
          : nextValue;
        return nextIsDark ? "dark" : "light";
      });
    };

    return {
      darkMode,
      setDarkMode,
      toggleTheme: () => setDarkMode((current) => !current),
    };
  }, [darkMode, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
