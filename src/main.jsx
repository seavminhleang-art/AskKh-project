import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import "./index.css";

import App from "./App.jsx";
import LoginPage from "./Components/Pages/LoginPage.jsx";
import RegisterPage from "./Components/Pages/RegisterPage.jsx";
import { store } from "./Components/redux/store.js";

const router = createBrowserRouter([
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

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);