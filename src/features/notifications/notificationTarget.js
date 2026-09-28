/**
 * Translate a notification's targetUrl / link into a valid frontend route.
 *
 * The backend sometimes sends API paths like /lost-found/reports/21/claims
 * which are not React Router routes. This function maps them to the correct
 * dashboard pages so clicking a notification never lands on the 404 page.
 */
export function notificationTarget(notification) {
  const raw = notification?.targetUrl || notification?.link;

  // Helper: extract the pathname from a raw value that may be a full URL or a path
  function toPath(value) {
    if (!value || typeof value !== 'string') return null;
    if (value.startsWith('/') && !value.startsWith('//')) return value;
    try {
      const url = new URL(value, window.location.origin);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
      return `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  const path = toPath(raw);

  if (!path) return null;

  // ── Translate backend API paths → frontend dashboard routes ──────────────

  // /lost-found/reports/:reportId/claims  →  /dashboard/claims
  if (/^\/lost-found\/reports\/\d+\/claims/.test(path)) {
    return '/dashboard/claims';
  }

  // /lost-found/reports/:reportId/matches  →  /dashboard/matches
  if (/^\/lost-found\/reports\/\d+\/matches/.test(path)) {
    return '/dashboard/matches';
  }

  // /lost-found/reports/:reportId  →  /dashboard/lost-found
  if (/^\/lost-found\/reports\/\d+$/.test(path)) {
    return '/dashboard/lost-found';
  }

  // /lost-found/reports  →  /dashboard/lost-found
  if (/^\/lost-found\/reports/.test(path)) {
    return '/dashboard/lost-found';
  }

  // /lost-found/claims/:claimId  →  /dashboard/claims
  if (/^\/lost-found\/claims\/\d+/.test(path)) {
    return '/dashboard/claims';
  }

  // /posts/:postId or /questions/:questionId  →  /dashboard/questions/:id
  const postMatch = path.match(/^\/(?:posts|questions)\/(\d+)/);
  if (postMatch) {
    return `/dashboard/questions/${postMatch[1]}`;
  }

  // /notifications  →  /dashboard/notifications
  if (path.startsWith('/notifications')) {
    return '/dashboard/notifications';
  }

  // Already a dashboard-prefixed path — pass through as-is
  if (path.startsWith('/dashboard/')) {
    return path;
  }

  // Unknown backend path — don't navigate to a 404
  return null;
}

