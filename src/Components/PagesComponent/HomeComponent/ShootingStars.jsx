import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function ShootingStars({ darkMode, count = 12 }) {
  // Generate randomized star configs once
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const startX = Math.random() * 100; // vw %
      const startY = Math.random() * 60;  // vh % (upper 60% of screen)
      const travel = 250 + Math.random() * 200; // px distance traveled
      const angle = 30 + Math.random() * 20; // degrees, diagonal fall
      const duration = 1.5 + Math.random() * 2; // seconds to cross
      const delay = Math.random() * 8; // stagger starts
      const repeatDelay = 2 + Math.random() * 6; // gap between repeats
      const size = 1 + Math.random() * 1.5;

      return { id: i, startX, startY, travel, angle, duration, delay, repeatDelay, size };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => {
        const rad = (star.angle * Math.PI) / 180;
        const dx = Math.cos(rad) * star.travel;
        const dy = Math.sin(rad) * star.travel;

        return (
          <motion.div
            key={star.id}
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: 2,
              height: 2,
            }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{
              x: [0, dx],
              y: [0, dy],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatDelay: star.repeatDelay,
              ease: "easeIn",
            }}
          >
            {/* Comet head */}
            <div
              className="absolute rounded-full"
              style={{
                width: star.size * 3,
                height: star.size * 3,
                background: darkMode ? "#ffffff" : "#f44336",
                boxShadow: darkMode
                  ? "0 0 6px 2px rgba(255,255,255,0.8)"
                  : "0 0 6px 2px rgba(244,67,54,0.6)",
              }}
            />
            {/* Comet tail */}
            <div
              className="absolute"
              style={{
                width: 80,
                height: 1.5,
                background: darkMode
                  ? "linear-gradient(90deg, rgba(255,255,255,0.9), transparent)"
                  : "linear-gradient(90deg, rgba(244,67,54,0.7), transparent)",
                transform: `rotate(${star.angle}deg)`,
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