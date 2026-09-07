import { baseApi } from '../../store/api/baseApi';

export const bookmarkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookmarks: builder.query({
      query: () => '/bookmarks',
      providesTags: ['Bookmark'],
    }),
    addBookmark: builder.mutation({
      query: (postIds) => ({
        url: '/bookmarks/add',
        method: 'POST',
        body: Array.isArray(postIds) ? { postIds } : { postIds: [postIds] },
      }),
      invalidatesTags: ['Bookmark'],
    }),
    removeBookmark: builder.mutation({
      query: (postIds) => ({
        url: '/bookmarks/remove',
        method: 'DELETE',
        body: Array.isArray(postIds) ? { postIds } : { postIds: [postIds] },
      }),
      invalidatesTags: ['Bookmark'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetBookmarksQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} = bookmarkApi;

export default bookmarkApi;
