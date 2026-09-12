import React, { useRef, useEffect } from "react";

export default function SpaceWarpCanvas({ darkMode, particleCount = 400 }) {
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

    // Space palette — deep indigo through blue to bright white-blue "hot" core
    const SPACE_COLORS = [
      [40, 20, 90],     // deep indigo
      [70, 50, 160],    // violet-blue
      [90, 110, 220],   // blue
      [160, 190, 255],  // pale blue
      [255, 255, 255],  // white-hot star core
    ];

    let w, h, cx, cy;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cx = w / 2;
      cy = h / 2; // centered vanishing point, like flying straight through space
    }
    resize();
    window.addEventListener("resize", resize);

    function colorFor(t) {
      const scaled = t * (SPACE_COLORS.length - 1);
      const i = Math.min(SPACE_COLORS.length - 2, Math.floor(scaled));
      const frac = scaled - i;
      const a = SPACE_COLORS[i];
      const b = SPACE_COLORS[i + 1];
      return [
        a[0] + (b[0] - a[0]) * frac,
        a[1] + (b[1] - a[1]) * frac,
        a[2] + (b[2] - a[2]) * frac,
      ];
    }

    function makeParticle(scatter = false) {
      const angle = Math.random() * Math.PI * 2; // uniform sphere, not upward-biased
      return {
        angle,
        radius: scatter ? Math.random() * Math.max(w, h) * 0.5 : Math.random() * 15,
        z: 0.3 + Math.random() * 0.7,
        flicker: Math.random() * Math.PI * 2,
        size: 0.8 + Math.random() * 1.6,
      };
    }

    let particles = Array.from({ length: particleCount }).map(() => makeParticle(true));

    function draw(t) {
      const target = isHoveredRef.current ? HOVER_SPEED : BASE_SPEED;
      speedRef.current += (target - speedRef.current) * SPEED_EASE;
      const speed = speedRef.current;

      // Cool-tinted trail fade
      ctx.fillStyle = darkMode ? "rgba(4,4,12,0.32)" : "rgba(240,242,250,0.32)";
      ctx.fillRect(0, 0, w, h);

      const maxDist = Math.max(w, h) * 0.75;

      particles.forEach((p) => {
        const prevRadius = p.radius;
        p.radius += speed * p.z * (1 + speed * 0.04);

        if (p.radius > maxDist) {
          Object.assign(p, makeParticle(false));
          return;
        }

        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius;
        const prevX = cx + Math.cos(p.angle) * prevRadius;
        const prevY = cy + Math.sin(p.angle) * prevRadius;
        const progress = p.radius / maxDist;

        const flicker = 0.85 + 0.15 * Math.sin(t * 0.006 + p.flicker);
        const [r, g, b] = colorFor(Math.min(1, progress * 1.2));
        const opacity = Math.min(1, progress * 1.4 + 0.15) * flicker;

        // At low speed: draw dots (calm drifting stars).
        // At high speed (hover): draw streaks (warp-speed motion blur).
        if (speed < 5) {
          const radius = p.size * (0.6 + progress * 0.7);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${opacity})`;
          ctx.shadowColor = `rgba(${r | 0},${g | 0},${b | 0},0.8)`;
          ctx.shadowBlur = 3;
          ctx.fill();
        } else {
          const lineWidth = p.size * (0.5 + progress * 1.2) * (speed / 6);
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(${r | 0},${g | 0},${b | 0},${opacity})`;
          ctx.lineWidth = lineWidth;
          ctx.shadowColor = `rgba(${r | 0},${g | 0},${b | 0},0.7)`;
          ctx.shadowBlur = 5;
          ctx.stroke();
        }
      });
      ctx.shadowBlur = 0;

      // Cool nebula glow bloom at the vanishing point
      const glowRadius = 70 + speed * 10;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
      glow.addColorStop(0, darkMode ? "rgba(140,160,255,0.30)" : "rgba(120,140,255,0.20)");
      glow.addColorStop(1, "rgba(120,140,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);

      animationId = requestAnimationFrame(draw);
    }

    ctx.fillStyle = darkMode ? "#04040c" : "#f0f2fa";
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
      style={{ zIndex: 0, background: darkMode ? "#04040c" : "#f0f2fa" }}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}