import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello World</div>,
  },
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  <Provider>
    <RouterProvider router={router} />
  </Provider>
)
