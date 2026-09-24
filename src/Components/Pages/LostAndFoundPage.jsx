import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import { usePageSEO } from "../common/SEO";

// Sub-components
import ItemFeedView from "../PagesComponent/HomeComponent/Lost&FoundComponent/ItemFeedView";
import CreateReportForm from "../PagesComponent/HomeComponent/Lost&FoundComponent/CreateReportForm";

export default function LostAndFoundPage() {
  // Get darkMode from App.jsx through React Router outlet context
  const { darkMode } = useOutletContext();

  usePageSEO({
    title: "AskKh Lost & Found",
    description: "Report missing items, track found belongings across campus, and verify ownership through AskKh Lost & Found.",
    keywords: "AskKh Lost and Found, campus lost belongings, recover lost items, ISTAD, found items Cambodia",
    canonicalUrl: "https://askkh.com/community/lost-found",
  });

  // --------------------------------------------------
  // Page view state
  // "list"   = Lost & Found feed
  // "create" = Create report form
  // --------------------------------------------------
  const [currentView, setCurrentView] = useState("list");

  // --------------------------------------------------
  // Custom cursor
  // --------------------------------------------------
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = {
    damping: 25,
    stiffness: 300,
  };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // --------------------------------------------------
  // Mouse movement
  // --------------------------------------------------
  const handleMouseMove = (event) => {
    cursorX.set(event.clientX);
    cursorY.set(event.clientY);
  };

  // --------------------------------------------------
  // Theme classes
  // --------------------------------------------------
  const pageTheme = darkMode
    ? "bg-[#121212] text-gray-100"
    : "bg-[#f5f5f5] text-gray-800";

  return (
    <main
      onMouseMove={handleMouseMove}
      className={`shared-theme shared-page relative min-h-screen px-4 py-10 overflow-hidden font-sans cursor-default transition-colors duration-300 sm:px-6 lg:px-10 xl:px-16 ${pageTheme}`}
    >
      {/* ==================================================
          Custom Mouse Follower Tooltip
      ================================================== */}
      <motion.div
        className={`hidden lg:flex fixed top-0 left-0 z-50 pointer-events-none items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-md text-base font-medium shadow-xl ${
          darkMode
            ? "bg-gray-100/90 text-gray-900"
            : "bg-gray-900/90 text-white"
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-150%",
        }}
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: isHovered ? 1 : 0,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.15,
        }}
      >
        <span className="w-2 h-2 mr-2 rounded-full bg-[#f44336] animate-pulse" />

        {cursorText || "Explore"}
      </motion.div>

      {/* ==================================================
          Main Content
      ================================================== */}
      <section className="relative z-10 w-full max-w-7xl mx-auto">
        {currentView === "list" ? (
          <ItemFeedView
            darkMode={darkMode}
            setCursorText={setCursorText}
            setIsHovered={setIsHovered}
            onOpenReport={() => setCurrentView("create")}
          />
        ) : (
          <CreateReportForm
            darkMode={darkMode}
            setCursorText={setCursorText}
            setIsHovered={setIsHovered}
            onCancel={() => setCurrentView("list")}
          />
        )}
      </section>
    </main>
  );
}
