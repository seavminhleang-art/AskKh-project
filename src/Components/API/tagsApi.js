import { baseApi } from "../../api/baseApi";

export const tagsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /tags
        getTags: builder.query({
            query: () => "/tags",
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Tag", id })),
                          { type: "Tag", id: "LIST" },
                      ]
                    : [{ type: "Tag", id: "LIST" }],
        }),

        // GET /tags/{tagId}
        getTagById: builder.query({
            query: (tagId) => `/tags/${tagId}`,
            providesTags: (result, error, tagId) => [{ type: "Tag", id: tagId }],
        }),

        // GET /tags/popular
        getPopularTags: builder.query({
            query: () => "/tags/popular",
        }),

        // GET /tags/top/{limit}
        getTopTags: builder.query({
            query: (limit) => `/tags/top/${limit}`,
        }),

        // GET /tags/search?query=
        searchTags: builder.query({
            query: (query) => ({
                url: "/tags/search",
                params: { query },
            }),
        }),

        // POST /tags   body: { tagName }
        createTag: builder.mutation({
            query: (body) => ({
                url: "/tags",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Tag", id: "LIST" }],
        }),

        // PUT /tags/{tagId}   body: { tagName }
        updateTag: builder.mutation({
            query: ({ tagId, ...body }) => ({
                url: `/tags/${tagId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { tagId }) => [
                { type: "Tag", id: tagId },
                { type: "Tag", id: "LIST" },
            ],
        }),

        // DELETE /tags/{tagId}
        deleteTag: builder.mutation({
            query: (tagId) => ({
                url: `/tags/${tagId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, tagId) => [
                { type: "Tag", id: tagId },
                { type: "Tag", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetTagsQuery,
    useGetTagByIdQuery,
    useGetPopularTagsQuery,
    useGetTopTagsQuery,
    useSearchTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} = tagsApi;