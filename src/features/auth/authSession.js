export function getRefreshToken() {
  return sessionStorage.getItem('nexa_refresh_token') || localStorage.getItem('nexa_refresh_token');
}

export function authCredentials(data, refreshToken = data.refreshToken) {
  let claims = {};
  try {
    const payload = data.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')));
  } catch { /* Opaque tokens have no client-readable role. */ }
  // These claims only control navigation; the server must enforce authorization.
  const roles = [claims.role, ...(Array.isArray(claims.roles) ? claims.roles : [])];
  const role = roles.some(value => ['admin', 'role_admin'].includes(String(value).toLowerCase())) ? 'admin' : 'student';

  let existingUser = null;
  try {
    const stored = localStorage.getItem('nexa_user');
    if (stored) existingUser = JSON.parse(stored);
  } catch { /* Ignore storage parsing error */ }

  const profileImage =
    data.profileImage ||
    data.avatar ||
    data.image ||
    claims.profileImage ||
    claims.avatar ||
    existingUser?.profileImage ||
    existingUser?.avatar ||
    null;

  return {
    accessToken: data.accessToken,
    refreshToken,
    user: {
      ...(existingUser || {}),
      id: data.userId ?? data.id ?? existingUser?.id,
      displayName: data.displayName || data.name || data.username || existingUser?.displayName || 'Member',
      email: data.email || existingUser?.email,
      role: data.role || role,
      profileImage,
    },
  };
}

