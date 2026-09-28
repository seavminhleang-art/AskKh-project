export function getRefreshToken() {
  try {
    return sessionStorage.getItem('nexa_refresh_token') || localStorage.getItem('nexa_refresh_token');
  } catch {
    return null;
  }
}

export function extractToken(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  return (
    data.accessToken ||
    data.token ||
    data.access_token ||
    data.data?.accessToken ||
    data.data?.token ||
    data.data?.access_token ||
    null
  );
}

export function extractRefreshToken(data, explicitRefreshToken) {
  if (explicitRefreshToken) return explicitRefreshToken;
  if (!data || typeof data === 'string') return null;
  return (
    data.refreshToken ||
    data.refresh_token ||
    data.data?.refreshToken ||
    data.data?.refresh_token ||
    null
  );
}

export function authCredentials(data, refreshToken) {
  if (!data) {
    return { accessToken: null, refreshToken: refreshToken || null, user: null };
  }

  const token = extractToken(data);
  const resolvedRefreshToken = extractRefreshToken(data, refreshToken) || getRefreshToken();

  const rawUser = data.user || data.data?.user || (typeof data.data === 'object' && !data.data?.accessToken ? data.data : null) || {};

  let claims = {};
  if (typeof token === 'string' && token.includes('.')) {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
    } catch {
      /* Opaque tokens have no client-readable role. */
    }
  }

  const roles = [rawUser.role, claims.role, ...(Array.isArray(claims.roles) ? claims.roles : [])];
  const role = roles.some((value) => ['admin', 'role_admin'].includes(String(value).toLowerCase()))
    ? 'admin'
    : (rawUser.role || 'student');

  let existingUser = null;
  try {
    const stored = localStorage.getItem('nexa_user');
    if (stored) existingUser = JSON.parse(stored);
  } catch {
    /* Ignore storage parsing error */
  }

  const profileImage =
    rawUser.profileImage ||
    rawUser.avatar ||
    rawUser.image ||
    data.profileImage ||
    data.avatar ||
    data.image ||
    claims.profileImage ||
    claims.avatar ||
    existingUser?.profileImage ||
    existingUser?.avatar ||
    null;

  return {
    accessToken: token,
    refreshToken: resolvedRefreshToken,
    user: {
      ...(existingUser || {}),
      ...(rawUser || {}),
      id: rawUser.id ?? rawUser.userId ?? data.userId ?? data.id ?? claims.sub ?? claims.userId ?? existingUser?.id,
      displayName:
        rawUser.displayName ||
        rawUser.name ||
        rawUser.username ||
        data.displayName ||
        data.name ||
        data.username ||
        claims.name ||
        existingUser?.displayName ||
        'Member',
      email: rawUser.email || data.email || claims.email || existingUser?.email,
      role: rawUser.role || role || existingUser?.role || 'student',
      profileImage,
    },
  };
}


