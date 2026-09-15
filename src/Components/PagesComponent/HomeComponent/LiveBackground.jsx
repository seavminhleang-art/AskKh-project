import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function LiveBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const nodesCount = 35;
    const nodes = [];

    for (let i = 0; i < nodesCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            // Dynamically adjust line color for dark/light mode
            ctx.strokeStyle = darkMode 
              ? `rgba(59, 130, 246, ${0.18 * (1 - dist / 140)})` 
              : `rgba(0, 86, 255, ${0.12 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? "rgba(59, 130, 246, 0.5)" : "rgba(0, 86, 255, 0.3)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full opacity-70" />
      
      {/* Background glowing blur gradient adapted to dark/light mode */}
      <div className={`absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full blur-[130px] -z-10 transition-colors duration-300 ${
        darkMode ? "bg-blue-900/10" : "bg-blue-100/50"
      }`} />

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-24 right-[28%] shadow-lg px-3 py-1.5 rounded-xl font-bold text-xs text-amber-500 flex items-center gap-1.5 z-10 backdrop-blur-md border ${
          darkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-gray-100"
        }`}
      >
        <span>⚡</span> JS
      </motion.div>

      <motion.div
        animate={{ y: [0, 18, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/3 right-[15%] shadow-lg px-3 py-1.5 rounded-xl font-bold text-xs text-red-500 flex items-center gap-1.5 z-10 backdrop-blur-md border ${
          darkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-gray-100"
        }`}
      >
        <span>🔥</span> HTML5
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-1/3 right-[32%] shadow-lg px-3 py-1.5 rounded-xl font-bold text-xs text-blue-500 flex items-center gap-1.5 z-10 backdrop-blur-md border ${
          darkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-gray-100"
        }`}
      >
        <span>⚛️</span> React
      </motion.div>

      <motion.div
        animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute bottom-20 right-[20%] shadow-lg px-3 py-1.5 rounded-xl font-bold text-xs text-yellow-500 flex items-center gap-1.5 z-10 backdrop-blur-md border ${
          darkMode ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-gray-100"
        }`}
      >
        <span>🐍</span> Python
      </motion.div>
    </div>
  );
}