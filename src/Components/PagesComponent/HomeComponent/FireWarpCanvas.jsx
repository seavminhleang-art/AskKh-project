import React, { useRef, useEffect } from "react";

export default function FireWarpCanvas({ darkMode, particleCount = 400 }) {
  const canvasRef = useRef(null);
  const isHoveredRef = useRef(false);
  const speedRef = useRef(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const BASE_SPEED = 2;
    const HOVER_SPEED = 13;
    const SPEED_EASE = 0.04;

    // Fire palette — deep red through orange to yellow-white hot core
    const FIRE_COLORS = [
      [120, 20, 10],   // deep ember red
      [200, 60, 10],   // orange-red
      [235, 120, 20],  // orange
      [250, 180, 60],  // amber
      [255, 230, 140], // hot yellow-white
    ];

    let w, h, cx, cy;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cx = w / 2;
      cy = h * 0.55; // fire origin slightly below center, like flames rising
    }
    resize();
    window.addEventListener("resize", resize);

    function colorFor(t) {
      // t: 0 (just born, deep red) -> 1 (fully out, hot white before fading)
      const scaled = t * (FIRE_COLORS.length - 1);
      const i = Math.min(FIRE_COLORS.length - 2, Math.floor(scaled));
      const frac = scaled - i;
      const a = FIRE_COLORS[i];
      const b = FIRE_COLORS[i + 1];
      return [
        a[0] + (b[0] - a[0]) * frac,
        a[1] + (b[1] - a[1]) * frac,
        a[2] + (b[2] - a[2]) * frac,
      ];
    }

    function makeParticle(scatter = false) {
      const angle = Math.random() * Math.PI * 2;
      // Bias angle upward-ish for a "rising flame" feel rather than pure sphere
      const biasedAngle = angle - Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.4;
      return {
        angle: biasedAngle,
        radius: scatter ? Math.random() * Math.max(w, h) * 0.5 : Math.random() * 20,
        z: 0.3 + Math.random() * 0.7,
        flicker: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 2,
      };
    }

    let particles = Array.from({ length: particleCount }).map(() => makeParticle(true));

    function draw(t) {
      const target = isHoveredRef.current ? HOVER_SPEED : BASE_SPEED;
      speedRef.current += (target - speedRef.current) * SPEED_EASE;
      const speed = speedRef.current;

      // Warm-tinted trail fade instead of neutral black/white
      ctx.fillStyle = darkMode ? "rgba(10,4,2,0.30)" : "rgba(250,245,240,0.30)";
      ctx.fillRect(0, 0, w, h);

      const maxDist = Math.max(w, h) * 0.7;

      particles.forEach((p) => {
        p.radius += speed * p.z * (1 + speed * 0.04);

        if (p.radius > maxDist) {
          Object.assign(p, makeParticle(false));
          return;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const progress = p.radius / maxDist; // 0 near origin -> 1 near edge

        // Flicker adds subtle brightness variation per-particle over time
        const flicker = 0.85 + 0.15 * Math.sin(t * 0.006 + p.flicker);
        const [r, g, b] = colorFor(Math.min(1, progress * 1.3));
        const opacity = Math.min(1, progress * 1.4 + 0.1) * flicker;
        const radius = (p.size + speed * 0.15 * p.z) * (0.6 + progress * 0.8);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${opacity})`;
        ctx.shadowColor = `rgba(${r | 0},${g | 0},${b | 0},0.8)`;
        ctx.shadowBlur = 6 + speed * 0.8;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Warm glow bloom at the origin point (hotter/bigger on hover)
      const glowRadius = 80 + speed * 12;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      glow.addColorStop(0, darkMode ? "rgba(255,200,100,0.35)" : "rgba(255,160,60,0.25)");
      glow.addColorStop(1, "rgba(255,160,60,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);

      animationId = requestAnimationFrame(draw);
    }

    ctx.fillStyle = darkMode ? "#0a0402" : "#faf5f0";
    ctx.fillRect(0, 0, w, h);

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [particleCount, darkMode]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-auto"
      style={{ zIndex: 0, background: darkMode ? "#0a0402" : "#faf5f0" }}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}