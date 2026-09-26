export function notificationTarget(notification) {
  const value = notification?.targetUrl || notification?.link;
  if (!value || typeof value !== "string") return null;

  if (value.startsWith("/") && !value.startsWith("//")) return value;

  try {
    const url = new URL(value, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}
