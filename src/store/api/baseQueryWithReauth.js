import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../../features/auth/authSlice';

export const BASE_API_URL = 'https://forum-istad-api.cheat.casa/api/v1';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // SECURITY: Read accessToken strictly from Redux state (in-memory RAM)
    const token = getState()?.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Mutex lock for token refreshes to prevent race conditions on concurrent 401s
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && (result.error.status === 401 || result.error.originalStatus === 401)) {
    const refreshToken = api.getState()?.auth?.refreshToken || localStorage.getItem('nexa_refresh_token');

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResult = await rawBaseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const authData = refreshResult.data;
          api.dispatch(
            setCredentials({
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken || refreshToken,
              user: {
                id: authData.userId,
                displayName: authData.displayName,
                email: authData.email,
              },
            })
          );
          onRefreshed(authData.accessToken);
          // Retry initial failed request
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } catch (err) {
        api.dispatch(logout());
      } finally {
        isRefreshing = false;
      }
    } else {
      // Wait for refreshing to complete, then retry
      const retryPromise = new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          if (newToken) {
            resolve(rawBaseQuery(args, api, extraOptions));
          } else {
            resolve(result);
          }
        });
      });
      return await retryPromise;
    }
  }

  return result;
};

export default baseQueryWithReauth;
