import React, { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import LiveBackground from "../PagesComponent/HomeComponent/LiveBackground";
import HeroSection from "../PagesComponent/HomeComponent/HeroSection";
import HowSecureRecoveryWorks from "../PagesComponent/HomeComponent/HowSecureRecoveryWorks";
import PlatformShowcase from "../PagesComponent/HomeComponent/PlatformShowcase";
import PlatformArchitecture from "../PagesComponent/HomeComponent/PlatformArchitecture";
import TrendingDiscussions from "../PagesComponent/HomeComponent/TrendingDiscussions";
import RecentRecoveries from "../PagesComponent/HomeComponent/RecentRecoveries";
import CommunityVoice from "../PagesComponent/HomeComponent/CommunityVoice";
import FAQAndCTA from "../PagesComponent/HomeComponent/FAQAndCTA";
import ShootingStars from "../PagesComponent/HomeComponent/ShootingStars";
import SpaceBackground from "../PagesComponent/HomeComponent/SpaceBackground";
import LightRibbons from "../PagesComponent/HomeComponent/LightRibbons";
import ParticleNetwork from "../PagesComponent/HomeComponent/ParticleNetwork";
import StarfieldCanvas from "../PagesComponent/HomeComponent/StarfieldCanvas";
import FireWarpCanvas from "../PagesComponent/HomeComponent/FireWarpCanvas";
import SpaceWarpCanvas from "../PagesComponent/HomeComponent/SpaceWarpCanvas";
import HowCommunityQAWorks from "../PagesComponent/HomeComponent/HowCommunityQAWorks"; // New Q&A Component


export default function HomePage() {
  // Grab darkMode from App.jsx via React Router context
  const { darkMode } = useOutletContext();

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
      className={`relative px-6 sm:px-12 md:px-20 lg:px-28 py-10 overflow-hidden font-sans cursor-default transition-colors duration-300 ${
        darkMode ? "bg-[#121212] text-gray-100" : "bg-[#f5f5f5] text-gray-800"
      }`}
    >
      <ShootingStars darkMode={darkMode} count={14} />
      <SpaceBackground darkMode={darkMode} />
      <LightRibbons darkMode={darkMode} count={5} />
      {/* <ParticleNetwork darkMode={darkMode} particleCount={90} /> */}
      {/* <StarfieldCanvas darkMode={darkMode} starCount={500} /> */}
      {/* <FireWarpCanvas darkMode={darkMode} particleCount={400} /> */}
      {/* <SpaceWarpCanvas darkMode={darkMode} particleCount={400} /> */}
      

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

      <LiveBackground darkMode={darkMode} />
      <HeroSection setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      
      {/* Integrated Component */}
      <PlatformShowcase setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <PlatformArchitecture setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <HowSecureRecoveryWorks setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <TrendingDiscussions setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <HowCommunityQAWorks setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <RecentRecoveries setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <CommunityVoice setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
      <FAQAndCTA setCursorText={setCursorText} setIsHovered={setIsHovered} darkMode={darkMode} />
    </div>
  );
}