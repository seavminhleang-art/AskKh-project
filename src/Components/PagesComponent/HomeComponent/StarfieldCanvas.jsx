import React, { useRef, useEffect } from "react";

export default function StarfieldCanvas({ darkMode, starCount = 500 }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const isHoveredRef = useRef(false);
  const speedRef = useRef(2); // current speed, eased toward target each frame

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const BASE_SPEED = 2;
    const HOVER_SPEED = 14; // "zoom in" — much faster warp on hover
    const SPEED_EASE = 0.04; // how quickly speed ramps toward target

    let w, h, cx, cy;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      cx = w / 2;
      cy = h / 2;
    }
    resize();
    window.addEventListener("resize", resize);

    function makeStar() {
      // Start near center with random angle, small radius
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 40;
      return {
        angle,
        radius,
        z: 0.3 + Math.random() * 0.7, // depth factor, affects speed/size
        prevX: cx + Math.cos(angle) * radius,
        prevY: cy + Math.sin(angle) * radius,
      };
    }

    let stars = Array.from({ length: starCount }).map(() => {
      const s = makeStar();
      // Scatter initial radius across the whole field so it doesn't start looking "empty"
      s.radius = Math.random() * Math.max(w, h) * 0.6;
      s.prevX = cx + Math.cos(s.angle) * s.radius;
      s.prevY = cy + Math.sin(s.angle) * s.radius;
      return s;
    });

    function draw() {
      // Ease current speed toward hover/base target
      const target = isHoveredRef.current ? HOVER_SPEED : BASE_SPEED;
      speedRef.current += (target - speedRef.current) * SPEED_EASE;
      const speed = speedRef.current;

      // Trail fade — darker/lighter base tint depending on theme
      ctx.fillStyle = darkMode ? "rgba(5,5,8,0.35)" : "rgba(245,245,247,0.35)";
      ctx.fillRect(0, 0, w, h);

      const strokeColor = darkMode ? "255,255,255" : "20,20,25";

      stars.forEach((s) => {
        const prevX = s.prevX;
        const prevY = s.prevY;

        s.radius += speed * s.z * (1 + speed * 0.05);

        const x = cx + Math.cos(s.angle) * s.radius;
        const y = cy + Math.sin(s.angle) * s.radius;

        // Reset star once it flies off-screen
        const maxDist = Math.max(w, h) * 0.75;
        if (s.radius > maxDist) {
          const fresh = makeStar();
          s.angle = fresh.angle;
          s.radius = fresh.radius;
          s.z = fresh.z;
          s.prevX = cx + Math.cos(s.angle) * s.radius;
          s.prevY = cy + Math.sin(s.angle) * s.radius;
          return;
        }

        const dist = Math.hypot(x - cx, y - cy);
        const opacity = Math.min(1, (dist / (Math.max(w, h) * 0.5)) * s.z + 0.15);
        const lineWidth = 0.5 + s.z * (speed > 6 ? 1.8 : 0.8);

        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(${strokeColor},${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        s.prevX = x;
        s.prevY = y;
      });

      animationId = requestAnimationFrame(draw);
    }

    // Base fill first frame so trails have something to fade against
    ctx.fillStyle = darkMode ? "#050508" : "#f5f5f7";
    ctx.fillRect(0, 0, w, h);

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [starCount, darkMode]);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 overflow-hidden pointer-events-auto"
      style={{ zIndex: 0, background: darkMode ? "#050508" : "#f5f5f7" }}
      onMouseEnter={() => (isHoveredRef.current = true)}
      onMouseLeave={() => (isHoveredRef.current = false)}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}