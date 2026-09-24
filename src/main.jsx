import { ToastContainer } from "react-toastify";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import Preloader from "./Components/Animations/Preloader.jsx";

import TermsAndConditions from "./Components/Pages/TermAndConditions.jsx";
import PrivacyPolicy from "./Components/Pages/Policy.jsx";


import LoginPage from "./Components/Auth/LoginPage.jsx";
import RegisterPage from "./Components/Auth/RegisterPage.jsx";
import VerifyEmailPage from "./Components/Auth/VerifyEmailPage.jsx";
import ResetPasswordPage from "./Components/Auth/ResetPasswordPage.jsx";
import { LanguageProvider } from "./Components/Language/LanguageContext.jsx";
import { ThemeProvider as LegacyThemeProvider } from "./Components/theme-provider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import store from "./store/store.js";
import DashboardPage from "./pages/user/DashboardPage.jsx";
import WorkspaceListPage from "./pages/user/WorkspaceListPage.jsx";
import ProfilePage from './pages/user/ProfilePage.jsx';
import QuestionDetailPage from './pages/user/QuestionDetailPage.jsx';
import UserPostPage from "./pages/user/UserPostPage.jsx";
import AdminDashboardPage from "./features/admin/workspace/Dashboard.jsx";
import AdminShell from "./features/admin/workspace/AdminShell.jsx";
import AdminResourcePage from "./features/admin/workspace/ResourcePage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import UserLayout from "./layouts/UserLayout.jsx";

// Load the page and minimum skeleton duration concurrently.
// React caches each resolved page, so revisiting it does not repeat the delay.
const lazyWithSkeletonDelay = (loadPage) => React.lazy(async () => {
  const [page] = await Promise.all([
    loadPage(),
    new Promise((resolve) => setTimeout(resolve, 2000)),
  ]);
  return page;
});

const About = lazyWithSkeletonDelay(() => import("./Components/Pages/About.jsx"));

const HomePage = lazyWithSkeletonDelay(() => import("./Components/Pages/HomePage.jsx"));

const LostAndFoundPage = lazyWithSkeletonDelay(() => import("./Components/Pages/LostAndFoundPage.jsx"));

const LeaderboardPage = lazyWithSkeletonDelay(() => import("./Components/Pages/leaderboard/LeaderBoarderPage.jsx"));

const QACommunity = lazyWithSkeletonDelay(() => import("./Components/Pages/Q&ACommunity.jsx"));

function RootLayout() {
  return <App />;
}

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verify-email", element: <VerifyEmailPage /> },
  { path: "/auth/verify-email", element: <VerifyEmailPage /> },
  { path: "/verify", element: <VerifyEmailPage /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },
  { path: "/auth/reset-password", element: <ResetPasswordPage /> },
  { path: "/reset", element: <ResetPasswordPage /> },
  { path: "/forgot-password", element: <ResetPasswordPage /> },
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
          { path: "dashboard/activity", element: <DashboardPage activity /> },
          { path: "dashboard/profile", element: <ProfilePage /> },
          { path: "dashboard/settings", element: <ProfilePage settings /> },
          { path: "dashboard/questions/:id", element: <QuestionDetailPage /> },
          { path: "dashboard/questions", element: <WorkspaceListPage key="questions" page="questions" /> },
          { path: "dashboard/questions/new", element: <UserPostPage kind="question" /> },
          { path: "dashboard/lost-found", element: <WorkspaceListPage key="lost-found" page="lost-found" /> },
          { path: "dashboard/lost-found/new", element: <UserPostPage kind="item" /> },
          { path: "dashboard/matches", element: <WorkspaceListPage key="matches" page="matches" /> },
          { path: "dashboard/claims", element: <WorkspaceListPage key="claims" page="claims" /> },
          { path: "dashboard/notifications", element: <WorkspaceListPage key="notifications" page="notifications" /> },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="admin" />,
        children: [{
          element: <AdminShell />,
          children: [
            { path: "admin", element: <AdminDashboardPage /> },
            { path: "admin/dashboard", element: <AdminDashboardPage /> },
            ...["users", "posts", "comments", "tags", "lost-found", "moderation", "marketplace", "notifications", "settings", "locations", "claims", "leaderboard"].map(resource => ({
              path: `admin/${resource}`, element: <AdminResourcePage key={resource} resource={resource} />,
            })),
          ],
        }],
      },
    ],
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <LegacyThemeProvider defaultTheme="light">
        <ThemeProvider>
          <LanguageProvider>
            <Preloader>
              <RouterProvider router={router} />
              <ToastContainer position="top-right" autoClose={4200} limit={3} />
            </Preloader>
          </LanguageProvider>
        </ThemeProvider>
      </LegacyThemeProvider>
    </Provider>
  </React.StrictMode>,
);
