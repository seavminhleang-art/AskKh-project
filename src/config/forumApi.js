// Vite proxies this path locally; vercel.json proxies it in production.
// Keep browser requests same-origin; the server proxy selects the backend base URL.
export const FORUM_API_BASE_URL = '/__forum_api';
