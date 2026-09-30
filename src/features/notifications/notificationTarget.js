function isKnownAppRoute(path) {
  return (
    path === "/" ||
    /^\/(community\/(qa|lost-found)|about|terms|privacy|privacy-policy|leaderboard)$/.test(path) ||
    /^\/questions\/[^/]+(?:\/[^/]+)?$/.test(path) ||
    /^\/dashboard(?:\/(?:activity|profile|settings|questions(?:\/[^/]+)?|lost-found(?:\/new)?|matches|claims|notifications))?$/.test(path)
  );
}

function fallbackTarget(notification) {
  const type = String(notification?.type || "").toUpperCase();
  if (type.includes("COMMENT") || type === "POST_VOTE" || type.includes("ANSWER")) {
    const questionId = notification?.postId ?? notification?.data?.postId ?? notification?.targetId;
    return questionId ? `/dashboard/questions/${encodeURIComponent(questionId)}${type.includes("COMMENT") ? "#comments" : ""}` : "/dashboard/questions";
  }
  if (type.includes("MATCH")) return "/dashboard/matches";
  if (type.includes("CLAIM")) return "/dashboard/claims";
  return "/dashboard/notifications";
}

export function notificationTarget(notification) {
  const value = notification?.targetUrl || notification?.link;
  if (!value || typeof value !== "string") return fallbackTarget(notification);

  try {
    const url = new URL(value, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallbackTarget(notification);

    let path = url.pathname.replace(/\/$/, "") || "/";
    let search = url.search;
    // Some notifications store API/resource URLs instead of a React route.
    path = path.replace(/^\/api(?:\/v\d+)?(?=\/)/i, "");
    if (path === "/claims") path = "/dashboard/claims";
    if (path === "/notifications") path = "/dashboard/notifications";
    if (path === "/lost-found") path = "/community/lost-found";
    const reportMatch = path.match(/^\/lost-found\/reports?\/(\d+)$/i);
    if (reportMatch) {
      path = "/community/lost-found";
      search = `?reportId=${encodeURIComponent(reportMatch[1])}`;
    }

    // The feed is the only routed Lost & Found page; old item detail URLs land there.
    const itemMatch = path.match(/^\/lost-found\/(\d+)$/i);
    if (itemMatch) {
      path = "/community/lost-found";
      search = `?itemId=${encodeURIComponent(itemMatch[1])}`;
    }

    const postMatch = path.match(/^\/(?:posts|questions|dashboard\/questions)\/(\d+)(?:\/[^/]+)?$/i);
    if (postMatch) {
      const isComment = String(notification?.type || "").toUpperCase().includes("COMMENT");
      // The workspace detail page fetches the complete comment thread.
      if (isComment || path.startsWith("/posts/")) {
        path = `/dashboard/questions/${postMatch[1]}`;
        return `${path}${search}${isComment ? "#comments" : url.hash}`;
      }
    }
    if (isKnownAppRoute(path)) return `${path}${search}${url.hash}`;
    return fallbackTarget(notification);
  } catch {
    return fallbackTarget(notification);
  }
}
