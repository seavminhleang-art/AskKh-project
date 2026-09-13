import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import HomePage from "./Components/Pages/HomePage.jsx";
import LostAndFoundPage from "./Components/Pages/LostAndFoundPage.jsx";
import LeaderboardPage from "./Components/Pages/leaderboard/LeaderBoarderPage.jsx";
import QACommunity from "./Components/Pages/Q&ACommunity.jsx";
import LoginPage from "./Components/Auth/LoginPage.jsx";
import RegisterPage from "./Components/Auth/RegisterPage.jsx";
import { LanguageProvider } from "./Components/Language/LanguageContext.jsx";
import { ThemeProvider, useTheme } from "./components/theme-provider.jsx";

function RootLayout() {
  const { resolvedTheme, setTheme } = useTheme();
  const darkMode = resolvedTheme === "dark";

  const setDarkMode = (nextValue) => {
    setTheme((currentTheme) => {
      const currentIsDark = currentTheme === "dark";
      const nextIsDark = typeof nextValue === "function"
        ? nextValue(currentIsDark)
        : nextValue;

      return nextIsDark ? "dark" : "light";
    });
  };

  return <App darkMode={darkMode} setDarkMode={setDarkMode} />;
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "about",
        element: <div className="p-12 text-center text-lg font-medium">About Us Page</div>,
      },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "community/qa", element: <QACommunity /> },
      { path: "community/lost-found", element: <LostAndFoundPage /> },
      {
        path: "contact",
        element: <div className="p-12 text-center text-lg font-medium">Contact Page</div>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light">
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
