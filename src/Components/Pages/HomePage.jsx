import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useOutletContext } from "react-router-dom";

import HeroSection from "../PagesComponent/HomeComponent/HeroSection";
import PlatformShowcase from "../PagesComponent/HomeComponent/PlatformShowcase";
import PlatformArchitecture from "../PagesComponent/HomeComponent/PlatformArchitecture";
import HowSecureRecoveryWorks from "../PagesComponent/HomeComponent/HowSecureRecoveryWorks";
import TrendingDiscussions from "../PagesComponent/HomeComponent/TrendingDiscussions";
import HowCommunityQAWorks from "../PagesComponent/HomeComponent/HowCommunityQAWorks";
import RecentRecoveries from "../PagesComponent/HomeComponent/RecentRecoveries";
import CommunityVoice from "../PagesComponent/HomeComponent/CommunityVoice";
import FAQAndCTA from "../PagesComponent/HomeComponent/FAQAndCTA";

import { usePageSEO } from "../common/SEO";

export default function HomePage() {
  // Get darkMode from App.jsx through React Router outlet context
  const { darkMode } = useOutletContext();

  usePageSEO({
    title: "NEXA — Network, Explore, eXchange, Assist | Cambodian Tech Community",
    description: "NEXA is Cambodia's premier developer and student platform for technical Q&A collaboration, programming assistance, knowledge exchange, and campus Lost & Found recovery.",
    keywords: "NEXA, NEXA Cambodia, Cambodian Developers, Cambodia Tech Community, ISTAD, Programming Q&A, Lost and Found Cambodia, Code Collaboration, Web Development, Phnom Penh Tech",
    canonicalUrl: "https://nexa-projects-168.vercel.app/",
  });

  // --------------------------------------------------
  // Custom cursor state
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
      {/* -----------------------------------------------
          Custom Mouse Follower Tooltip
      ------------------------------------------------ */}
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

      {/* -----------------------------------------------
          Hero
      ------------------------------------------------ */}
      <HeroSection
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      {/* -----------------------------------------------
          Platform
      ------------------------------------------------ */}
      <PlatformShowcase
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      <PlatformArchitecture
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      {/* -----------------------------------------------
          Community & Recovery
      ------------------------------------------------ */}
      <HowSecureRecoveryWorks
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      <TrendingDiscussions
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      <HowCommunityQAWorks
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      <RecentRecoveries
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      <CommunityVoice
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />

      {/* -----------------------------------------------
          FAQ & Call To Action
      ------------------------------------------------ */}
      <FAQAndCTA
        setCursorText={setCursorText}
        setIsHovered={setIsHovered}
        darkMode={darkMode}
      />
    </main>
  );
}
