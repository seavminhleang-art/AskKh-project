import { Outlet } from "react-router-dom";
import FooterComponent from "./Components/Footer/FooterComponet.jsx";
import Navbar from "./Components/Nav/NavBarComponent.jsx";

function App({ darkMode, setDarkMode }) {
  return (
    <div className="min-h-screen flex flex-col w-full max-w-full overflow-x-hidden bg-brand-canvas dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />
      <main className="flex-1 w-full max-w-full overflow-x-hidden relative z-10">
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>
      <FooterComponent />
    </div>
  );
}

export default App;
