import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function LightRibbons({ darkMode, count = 5 }) {
  const ribbons = useMemo(() => {
    const palette = darkMode
      ? ["#f44336", "#3f51b5", "#8e24aa", "#00bcd4", "#ff9800"]
      : ["#f44336", "#3f51b5", "#8e24aa", "#00bcd4", "#ff9800"];

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      color: palette[i % palette.length],
      topOffset: (i / count) * 100 + Math.random() * 8,
      width: 250 + Math.random() * 200,
      duration: 10 + Math.random() * 8,
      delay: Math.random() * 6,
      tilt: -18 - Math.random() * 10,
      thickness: 1.5 + Math.random() * 2,
    }));
  }, [darkMode, count]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {ribbons.map((r) => (
        <motion.div
          key={r.id}
          className="absolute"
          style={{
            top: `${r.topOffset}%`,
            left: "-40%",
            width: r.width,
            height: r.thickness,
            background: `linear-gradient(90deg, transparent, ${r.color}, transparent)`,
            transform: `rotate(${r.tilt}deg)`,
            opacity: darkMode ? 0.55 : 0.35,
            filter: `blur(1px) drop-shadow(0 0 6px ${r.color})`,
          }}
          animate={{
            left: ["-40%", "140%"],
          }}
          transition={{
            duration: r.duration,
            delay: r.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}