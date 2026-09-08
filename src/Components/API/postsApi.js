import { baseApi } from "../../api/baseApi";

export const postsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /posts
        getPosts: builder.query({
            query: () => "/posts",
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Post", id })),
                          { type: "Post", id: "LIST" },
                      ]
                    : [{ type: "Post", id: "LIST" }],
        }),

        // GET /posts/{postId}
        getPostById: builder.query({
            query: (postId) => `/posts/${postId}`,
            providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
        }),

        // GET /posts/search?query=
        searchPosts: builder.query({
            query: (query) => ({
                url: "/posts/search",
                params: { query },
            }),
        }),

        // GET /posts/search/relevance?query=
        searchPostsByRelevance: builder.query({
            query: (query) => ({
                url: "/posts/search/relevance",
                params: { query },
            }),
        }),

        // GET /posts/sort/score
        getPostsSortedByScore: builder.query({
            query: () => "/posts/sort/score",
        }),

        // GET /posts/sort/views
        getPostsSortedByViews: builder.query({
            query: () => "/posts/sort/views",
        }),

        // GET /posts/tag/{tagId}
        getPostsByTag: builder.query({
            query: (tagId) => `/posts/tag/${tagId}`,
        }),

        // GET /posts/type/{postTypeId}
        getPostsByType: builder.query({
            query: (postTypeId) => `/posts/type/${postTypeId}`,
        }),

        // GET /posts/user/{userId}
        getPostsByUser: builder.query({
            query: (userId) => `/posts/user/${userId}`,
        }),

        // GET /posts/answers/{parentId}
        getPostAnswers: builder.query({
            query: (parentId) => `/posts/answers/${parentId}`,
        }),

        // POST /posts   body: PostRequest
        // { title, body, codeSnippet, codeLanguage, postTypeId, parentId, tagIds, imageUrls }
        createPost: builder.mutation({
            query: (body) => ({
                url: "/posts",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Post", id: "LIST" }],
        }),

        // POST /posts/with-images  (multipart)
        createPostWithImages: builder.mutation({
            query: (formData) => ({
                url: "/posts/with-images",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [{ type: "Post", id: "LIST" }],
        }),

        // PUT /posts/{postId}  body: PostRequest
        updatePost: builder.mutation({
            query: ({ postId, ...body }) => ({
                url: `/posts/${postId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
                { type: "Post", id: "LIST" },
            ],
        }),

        // DELETE /posts/{postId}
        deletePost: builder.mutation({
            query: (postId) => ({
                url: `/posts/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, postId) => [
                { type: "Post", id: postId },
                { type: "Post", id: "LIST" },
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useSearchPostsQuery,
    useSearchPostsByRelevanceQuery,
    useGetPostsSortedByScoreQuery,
    useGetPostsSortedByViewsQuery,
    useGetPostsByTagQuery,
    useGetPostsByTypeQuery,
    useGetPostsByUserQuery,
    useGetPostAnswersQuery,
    useCreatePostMutation,
    useCreatePostWithImagesMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
} = postsApi;