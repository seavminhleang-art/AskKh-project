import React, { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const updateScrollCompletion = () => {
      const currentScroll = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setCompletion(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
      }
    };

    window.addEventListener("scroll", updateScrollCompletion);
    return () => window.removeEventListener("scroll", updateScrollCompletion);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-1 z-[100] transition-all duration-150 ease-out"
      style={{
        width: `${completion}%`,
        backgroundColor: "var(--color-brand-primary)",
        boxShadow: "0 0 10px var(--color-brand-primary)"
      }}
    />
  );
};

export default ScrollProgress;
