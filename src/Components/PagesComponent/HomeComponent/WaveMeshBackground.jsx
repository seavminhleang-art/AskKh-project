import React, { useRef, useEffect } from "react";

export default function WaveMeshBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0;

    const stars = Array.from({ length: 120 }).map(() => ({
      x: Math.random(),
      y: Math.random() * 0.4, // upper 40% of screen only
      size: Math.random() * 1.5 + 0.3,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const ROWS = 40;
    const COLS = 70;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const horizonY = h * 0.42;

      // Background
      ctx.fillStyle = darkMode ? "#050510" : "#0a0a18";
      ctx.fillRect(0, 0, w, h);

      // Subtle gradient glow near horizon
      const horizonGlow = ctx.createRadialGradient(
        w / 2, horizonY, 0,
        w / 2, horizonY, w * 0.6
      );
      horizonGlow.addColorStop(0, "rgba(80,110,255,0.18)");
      horizonGlow.addColorStop(1, "rgba(80,110,255,0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, w, h);

      // Stars above horizon
      stars.forEach((s) => {
        const twinkle = 0.4 + 0.6 * Math.abs(Math.sin(time * s.twinkleSpeed + s.twinkleOffset));
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * horizonY, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Precompute row screen positions (perspective: rows near camera spread out more)
      const rowYs = [];
      const rowSpreads = [];
      for (let r = 0; r < ROWS; r++) {
        const t = r / (ROWS - 1); // 0 = far/horizon, 1 = near/bottom
        const eased = Math.pow(t, 2.2); // nonlinear perspective falloff
        rowYs.push(horizonY + eased * (h - horizonY));
        rowSpreads.push(0.15 + eased * 0.85); // horizontal spread grows toward camera
      }

      // Build point grid with wave displacement
      const points = [];
      for (let r = 0; r < ROWS; r++) {
        const row = [];
        const spread = rowSpreads[r];
        const baseY = rowYs[r];
        const t = r / (ROWS - 1);

        for (let c = 0; c < COLS; c++) {
          const cx = c / (COLS - 1) - 0.5; // -0.5 to 0.5
          const screenX = w / 2 + cx * w * spread;

          // Wave height: layered sines for organic undulation, moving over time
          const waveX = cx * 8;
          const waveT = t * 6;
          const height =
            Math.sin(waveX * 1.5 + time * 0.6 + waveT) * 14 * (0.3 + t) +
            Math.sin(waveX * 3 - time * 0.9 + waveT * 1.5) * 8 * (0.3 + t) +
            Math.sin(waveT * 2 - time * 0.4) * 10;

          row.push({ x: screenX, y: baseY - height * t, h: height });
        }
        points.push(row);
      }

      // Draw mesh lines
      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath();
        for (let c = 0; c < COLS; c++) {
          const p = points[r][c];
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const t = r / (ROWS - 1);
        const brightness = 0.15 + t * 0.5;
        ctx.strokeStyle = `rgba(90,140,255,${brightness})`;
        ctx.lineWidth = 0.6 + t * 1.2;
        ctx.shadowColor = "rgba(90,150,255,0.6)";
        ctx.shadowBlur = 4 * t;
        ctx.stroke();
      }

      for (let c = 0; c < COLS; c += 2) {
        ctx.beginPath();
        for (let r = 0; r < ROWS; r++) {
          const p = points[r][c];
          if (r === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = "rgba(90,140,255,0.15)";
        ctx.lineWidth = 0.5;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      // Warm accent highlights on wave peaks (like the orange/pink in the reference)
      for (let r = ROWS - 15; r < ROWS; r += 3) {
        for (let c = 0; c < COLS; c += 4) {
          const p = points[r][c];
          if (p.h > 10) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,150,120,0.5)";
            ctx.shadowColor = "rgba(255,150,120,0.8)";
            ctx.shadowBlur = 6;
            ctx.fill();
          }
        }
      }
      ctx.shadowBlur = 0;

      time += 0.012;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}