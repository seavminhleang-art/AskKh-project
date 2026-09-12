import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useOutletContext } from "react-router-dom";

// Visual Effects Components (Matches HomePage)
import LiveBackground from "../PagesComponent/HomeComponent/LiveBackground";
import ShootingStars from "../PagesComponent/HomeComponent/ShootingStars";
import SpaceBackground from "../PagesComponent/HomeComponent/SpaceBackground";
import LightRibbons from "../PagesComponent/HomeComponent/LightRibbons";

// Sub-components
import ItemFeedView from "../PagesComponent/HomeComponent/Lost&FoundComponent/ItemFeedView";
import CreateReportForm from "../PagesComponent/HomeComponent/Lost&FoundComponent/CreateReportForm";

export default function LostAndFoundPage() {
  // Grab darkMode from App.jsx via React Router context
  const { darkMode } = useOutletContext();

  // Page view state: 'list' | 'create'
  const [currentView, setCurrentView] = useState("list");

  // Custom Cursor Spring Animation
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [cursorText, setCursorText] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    cursorX.set(e.clientX);
    cursorY.set(e.clientY);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen px-6 sm:px-12 md:px-20 lg:px-28 py-10 overflow-hidden font-sans cursor-default transition-colors duration-300 ${
        darkMode ? "bg-[#121212] text-gray-100" : "bg-[#f5f5f5] text-gray-800"
      }`}
    >
      {/* Dynamic Background Effects */}
      <ShootingStars darkMode={darkMode} count={14} />
      <SpaceBackground darkMode={darkMode} />
      <LightRibbons darkMode={darkMode} count={5} />
      <LiveBackground darkMode={darkMode} />

      {/* Custom Mouse Follower Tooltip */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-medium shadow-xl ${
          darkMode ? "bg-gray-100/90 text-gray-900" : "bg-gray-900/90 text-white"
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-150%",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <span className="w-2 h-2 rounded-full bg-[#f44336] mr-2 animate-pulse"></span>
        {cursorText || "Explore"}
      </motion.div>

      {/* Content Section (List or Form) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto">
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
      </div>
    </div>
  );
}