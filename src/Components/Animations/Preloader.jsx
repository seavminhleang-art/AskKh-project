import React, { useState, useEffect } from "react";

const Preloader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[var(--bg-main)] transition-opacity duration-500">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
          <span className="text-brand-primary font-semibold text-lg animate-pulse">
            Loading AskKh...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Preloader;
