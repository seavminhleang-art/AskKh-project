import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PageSkeleton from "./Components/common/skeletons/PageSkeleton.jsx";
import FooterComponent from './Components/Footer/FooterComponet.jsx'
import Navbar from './Components/Nav/NavBarComponent.jsx'
import PageTransition from './Components/Animations/PageTransition.jsx'
import ScrollProgress from './Components/Animations/ScrollProgress.jsx'
import { useTheme } from './context/ThemeContext.jsx'
import { useLanguage } from './Components/Language/LanguageContext.jsx'

function App() {
  const { pathname } = useLocation();
  const { darkMode } = useTheme()
  const { language } = useLanguage()

  return (

      <div className="min-h-screen flex flex-col">
        <ScrollProgress />
        <Navbar />
        <main className="flex-grow">
          <PageTransition>
            <Suspense key={pathname} fallback={<PageSkeleton pathname={pathname} />}>
              <Outlet context={{ darkMode, language }} />
            </Suspense>
          </PageTransition>
        </main>
        <FooterComponent />
      </div>

  )
}

export default App;
