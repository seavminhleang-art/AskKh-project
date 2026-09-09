import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import About from './Components/Pages/About.jsx';
import TermsAndConditions from './Components/Pages/TermAndConditions.jsx';
import PrivacyPolicy from './Components/Pages/Policy.jsx';




const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/about",
    element: <About/>,
  },
  {
    path: "/terms",
    element: <TermsAndConditions/>,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy/>,
  },
  {
  }

]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  
    <RouterProvider router={router} />
  
)
