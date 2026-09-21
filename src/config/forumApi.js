// Both names are supported while older API modules migrate to VITE_API_BASE_URL.
export const FORUM_API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BASE_FORUM_LOST_URL ||
  'https://forum-istad-api.cheat.casa/api/v1'
).replace(/\/+$/, '');
