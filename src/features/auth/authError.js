export function authError(error, fallback) {
  const message = error?.data?.message || error?.data?.detail;
  if (typeof message === 'string') return message;
  if (error?.status === 'FETCH_ERROR' || error?.status === 'TIMEOUT_ERROR') return 'Unable to reach the server. Please try again.';
  return fallback;
}
