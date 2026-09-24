// Vite proxies this path locally; vercel.json proxies it in production.
// Set VITE_API_BASE_URL in Vercel env if you want to bypass the proxy, or leave default for same-origin proxying.
export const FORUM_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/__forum_api';
