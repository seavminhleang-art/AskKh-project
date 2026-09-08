import { baseApi } from "../../api/baseApi";

export const notificationsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /notifications?page=&size=
        getNotifications: builder.query({
            query: ({ page = 0, size = 20 } = {}) => ({
                url: "/notifications",
                params: { page, size },
            }),
            providesTags: (result) =>
                result
                    ? [
                          ...result.content?.map((n) => ({
                              type: "Notification",
                              id: n.id,
                          })) ?? [],
                          { type: "Notification", id: "LIST" },
                      ]
                    : [{ type: "Notification", id: "LIST" }],
        }),

        // GET /notifications/unread-count
        getUnreadCount: builder.query({
            query: () => "/notifications/unread-count",
            providesTags: [{ type: "Notification", id: "UNREAD_COUNT" }],
        }),

        // PATCH /notifications/{notificationId}/read
        markNotificationRead: builder.mutation({
            query: (notificationId) => ({
                url: `/notifications/${notificationId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: [
                { type: "Notification", id: "LIST" },
                { type: "Notification", id: "UNREAD_COUNT" },
            ],
        }),

        // PATCH /notifications/read-all
        markAllNotificationsRead: builder.mutation({
            query: () => ({
                url: "/notifications/read-all",
                method: "PATCH",
            }),
            invalidatesTags: [
                { type: "Notification", id: "LIST" },
                { type: "Notification", id: "UNREAD_COUNT" },
            ],
        }),

        // GET /notifications/stream — Server-Sent Events.
        // RTK Query's fetchBaseQuery isn't built for SSE; consume this
        // endpoint with a plain EventSource in a component/hook instead,
        // e.g.:
        //
        //   const es = new EventSource(
        //     `${import.meta.env.VITE_API_BASE_URL}/notifications/stream?token=${accessToken}`
        //   );
        //   es.onmessage = (e) => { ...update cache/UI... };
        //
        // Exposed here only as a query so the URL is centralized; do not
        // call `.initiate()` on it expecting a normal JSON response.
        getNotificationStreamUrl: builder.query({
            queryFn: () => ({
                data: `${import.meta.env.VITE_API_BASE_URL}/notifications/stream`,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetNotificationsQuery,
    useGetUnreadCountQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
    useGetNotificationStreamUrlQuery,
} = notificationsApi;