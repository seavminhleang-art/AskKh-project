import { baseApi } from '../../store/api/baseApi';

/**
 * Dashboard API Service
 * Injected into unified baseApi - NO duplicate API clients.
 * All endpoints verified against OpenAPI specification:
 * - GET /users/me (UserDetailResponse)
 * - GET /notifications/unread-count (UnreadNotificationCountResponse)
 * - GET /notifications (PageNotificationResponse)
 * - GET /posts (PostResponse[])
 * - GET /lost-found/reports (ItemReportResponse[])
 */
export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Current User - Verified: GET /users/me
    getMe: builder.query({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    // 2. Unread Notifications Count - Verified: GET /notifications/unread-count
    getUnreadCount: builder.query({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
    }),

    // 3. Recent Notifications - Verified: GET /notifications?page=0&size=5
    getNotifications: builder.query({
      query: ({ page = 0, size = 5 } = {}) => `/notifications?page=${page}&size=${size}`,
      providesTags: ['Notification'],
    }),

    // 4. Recent Forum Questions / Posts - Verified: GET /posts
    getRecentPosts: builder.query({
      query: () => '/posts',
      providesTags: ['Post'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetMeQuery,
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
  useGetRecentPostsQuery,
} = dashboardApi;

export default dashboardApi;