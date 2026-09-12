import React from "react";
import { motion } from "framer-motion";

export default function ModernGridBackground({ darkMode }) {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        background: darkMode ? "#0a0a0b" : "#fafafa",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
            : "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
        }}
      />

      {/* Vignette fade to base color at edges */}
      <div
        className="absolute inset-0"
        style={{
          background: darkMode
            ? "radial-gradient(ellipse 70% 50% at 50% 0%, transparent 0%, #0a0a0b 80%)"
            : "radial-gradient(ellipse 70% 50% at 50% 0%, transparent 0%, #fafafa 80%)",
        }}
      />

      {/* Moving glow spotlight */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          left: "50%",
          top: "-10%",
          background: darkMode
            ? "radial-gradient(circle, rgba(244,67,54,0.25) 0%, rgba(63,81,181,0.15) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(244,67,54,0.15) 0%, rgba(63,81,181,0.08) 40%, transparent 70%)",
          filter: "blur(60px)",
          translateX: "-50%",
        }}
        animate={{
          x: ["-50%", "-42%", "-58%", "-50%"],
          opacity: [0.8, 1, 0.7, 0.8],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary accent glow, offset */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          right: "10%",
          top: "20%",
          background: darkMode
            ? "radial-gradient(circle, rgba(63,81,181,0.2) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(63,81,181,0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          y: [0, 40, -20, 0],
          opacity: [0.6, 0.9, 0.5, 0.6],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Fine noise/grain overlay for texture (optional, very subtle) */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}