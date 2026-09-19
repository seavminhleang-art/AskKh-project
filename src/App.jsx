import { Outlet } from "react-router-dom";
import FooterComponent from './Components/Footer/FooterComponet.jsx'
import Navbar from './Components/Nav/NavBarComponent.jsx'
import PageTransition from './Components/Animations/PageTransition.jsx'
import ScrollProgress from './Components/Animations/ScrollProgress.jsx'
import Preloader from './Components/Animations/Preloader.jsx'
import { useTheme } from './context/ThemeContext.jsx'
import { useLanguage } from './Components/Language/LanguageContext.jsx'

function App() {
  const { darkMode } = useTheme()
  const { language } = useLanguage()

  return (
    <Preloader>
      <div className="min-h-screen flex flex-col">
        <ScrollProgress />
        <Navbar />
        <main className="flex-grow">
          <PageTransition>
            <Outlet context={{ darkMode, language }} />
          </PageTransition>
        </main>
        <FooterComponent />
      </div>
    </Preloader>
  )
}

export default App;
