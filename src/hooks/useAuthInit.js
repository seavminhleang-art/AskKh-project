import { authCredentials, getRefreshToken, extractToken } from '../features/auth/authSession';
import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { setCredentials, setInitialized, logout } from '../features/auth/authSlice';
import { BASE_API_URL } from '../store/api/baseQueryWithReauth';

let pendingRefreshPromise = null;

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);
  const attemptedRef = useRef(false);

  useEffect(() => {
    // Ensure any legacy insecure tokens are removed from localStorage
    try {
      localStorage.removeItem('nexa_token');
    } catch {}

    const refreshToken = getRefreshToken();

    // If already has access token in memory or no refresh token available
    if (accessToken || !refreshToken) {
      dispatch(setInitialized());
      return;
    }

    if (attemptedRef.current) return;
    attemptedRef.current = true;

    async function silentRefresh() {
      try {
        if (!pendingRefreshPromise) {
          pendingRefreshPromise = (async () => {
            const response = await fetch(`${BASE_API_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
              signal: AbortSignal.timeout(15000),
            });

            if (!response.ok) {
              const err = new Error(`Refresh failed with status ${response.status}`);
              err.status = response.status;
              throw err;
            }
            return await response.json();
          })().finally(() => {
            pendingRefreshPromise = null;
          });
        }

        const data = await pendingRefreshPromise;
        const newAccessToken = extractToken(data);

        if (newAccessToken) {
          const creds = authCredentials(data, data?.refreshToken || refreshToken);
          dispatch(setCredentials(creds));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        // If the server explicitly rejected the refresh token (401 or 403), invalidate session
        if (error?.status === 401 || error?.status === 403) {
          dispatch(logout());
        }
      } finally {
        dispatch(setInitialized());
      }
    }

    silentRefresh();
  }, [accessToken, dispatch]);

  return isInitialized;
}

export default useAuthInit;

