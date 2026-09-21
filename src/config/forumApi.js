// Production uses the configured backend. Local development uses Vite's
// same-origin proxy so alternate ports and loopback hosts work with CORS.
const configuredBaseUrl = (
  import.meta.env.VITE_BASE_FORUM_LOST_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://forum-istad-api.cheat.casa/api/v1'
).replace(/\/+$/, '');

export const FORUM_API_BASE_URL = import.meta.env.DEV
  ? '/__forum_api'
  : configuredBaseUrl;
