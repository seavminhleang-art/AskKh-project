import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import About from "./Components/Pages/About.jsx";
import TermsAndConditions from "./Components/Pages/TermAndConditions.jsx";
import PrivacyPolicy from "./Components/Pages/Policy.jsx";
import HomePage from "./Components/Pages/HomePage.jsx";
import LostAndFoundPage from "./Components/Pages/LostAndFoundPage.jsx";
import LeaderboardPage from "./Components/Pages/leaderboard/LeaderBoarderPage.jsx";
import QACommunity from "./Components/Pages/Q&ACommunity.jsx";
import LoginPage from "./Components/Auth/LoginPage.jsx";
import RegisterPage from "./Components/Auth/RegisterPage.jsx";
import { LanguageProvider } from "./Components/Language/LanguageContext.jsx";
import { ThemeProvider, useTheme } from "./Components/theme-provider.jsx";
import store from "./store/store.js";
import DashboardPage from "./pages/user/DashboardPage.jsx";
import WorkspaceListPage from "./pages/user/WorkspaceListPage.jsx";
import UserPostPage from "./pages/user/UserPostPage.jsx";
import AdminDashboardPage from "./Components/Pages/admin/dashboard/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";
import AuthInitializer from "./Components/Auth/AuthInitializer.jsx";

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
      { path: "community/qa", element: <QACommunity /> },
      { path: "community/lost-found", element: <LostAndFoundPage /> },
      { path: "about", element: <About /> },
      { path: "terms", element: <TermsAndConditions /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      // Keep the URL used by the registration page working as well.
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "*", element: <HomePage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <UserLayout />,
        children: [
          { path: "dashboard", element: <DashboardPage /> },
          { path: "dashboard/questions", element: <WorkspaceListPage page="questions" /> },
          { path: "dashboard/questions/new", element: <UserPostPage kind="question" /> },
          { path: "dashboard/lost-found", element: <WorkspaceListPage page="lost-found" /> },
          { path: "dashboard/lost-found/new", element: <UserPostPage kind="item" /> },
          { path: "dashboard/matches", element: <WorkspaceListPage page="matches" /> },
          { path: "dashboard/claims", element: <WorkspaceListPage page="claims" /> },
          { path: "dashboard/notifications", element: <WorkspaceListPage page="notifications" /> },
        ],
      },
      {
        element: <UserLayout mode="admin" dashboardPath="/admin/dashboard" />,
        children: [
          { path: "admin", element: <AdminDashboardPage /> },
          { path: "admin/dashboard", element: <AdminDashboardPage /> },
        ],
      },
    ],
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <AuthInitializer>
            <RouterProvider router={router} />
          </AuthInitializer>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
