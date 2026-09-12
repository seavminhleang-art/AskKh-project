import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Nav/NavBarComponent.jsx";
import FooterComponent from "./Components/Footer/FooterComponet.jsx";

function App({ darkMode, setDarkMode }) {
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      darkMode ? "bg-[#09090b] text-slate-100" : "bg-[#f5f5f5] text-gray-900"
    }`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow">
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>
      <FooterComponent darkMode={darkMode} />
    </div>
  );
}

export default App;