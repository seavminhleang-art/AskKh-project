import { HelpCircle, CheckCircle2, FileQuestion, PackageCheck } from 'lucide-react';

/**
 * Transforms real API responses into UI-ready Dashboard Statistics.
 *
 * Architecture:
 * API response
 * ↓
 * transformDashboardStats()
 * ↓
 * DashboardStats
 * ↓
 * StatCard
 *
 * Real Dashboard statistics calculated from supported OpenAPI resources:
 * 1. Questions Asked  <- GET /users/me (user.questions.length)
 * 2. Answers Given    <- GET /users/me (user.comments.length)
 * 3. Lost Reports     <- GET /lost-found/reports (filtered by user.id & itemType='LOST')
 * 4. Found Reports    <- GET /lost-found/reports (filtered by user.id & itemType='FOUND')
 *
 * No fake statistics endpoints are called or invented.
 */
export function transformDashboardStats({ user, reports, isAuthenticated, isError }) {
  // 1. Error Fallback State: Real error indication without fake values
  if (isError) {
    return [
      {
        id: 'questions-asked',
        title: 'Questions Asked',
        value: '--',
        subtitle: 'Unavailable',
        growth: 'Error',
        growthText: 'failed to load',
        colorScheme: 'blue',
        icon: HelpCircle,
      },
      {
        id: 'answers-given',
        title: 'Answers Given',
        value: '--',
        subtitle: 'Unavailable',
        growth: 'Error',
        growthText: 'failed to load',
        colorScheme: 'emerald',
        icon: CheckCircle2,
      },
      {
        id: 'lost-reports',
        title: 'Lost Reports',
        value: '--',
        subtitle: 'Unavailable',
        growth: 'Error',
        growthText: 'failed to load',
        colorScheme: 'rose',
        icon: FileQuestion,
      },
      {
        id: 'found-reports',
        title: 'Found Reports',
        value: '--',
        subtitle: 'Unavailable',
        growth: 'Error',
        growthText: 'failed to load',
        colorScheme: 'amber',
        icon: PackageCheck,
      },
    ];
  }

  // 2. Unauthenticated (Guest) State: Clear placeholder indication without protected requests
  if (!isAuthenticated) {
    return [
      {
        id: 'questions-asked',
        title: 'Questions Asked',
        value: '--',
        subtitle: 'Sign in to view',
        growth: 'Q&A',
        growthText: 'forum activity',
        colorScheme: 'blue',
        icon: HelpCircle,
      },
      {
        id: 'answers-given',
        title: 'Answers Given',
        value: '--',
        subtitle: 'Sign in to view',
        growth: 'Community',
        growthText: 'helpful solutions',
        colorScheme: 'emerald',
        icon: CheckCircle2,
      },
      {
        id: 'lost-reports',
        title: 'Lost Reports',
        value: '--',
        subtitle: 'Sign in to view',
        growth: 'Campus',
        growthText: 'missing items',
        colorScheme: 'rose',
        icon: FileQuestion,
      },
      {
        id: 'found-reports',
        title: 'Found Reports',
        value: '--',
        subtitle: 'Sign in to view',
        growth: 'Campus',
        growthText: 'recovered items',
        colorScheme: 'amber',
        icon: PackageCheck,
      },
    ];
  }

  // 3. Authenticated User State: Real calculated values (0 if user has no activity)
  const questionsCount = Array.isArray(user?.questions) ? user.questions.length : 0;
  const commentsCount = Array.isArray(user?.comments) ? user.comments.length : 0;

  const isLostFoundActive = Array.isArray(reports);

  const userReports = isLostFoundActive && user?.id
    ? reports.filter((r) => r.userId === user.id)
    : [];

  const lostReports = userReports.filter((r) => (r.itemType || '').toUpperCase() === 'LOST');
  const foundReports = userReports.filter((r) => (r.itemType || '').toUpperCase() === 'FOUND');

  const activeLost = lostReports.filter(
    (r) => (r.status || '').toUpperCase() === 'ACTIVE' || (r.status || '').toUpperCase() === 'PENDING'
  ).length;

  const activeFound = foundReports.filter(
    (r) => (r.status || '').toUpperCase() === 'ACTIVE' || (r.status || '').toUpperCase() === 'PENDING'
  ).length;

  return [
    {
      id: 'questions-asked',
      title: 'Questions Asked',
      value: questionsCount,
      subtitle: questionsCount === 1 ? '1 question posted' : `${questionsCount} questions posted`,
      growth: 'Q&A',
      growthText: questionsCount > 0 ? 'community questions' : 'no questions yet',
      colorScheme: 'blue',
      icon: HelpCircle,
    },
    {
      id: 'answers-given',
      title: 'Answers Given',
      value: commentsCount,
      subtitle: commentsCount === 1 ? '1 answer posted' : `${commentsCount} answers posted`,
      growth: 'Community',
      growthText: commentsCount > 0 ? 'helpful solutions' : 'no answers yet',
      colorScheme: 'emerald',
      icon: CheckCircle2,
    },
    {
      id: 'lost-reports',
      title: 'Lost Reports',
      value: isLostFoundActive ? lostReports.length : 2,
      subtitle: isLostFoundActive
        ? (activeLost > 0 ? `${activeLost} active on campus` : `${lostReports.length} total reported`)
        : 'In development mock data',
      growth: isLostFoundActive ? 'Campus' : 'Dev Mock',
      growthText: isLostFoundActive
        ? (lostReports.length > 0 ? 'missing items' : 'no lost items')
        : 'sample reports',
      colorScheme: 'rose',
      icon: FileQuestion,
      isMock: true,
    },
    {
      id: 'found-reports',
      title: 'Found Reports',
      value: isLostFoundActive ? foundReports.length : 1,
      subtitle: isLostFoundActive
        ? (activeFound > 0 ? `${activeFound} awaiting claim` : `${foundReports.length} total handed in`)
        : 'In development mock data',
      growth: isLostFoundActive ? 'Campus' : 'Dev Mock',
      growthText: isLostFoundActive
        ? (foundReports.length > 0 ? 'recovered items' : 'no found items')
        : 'sample hand-ins',
      colorScheme: 'amber',
      icon: PackageCheck,
      isMock: true,
    },
  ];
}
