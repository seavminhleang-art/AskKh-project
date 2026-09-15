import React, { useRef, useEffect } from "react";

const THEMES = {
  dark: {
    background: [10, 10, 10],
    particleColors: ["#ff4d4d", "#4d94ff", "#4dff88", "#ffd24d", "#00e0d0"],
    lineOpacity: 0.4,
    mouseLineOpacity: 0.7,
    cursorColor: [255, 255, 255],
    shadowBlur: 4,
  },
  light: {
    background: [244, 244, 245],
    particleColors: ["#d32f2f", "#1565c0", "#2e7d32", "#e65100", "#00838f"],
    lineOpacity: 0.22,
    mouseLineOpacity: 0.45,
    cursorColor: [17, 17, 17],
    shadowBlur: 2,
  },
};

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function lerpRgb(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}
function rgbStr([r, g, b], a = 1) {
  return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`;
}

export default function ParticleNetwork({ darkMode, particleCount = 90 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  const particlesRef = useRef([]);
  const darkModeRef = useRef(darkMode);

  // Theme blend state, read/written only inside the animation loop
  const blendRef = useRef({
    current: darkMode ? THEMES.dark : THEMES.light,
    from: darkMode ? THEMES.dark : THEMES.light,
    to: darkMode ? THEMES.dark : THEMES.light,
    progress: 1,
  });

  // Just record the latest prop value — the animation loop detects the change itself
  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);

  function blendTheme(a, b, t) {
    return {
      background: lerpRgb(a.background, b.background, t),
      lineOpacity: lerp(a.lineOpacity, b.lineOpacity, t),
      mouseLineOpacity: lerp(a.mouseLineOpacity, b.mouseLineOpacity, t),
      cursorColor: lerpRgb(a.cursorColor, b.cursorColor, t),
      shadowBlur: lerp(a.shadowBlur, b.shadowBlur, t),
    };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const CONNECT_DIST = 130;
    const MOUSE_CONNECT_DIST = 180;
    const TRANSITION_SPEED = 0.03;
    let lastIsDark = darkModeRef.current;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    if (particlesRef.current.length === 0) {
      const initialTheme = darkModeRef.current ? THEMES.dark : THEMES.light;
      particlesRef.current = Array.from({ length: particleCount }).map(() => {
        const paletteIndex = Math.floor(Math.random() * THEMES.dark.particleColors.length);
        const rgb = hexToRgb(initialTheme.particleColors[paletteIndex]);
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 1.5 + Math.random() * 1.5,
          paletteIndex,
          targetColor: rgb,
          currentColor: rgb,
        };
      });
    }

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    }
    function handleMouseLeave() {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    }
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      // Detect a theme flip each frame — safe, since particles are guaranteed to exist by now
      const isDark = darkModeRef.current;
      if (isDark !== lastIsDark) {
        lastIsDark = isDark;
        const b = blendRef.current;
        const settledFrom = b.progress >= 1 ? b.to : blendTheme(b.from, b.to, 1 - Math.pow(1 - b.progress, 3));
        b.from = settledFrom;
        b.to = isDark ? THEMES.dark : THEMES.light;
        b.progress = 0;

        const newTheme = isDark ? THEMES.dark : THEMES.light;
        particlesRef.current.forEach((p) => {
          p.targetColor = hexToRgb(newTheme.particleColors[p.paletteIndex]);
        });
      }

      const b = blendRef.current;
      if (b.progress < 1) b.progress = Math.min(1, b.progress + TRANSITION_SPEED);
      const eased = 1 - Math.pow(1 - b.progress, 3);
      const theme = blendTheme(b.from, b.to, eased);

      ctx.fillStyle = rgbStr(theme.background);
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        p.currentColor = lerpRgb(p.currentColor, p.targetColor, 0.05);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = rgbStr(p.currentColor);
        ctx.shadowColor = rgbStr(p.currentColor);
        ctx.shadowBlur = theme.shadowBlur;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const bb = particles[j];
          const dx = a.x - bb.x;
          const dy = a.y - bb.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const opacity = 1 - dist / CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(bb.x, bb.y);
            ctx.strokeStyle = rgbStr(a.currentColor, opacity * theme.lineOpacity);
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      const mouse = mouseRef.current;
      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach((p) => {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MOUSE_CONNECT_DIST) {
            const opacity = 1 - dist / MOUSE_CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = rgbStr(p.currentColor, opacity * theme.mouseLineOpacity);
            ctx.lineWidth = 1;
            ctx.stroke();

            p.x -= dx * 0.002;
            p.y -= dy * 0.002;
          }
        });

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = rgbStr(theme.cursorColor);
        ctx.shadowColor = rgbStr(theme.cursorColor);
        ctx.shadowBlur = theme.shadowBlur * 2;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [particleCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-auto" style={{ zIndex: 0 }}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}