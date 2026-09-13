import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage.jsx";
import "./i18n"; 
import LostAndFoundPage from "./Components/Pages/LostAndFoundPage.jsx";

function RootLayout() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return <App darkMode={darkMode} setDarkMode={setDarkMode} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <div className="p-12 text-center text-lg font-medium">About Us Page</div>,
      },
      {
        path: "leaderboard",
        element: <div className="p-12 text-center text-lg font-medium">Leaderboard Page</div>,
      },
      {
        path: "community/qa",
        element: <div className="p-12 text-center text-lg font-medium">Q&A Community Page</div>,
      },
      {
        path: "community/lost-found",
        element: <LostAndFoundPage/>,
      },
      {
        path: "contact",
        element: <div className="p-12 text-center text-lg font-medium">Contact Page</div>,
      },
    ],
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);