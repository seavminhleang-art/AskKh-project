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
import LegalPage from "./Components/Legal/LegalPage.jsx";
import { LanguageProvider } from "./Components/Language/LanguageContext.jsx";
import { ThemeProvider as LegacyThemeProvider } from "./Components/theme-provider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import store from "./store/store.js";
import DashboardPage from "./pages/user/DashboardPage.jsx";
import WorkspaceListPage from "./pages/user/WorkspaceListPage.jsx";
import UserPostPage from "./pages/user/UserPostPage.jsx";
import AdminDashboardPage from "./features/admin/workspace/Dashboard.jsx";
import AdminShell from "./features/admin/workspace/AdminShell.jsx";
import AdminResourcePage from "./features/admin/workspace/ResourcePage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";

function RootLayout() {
  return <App />;
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
      { path: "terms", element: <LegalPage documentType="terms" /> },
      { path: "privacy", element: <LegalPage documentType="privacy" /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
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
        element: <ProtectedRoute requiredRole="admin" />,
        children: [{
          element: <AdminShell />,
          children: [
            { path: "admin", element: <AdminDashboardPage /> },
            { path: "admin/dashboard", element: <AdminDashboardPage /> },
            ...["users", "posts", "comments", "tags", "lost-found", "moderation", "marketplace", "notifications", "settings"].map((resource) => ({
              path: `admin/${resource}`,
              element: <AdminResourcePage key={resource} resource={resource} />,
            })),
          ],
        }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <LegacyThemeProvider defaultTheme="light">
        <ThemeProvider>
          <LanguageProvider>
            <RouterProvider router={router} />
          </LanguageProvider>
        </ThemeProvider>
      </LegacyThemeProvider>
    </Provider>
  </React.StrictMode>,
);
