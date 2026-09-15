import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  animation = "fadeInUp",
  delay = 0,
  className = ""
}) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(domRef.current);
        }
      },
      { threshold: 0.1 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hiddenClasses = {
    fadeInUp: "opacity-0 translate-y-4",
    fadeIn: "opacity-0",
    scaleIn: "opacity-0 scale-95",
  };

  return (
    <div
      ref={domRef}
      className={`${className} transition-[opacity,transform] duration-600 ease-out ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : hiddenClasses[animation] || hiddenClasses.fadeInUp
      }`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
