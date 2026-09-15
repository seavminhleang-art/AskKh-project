import { Outlet } from "react-router-dom";
import FooterComponent from "./Components/Footer/FooterComponet.jsx";
import Navbar from "./Components/Nav/NavBarComponent.jsx";
import PageBackground from "./Components/common/PageBackground.jsx";

function App({ darkMode, setDarkMode }) {
  return (
    <>
      <PageBackground />
      <Navbar />
      <main>
        <Outlet context={{ darkMode, setDarkMode }} />
      </main>
      <FooterComponent />
    </>
  );
}

export default App;
