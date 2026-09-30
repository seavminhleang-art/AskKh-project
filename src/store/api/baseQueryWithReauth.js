import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logout } from '../../features/auth/authSlice';
import { authCredentials, getRefreshToken } from '../../features/auth/authSession';
import { FORUM_API_BASE_URL } from '../../config/forumApi';

export const BASE_API_URL = FORUM_API_BASE_URL;

const safeResponseHandler = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const publicQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  timeout: 15000,
  responseHandler: safeResponseHandler,
});

const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  timeout: 15000,
  responseHandler: safeResponseHandler,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const normalizeError = (result) => {
  if (!result?.error) return result;
  if (result.error.status === 'PARSING_ERROR') {
    const raw = typeof result.error.data === 'string' ? result.error.data : '';
    if (raw.toLowerCase().includes('cors')) {
      result.error = {
        status: result.error.originalStatus || 403,
        data: { message: 'The backend server does not allow requests from this domain (CORS Error). Please whitelist this domain in the backend API.' },
        error: 'The backend server rejected this domain (CORS Error).',
      };
    } else {
      result.error = {
        status: result.error.originalStatus || 500,
        data: { message: raw || 'The server returned an unexpected response.' },
        error: raw || 'The server returned an unexpected response.',
      };
    }
  } else if (typeof result.error.data === 'string') {
    const raw = result.error.data;
    if (raw.toLowerCase().includes('cors')) {
      result.error.data = { message: 'The backend server does not allow requests from this domain (CORS Error). Please whitelist this domain in the backend API.' };
    } else {
      result.error.data = { message: raw };
    }
  }
  return result;
};

let refreshPromise;
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  // Invalid login credentials must never trigger session renewal or a retry.
  if (url.startsWith('/auth/')) {
    const res = await publicQuery(args, api, extraOptions);
    return normalizeError(res);
  }
  let result = await rawBaseQuery(args, api, extraOptions);
  result = normalizeError(result);
  if (result.error?.status !== 401 && result.error?.originalStatus !== 401) return result;
  const refreshToken = api.getState().auth.refreshToken || getRefreshToken();
  if (!refreshToken) { api.dispatch(logout()); return result; }
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshed = await publicQuery({ url: '/auth/refresh', method: 'POST', body: { refreshToken } }, api, extraOptions);
      if (api.getState().auth.refreshToken !== refreshToken) return false;
      if (!refreshed.data?.accessToken) { api.dispatch(logout()); return false; }
      api.dispatch(setCredentials(authCredentials(refreshed.data, refreshed.data.refreshToken || refreshToken)));
      return true;
    })().finally(() => { refreshPromise = undefined; });
  }
  const retried = await refreshPromise ? await rawBaseQuery(args, api, extraOptions) : result;
  return normalizeError(retried);
};
export default baseQueryWithReauth;
