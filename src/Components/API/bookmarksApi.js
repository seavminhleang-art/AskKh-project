import { baseApi } from "../../api/baseApi";

export const bookmarksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /bookmarks
        getBookmarks: builder.query({
            query: () => "/bookmarks",
            providesTags: [{ type: "Bookmark", id: "LIST" }],
        }),

        // POST /bookmarks/add   body: { postIds }
        addBookmark: builder.mutation({
            query: (body) => ({
                url: "/bookmarks/add",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Bookmark", id: "LIST" }],
        }),

        // DELETE /bookmarks/remove   body: { postIds }
        removeBookmark: builder.mutation({
            query: (body) => ({
                url: "/bookmarks/remove",
                method: "DELETE",
                body,
            }),
            invalidatesTags: [{ type: "Bookmark", id: "LIST" }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetBookmarksQuery,
    useAddBookmarkMutation,
    useRemoveBookmarkMutation,
} = bookmarksApi;