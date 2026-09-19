import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseApi } from '@/store/api/baseApi';
import { auth } from '@/Components/Firebase/firebase';

export const resourcePaths = {
  users: '/users/search?query=', posts: '/posts', comments: '/posts', tags: '/tags',
  'lost-found': '/lost-found/reports', notifications: '/notifications',
};
const request = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://forum-istad-api.cheat.casa/api/v1',
  timeout: 15000,
  prepareHeaders: async (headers, { getState }) => {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : getState().auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export function unpackList(data) {
  if (Array.isArray(data)) return { rows: data, total: null };
  const body = data?.data ?? data;
  const rows = Array.isArray(body) ? body : body?.content ?? body?.items ?? body?.results;
  if (!Array.isArray(rows)) throw new Error('The API returned an unsupported list format.');
  const total = body?.totalElements ?? body?.total ?? data?.totalElements ?? data?.total;
  return { rows, total: Number.isFinite(total) ? total : null };
}

const liveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminResource: builder.query({
      async queryFn(resource, api, options) {
        if (!resourcePaths[resource]) return { error: { status: 'CUSTOM_ERROR', error: 'This resource has no configured endpoint.' } };
        try {
          const response = await request(resourcePaths[resource], api, options);
          if (response.error) return response;
          const data = unpackList(response.data);
          if (resource === 'comments') {
            if (!data.rows.every(post => Array.isArray(post.comments))) throw new Error('Comments are not included in the posts response.');
            return { data: { rows: data.rows.flatMap(post => post.comments.map(comment => ({ ...comment, postTitle: post.title }))), total: null } };
          }
          return { data };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Analytics'],
    }),
  }),
});
export const { useAdminResourceQuery } = liveApi;
