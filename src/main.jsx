import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LeaderBoardComponent from "./Components/Pages/leaderboard/LeaderBoardComponent.jsx"




const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/leaderboard",
    element: <LeaderBoardComponent/>,
  }
]);

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(
  
    <RouterProvider router={router} />
  
)
