import React, { useState, useEffect } from "react";
import NavBarComponent from "./Components/Nav/NavBarComponent";
import FooterComponent from "./Components/Footer/FooterComponet";
import { Outlet } from "react-router-dom";

export default function App() {
  // Initialize state from localStorage (defaults to light mode)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Sync state with HTML document element for Tailwind CSS
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-zinc-950 text-slate-100 dark" : "bg-white text-gray-900"
    }`}>
      <NavBarComponent darkMode={darkMode} setDarkMode={setDarkMode} />
      
      {/* Outlet context allows child pages to access darkMode if needed */}
      <main>
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>

      <FooterComponent darkMode={darkMode} />
    </div>
  );
}