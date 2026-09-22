import { FORUM_API_BASE_URL } from '../../config/forumApi';

export function profileImageUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && url.pathname.startsWith('/api/v1/profile-images/')) {
      return `${FORUM_API_BASE_URL}${url.pathname.slice('/api/v1'.length)}${url.search}`;
    }
  } catch {
    if (value.startsWith('/api/v1/profile-images/')) {
      return `${FORUM_API_BASE_URL}${value.slice('/api/v1'.length)}`;
    }
  }
  return value;
}
