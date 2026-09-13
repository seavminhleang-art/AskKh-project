import FooterComponent from "./Components/Footer/FooterComponet.jsx";
import Navbar from "./Components/Nav/NavBarComponent.jsx";

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-background text-foreground transition-colors duration-300">
        {/* Homepage sections will be added here */}
      </main>

      <FooterComponent />
    </>
  );
}

export default App;