import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./i18n";
import About from "./Components/Pages/About.jsx";
import TermsAndConditions from "./Components/Pages/TermAndConditions.jsx";
import PrivacyPolicy from "./Components/Pages/Policy.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <div className="p-10 text-center">Welcome to AskKh Home Page</div>,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "terms",
        element: <TermsAndConditions />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
    ],
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
