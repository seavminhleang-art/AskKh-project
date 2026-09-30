import { baseApi } from '../../store/api/baseApi';
import { FORUM_API_BASE_URL } from '../../config/forumApi';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => {
        if (!params) return '/notifications';
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        const qs = queryParams.toString();
        return qs ? `/notifications?${qs}` : '/notifications';
      },
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),
    streamNotifications: builder.query({
      // The response is a long-lived SSE stream, so consume it outside fetchBaseQuery.
      queryFn: () => ({ data: { connected: true } }),
      async onCacheEntryAdded(_arg, { getState, dispatch, cacheEntryRemoved }) {
        const controller = new AbortController();
        const token = getState()?.auth?.accessToken;
        let reader;
        const consumeStream = async () => {
          try {
            if (!token) return;
            const response = await fetch(`${FORUM_API_BASE_URL}/notifications/stream`, {
              headers: { Accept: 'text/event-stream', Authorization: `Bearer ${token}` },
              signal: controller.signal,
            });
            if (!response.ok || !response.body) return;
            reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const events = buffer.split(/\r?\n\r?\n/);
              buffer = events.pop() || '';
              if (events.some((event) => event.split(/\r?\n/).some((line) => line.startsWith('data:')))) {
                dispatch(notificationApi.util.invalidateTags(['Notification']));
              }
            }
          } catch {
            // The notification count and list keep their polling fallback if SSE is unavailable.
          }
        };
        await Promise.race([cacheEntryRemoved, consumeStream()]);
        controller.abort();
        try {
          await reader?.cancel?.();
        } catch {
          // The fetch abort may already have closed the stream.
        } finally {
          reader?.releaseLock?.();
        }
      },
    }),
    markRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllRead: builder.mutation({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useStreamNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;

// Compatibility aliases
export const useMarkNotificationAsReadMutation = notificationApi.useMarkReadMutation;
export const useMarkAllNotificationsAsReadMutation = notificationApi.useMarkAllReadMutation;
export const useMarkNotificationReadMutation = notificationApi.useMarkReadMutation;
export const useMarkAllNotificationsReadMutation = notificationApi.useMarkAllReadMutation;

export default notificationApi;
