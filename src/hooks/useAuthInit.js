import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAppStore';
import { setCredentials, setInitialized, logout } from '../features/auth/authSlice';
import { BASE_API_URL } from '../store/api/baseQueryWithReauth';

export function useAuthInit() {
  const dispatch = useAppDispatch();
  const { accessToken, isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Ensure any legacy insecure tokens are removed from localStorage
    localStorage.removeItem('nexa_token');

    const refreshToken = localStorage.getItem('nexa_refresh_token');

    // If already has access token in memory or no refresh token available
    if (accessToken || !refreshToken) {
      dispatch(setInitialized());
      return;
    }

    // Silent session restoration on browser startup/reload
    let isCancelled = false;

    async function silentRefresh() {
      try {
        const response = await fetch(`${BASE_API_URL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }

        const data = await response.json();
        if (!isCancelled && data.accessToken) {
          dispatch(
            setCredentials({
              accessToken: data.accessToken,
              refreshToken: data.refreshToken || refreshToken,
              user: {
                id: data.userId,
                displayName: data.displayName,
                email: data.email,
              },
            })
          );
        } else if (!isCancelled) {
          dispatch(logout());
        }
      } catch {
        if (!isCancelled) {
          dispatch(logout());
        }
      } finally {
        if (!isCancelled) {
          dispatch(setInitialized());
        }
      }
    }

    silentRefresh();

    return () => {
      isCancelled = true;
    };
  }, [accessToken, dispatch]);

  return isInitialized;
}

export default useAuthInit;
