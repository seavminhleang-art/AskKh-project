import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../theme-provider';
import SpaceBackground from '../PagesComponent/HomeComponent/SpaceBackground';
import ShootingStars from '../PagesComponent/HomeComponent/ShootingStars';
import LightRibbons from '../PagesComponent/HomeComponent/LightRibbons';
import LiveBackground from '../PagesComponent/HomeComponent/LiveBackground';

export default function PageBackground() {
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const darkMode = resolvedTheme === 'dark';

  return (
    <div className="page-background" aria-hidden="true">
      {!reducedMotion && <>
        <SpaceBackground darkMode={darkMode} />
        <ShootingStars darkMode={darkMode} count={14} />
        <LightRibbons darkMode={darkMode} count={5} />
        <LiveBackground darkMode={darkMode} />
      </>}
    </div>
  );
}
