import React, { useState, useEffect } from "react";
import LoadingSpinner from "../common/LoadingSpinner.jsx";

const Preloader = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Mount the app immediately so routes and requests load during the intro. */}
      <div style={{ display: isLoading ? "none" : "contents" }}>
        {children}
      </div>
      {isLoading && <LoadingSpinner />}
    </>
  );
};

export default Preloader;
