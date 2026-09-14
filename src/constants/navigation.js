import {
  LayoutDashboard,
  Activity,
  HelpCircle,
  Package,
  Sparkles,
  BookmarkCheck,
  Bell,
  Award,
  Settings,
} from 'lucide-react';

export const navigationSections = [
  {
    title: 'OVERVIEW',
    sectionKey: 'navigation.overview',
    items: [
      {
        id: 'Dashboard',
        label: 'Dashboard',
        labelKey: 'navigation.dashboard',
        icon: LayoutDashboard,
        to: '/dashboard',
      },
      {
        id: 'My Activity',
        label: 'My Activity',
        labelKey: 'navigation.myActivity',
        icon: Activity,
        to: '/activity',
      },
    ],
  },
  {
    title: 'ASK & HELP',
    sectionKey: 'navigation.askHelp',
    items: [
      {
        id: 'Q & A',
        label: 'Q & A',
        labelKey: 'navigation.qa',
        icon: HelpCircle,
        to: '/questions',
      },
    ],
  },
  {
    title: 'LOST & FOUND',
    sectionKey: 'navigation.lostFound',
    items: [
      {
        id: 'Lost & Found',
        label: 'Lost & Found',
        labelKey: 'navigation.lostFoundCommunity',
        icon: Package,
        to: '/lost-found',
      },
      {
        id: 'Match Center',
        label: 'Match Center',
        labelKey: 'navigation.matchCenter',
        icon: Sparkles,
        to: '/matches',
      },
      {
        id: 'My Claims',
        label: 'My Claims',
        labelKey: 'navigation.myClaims',
        icon: BookmarkCheck,
        to: '/claims',
      },
    ],
  },
  {
    title: 'WORKSPACE',
    sectionKey: 'navigation.workspace',
    items: [
      {
        id: 'Notifications',
        label: 'Notifications',
        labelKey: 'navigation.notifications',
        icon: Bell,
        to: '/notifications',
        badge: '5',
        badgeColor: 'rose',
      },
      {
        id: 'Achievements',
        label: 'Achievements',
        labelKey: 'navigation.achievements',
        icon: Award,
        to: '/achievements',
      },
      {
        id: 'Settings',
        label: 'Settings',
        labelKey: 'navigation.settings',
        icon: Settings,
        to: '/settings',
      },
    ],
  },
];

/**
 * Determine whether a navigation item is active based on current pathname
 */
export function isNavItemActive(pathname, item) {
  if (!pathname || !item) return false;

  const id = item.id;

  if (id === 'Dashboard') {
    return pathname === '/' || pathname === '/dashboard';
  }
  if (id === 'My Activity') {
    return pathname === '/activity' || pathname === '/my-activity';
  }
  if (id === 'Q & A' || id === 'Q & A Community' || item.labelKey === 'navigation.qa') {
    return (
      pathname.startsWith('/questions') ||
      pathname.startsWith('/forum') ||
      pathname.startsWith('/qa-community') ||
      pathname.startsWith('/community/questions')
    );
  }
  if (id === 'Match Center') {
    return (
      pathname === '/matches' ||
      pathname === '/match-center' ||
      pathname.startsWith('/lost-found/matches')
    );
  }
  if (id === 'My Claims') {
    return (
      pathname === '/claims' ||
      pathname === '/my-claims' ||
      pathname.startsWith('/lost-found/claims')
    );
  }
  if (id === 'Lost & Found' || id === 'Lost & Found Community' || item.labelKey === 'navigation.lostFoundCommunity') {
    return (
      (pathname.startsWith('/lost-found') || pathname.startsWith('/community/lost-found')) &&
      !pathname.includes('/matches') &&
      !pathname.includes('/claims') &&
      pathname !== '/matches' &&
      pathname !== '/claims'
    );
  }
  if (id === 'Notifications') {
    return pathname.startsWith('/notifications');
  }
  if (id === 'Achievements') {
    return pathname.startsWith('/achievements');
  }
  if (id === 'Settings') {
    return pathname.startsWith('/settings');
  }
  return pathname === item.to;
}

export default navigationSections;
