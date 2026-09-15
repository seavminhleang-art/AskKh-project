import React, { useMemo } from "react";
import { motion } from "framer-motion";

export default function NeuralNetwork({ darkMode, nodeCount = 22 }) {
  const accent = darkMode ? "#f44336" : "#f44336";
  const lineColor = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";

  // Generate nodes at random positions
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2.5,
      pulseDuration: 2 + Math.random() * 3,
      pulseDelay: Math.random() * 4,
    }));
  }, [nodeCount]);

  // Connect each node to its 2 nearest neighbors
  const connections = useMemo(() => {
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const lines = [];
    const seen = new Set();

    nodes.forEach((node) => {
      const others = nodes
        .filter((n) => n.id !== node.id)
        .sort((a, b) => dist(node, a) - dist(node, b))
        .slice(0, 2);

      others.forEach((other) => {
        const key = [node.id, other.id].sort().join("-");
        if (!seen.has(key) && dist(node, other) < 35) {
          seen.add(key);
          lines.push({
            key,
            x1: node.x,
            y1: node.y,
            x2: other.x,
            y2: other.y,
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 5,
          });
        }
      });
    });

    return lines;
  }, [nodes]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Static connection lines */}
        {connections.map((c) => (
          <line
            key={c.key}
            x1={c.x1}
            y1={c.y1}
            x2={c.x2}
            y2={c.y2}
            stroke={lineColor}
            strokeWidth="0.15"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Traveling pulses along the connections */}
        {connections.map((c) => (
          <motion.circle
            key={`pulse-${c.key}`}
            r="0.5"
            fill={accent}
            initial={{ cx: c.x1, cy: c.y1, opacity: 0 }}
            animate={{
              cx: [c.x1, c.x2],
              cy: [c.y1, c.y2],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 4,
              ease: "easeInOut",
            }}
            style={{ filter: `drop-shadow(0 0 1.5px ${accent})` }}
          />
        ))}
      </svg>

      {/* Nodes (rendered in HTML for crisp glow, positioned to match SVG coords) */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            background: darkMode ? "#e0e0e0" : "#666",
            translateX: "-50%",
            translateY: "-50%",
            boxShadow: darkMode
              ? "0 0 4px 1px rgba(255,255,255,0.4)"
              : "0 0 4px 1px rgba(0,0,0,0.15)",
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: node.pulseDuration,
            delay: node.pulseDelay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}