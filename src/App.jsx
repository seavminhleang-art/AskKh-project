import { Outlet } from "react-router-dom";
import FooterComponent from './Components/Footer/FooterComponet.jsx'
import Navbar from './Components/Nav/NavBarComponent.jsx'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterComponent />
    </div>
  )
}

export default App
