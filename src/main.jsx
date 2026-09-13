import { StrictMode } from "react";

import {
  createRoot,
} from "react-dom/client";

import {
  Provider,
} from "react-redux";

import {
  createBrowserRouter,
} from "react-router";

import {
  RouterProvider,
} from "react-router/dom";

import "./index.css";

import App from "./App.jsx";

import LoginPage from "./Components/Auth/LoginPage.jsx";

import RegisterPage from "./Components/Auth/RegisterPage.jsx";

import {
  store,
} from "./Components/redux/store.js";

import {
  LanguageProvider,
} from "./Components/Language/LanguageContext.jsx";

import {
  ThemeProvider,
} from "./components/theme-provider.jsx";

const router =
  createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },

    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

createRoot(
  document.getElementById(
    "root",
  ),
).render(
  <StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
          storageKey="askkh-theme"
          disableTransitionOnChange={
            false
          }
        >
          <RouterProvider
            router={router}
          />
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  </StrictMode>,
);