import { baseApi } from '../../store/api/baseApi';

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
