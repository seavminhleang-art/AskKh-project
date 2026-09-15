import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function SpaceBackground({ darkMode }) {
  // Twinkling starfield
  const stars = useMemo(() => {
    return Array.from({ length: 90 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
  }, []);

  // Shooting stars / comets
  const comets = useMemo(() => {
    return Array.from({ length: 10 }).map((_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 70;
      const travel = 300 + Math.random() * 250;
      const angle = 30 + Math.random() * 20;
      const duration = 1.5 + Math.random() * 1.8;
      const delay = Math.random() * 10;
      const repeatDelay = 3 + Math.random() * 7;
      return { id: i, startX, startY, travel, angle, duration, delay, repeatDelay };
    });
  }, []);

  // Nebula glow blobs
  const nebulae = [
    { color: darkMode ? "#7b2ff7" : "#c9a6ff", size: 550, x: "5%", y: "0%", duration: 30 },
    { color: darkMode ? "#f7418a" : "#ffb6d9", size: 500, x: "65%", y: "15%", duration: 26 },
    { color: darkMode ? "#1e88e5" : "#a3d4ff", size: 600, x: "35%", y: "55%", duration: 34 },
  ];

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
        background: darkMode
          ? "radial-gradient(ellipse at 50% 0%, #1a0b2e 0%, #0a0a12 55%, #050507 100%)"
          : "radial-gradient(ellipse at 50% 0%, #e8eaff 0%, #f5f5f7 55%, #ffffff 100%)",
      }}
    >
      {/* Nebula glow */}
      {nebulae.map((n, i) => (
        <motion.div
          key={`neb-${i}`}
          className="absolute rounded-full"
          style={{
            width: n.size,
            height: n.size,
            left: n.x,
            top: n.y,
            background: n.color,
            filter: "blur(140px)",
            opacity: darkMode ? 0.28 : 0.35,
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: n.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Twinkling stars */}
      {stars.map((star) => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: darkMode ? "#ffffff" : "#555555",
          }}
          animate={{ opacity: [0.15, 1, 0.15] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Comets */}
      {comets.map((c) => {
        const rad = (c.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * c.travel;
        const dy = Math.sin(rad) * c.travel;
        return (
          <motion.div
            key={`comet-${c.id}`}
            className="absolute"
            style={{ left: `${c.startX}%`, top: `${c.startY}%`, width: 2, height: 2 }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: [0, dx], y: [0, dy], opacity: [0, 1, 1, 0] }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              repeatDelay: c.repeatDelay,
              ease: "easeIn",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                background: darkMode ? "#ffffff" : "#f44336",
                boxShadow: darkMode
                  ? "0 0 6px 2px rgba(255,255,255,0.8)"
                  : "0 0 6px 2px rgba(244,67,54,0.6)",
              }}
            />
            <div
              className="absolute"
              style={{
                width: 90,
                height: 1.5,
                background: darkMode
                  ? "linear-gradient(90deg, rgba(255,255,255,0.9), transparent)"
                  : "linear-gradient(90deg, rgba(244,67,54,0.7), transparent)",
                transform: `rotate(${c.angle}deg)`,
                transformOrigin: "left center",
                right: "100%",
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}