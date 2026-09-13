import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Nav/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar always visible */}
      <Navbar />

      {/* Page content changes here */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer always visible */}
      <Footer />
    </div>
  );
}
