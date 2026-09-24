export const MEDIA_BASE_URI = 'https://forum-istad-api.cheat.casa/api/v1/media/';

/**
 * Formats an image/media value to the exact URI required by backend:
 * https://forum-istad-api.cheat.casa/api/v1/media/{name}
 */
export function formatMediaUrl(value, fallback = '') {
  if (!value || typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;

  // Local imported asset paths, data URIs, and blob URIs
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/src/') ||
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('/@') ||
    trimmed.startsWith('@/')
  ) {
    return trimmed;
  }

  // If already an external third-party web URL (e.g. google, unsplash)
  if (
    (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
    !trimmed.includes('localhost') &&
    !trimmed.includes('127.0.0.1') &&
    !trimmed.includes('forum-istad-api.cheat.casa')
  ) {
    return trimmed;
  }

  // Extract the raw file name
  const cleanName = trimmed
    .replace(/^https?:\/\/[^/]+/i, '')
    .replace(/^\/__forum_api\/?/i, '')
    .replace(/^\/api\/v1\/?/i, '')
    .replace(/^\/?profile-images\/?/i, '')
    .replace(/^\/?media\/?/i, '')
    .replace(/^\/+/, '');

  if (!cleanName) return fallback;

  // Teacher required format: uri + name
  return `${MEDIA_BASE_URI}${cleanName}`;
}

export function profileImageUrl(value, fallback = '') {
  return formatMediaUrl(value, fallback);
}

export function getCachedAvatar(userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const key = userId ? `nexa_avatar_${userId}` : 'nexa_avatar_me';
    return localStorage.getItem(key) || localStorage.getItem('nexa_avatar_me') || null;
  } catch {
    return null;
  }
}

export function setCachedAvatar(dataUrl, userId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (dataUrl) {
      if (userId) localStorage.setItem(`nexa_avatar_${userId}`, dataUrl);
      localStorage.setItem('nexa_avatar_me', dataUrl);
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function resolveUserAvatar(user, fallback = '') {
  if (!user) return getCachedAvatar() || fallback;
  const cached = getCachedAvatar(user.id);
  const candidate =
    (user.avatar && (user.avatar.startsWith('data:') || user.avatar.startsWith('blob:')) ? user.avatar : null) ||
    (user.photoURL && (user.photoURL.startsWith('data:') || user.photoURL.startsWith('blob:')) ? user.photoURL : null) ||
    user.profileImage ||
    user.avatar ||
    user.photoURL ||
    user.image ||
    cached;

  return formatMediaUrl(candidate, cached || fallback);
}

export default profileImageUrl;


