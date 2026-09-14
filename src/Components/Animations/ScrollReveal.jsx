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

  const animationClasses = {
    fadeInUp: "animate-[fadeInUp_0.6s_ease-out_forwards]",
    fadeIn: "animate-[fadeIn_0.6s_ease-out_forwards]",
    scaleIn: "animate-[scaleIn_0.6s_ease-out_forwards]",
  };

  return (
    <div
      ref={domRef}
      className={`opacity-0 ${className} ${
        isVisible ? animationClasses[animation] || animationClasses.fadeInUp : ""
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
