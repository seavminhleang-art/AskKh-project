import { baseApi } from '../../store/api/baseApi';

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: (params) => {
        if (!params) return '/posts';
        if (typeof params === 'string') return `/posts?${params}`;
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            queryParams.append(key, val);
          }
        });
        const qs = queryParams.toString();
        return qs ? `/posts?${qs}` : '/posts';
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Post', id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    getPostById: builder.query({
      query: (postId) => `/posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Post', id: postId }],
    }),
    getAnswers: builder.query({
      query: (parentId) => `/posts/answers/${parentId}`,
      providesTags: (result, error, parentId) => [
        { type: 'Answer', id: parentId },
        { type: 'Post', id: parentId },
      ],
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: '/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    createPostWithImages: builder.mutation({
      query: (formData) => ({
        url: '/posts/with-images',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    createAnswer: builder.mutation({
      query: ({ parentId, body, codeSnippet, codeLanguage, imageUrls }) => ({
        url: '/posts',
        method: 'POST',
        body: {
          title: 'Answer',
          body,
          codeSnippet: codeSnippet || null,
          codeLanguage: codeLanguage || null,
          postTypeId: 2, // 2 indicates Answer
          parentId,
          tagIds: [],
          imageUrls: imageUrls || [],
        },
      }),
      invalidatesTags: (result, error, { parentId }) => [
        { type: 'Post', id: parentId },
        { type: 'Answer', id: parentId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    updatePost: builder.mutation({
      query: ({ postId, ...postData }) => ({
        url: `/posts/${postId}`,
        method: 'PUT',
        body: postData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    getPostsByViews: builder.query({
      query: () => '/posts/sort/views',
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    getPostsByScore: builder.query({
      query: () => '/posts/sort/score',
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    searchPosts: builder.query({
      query: (query) => `/posts/search?query=${encodeURIComponent(query || '')}`,
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    searchPostsRelevance: builder.query({
      query: (query) => `/posts/search/relevance?query=${encodeURIComponent(query || '')}`,
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    getPostsByTag: builder.query({
      query: (tagId) => `/posts/tag/${tagId}`,
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    getPostsByUser: builder.query({
      query: (userId) => `/posts/user/${userId}`,
      providesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPostsQuery,
  useLazyGetPostsQuery,
  useGetPostByIdQuery,
  useGetAnswersQuery,
  useCreatePostMutation,
  useCreatePostWithImagesMutation,
  useCreateAnswerMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostsByViewsQuery,
  useGetPostsByScoreQuery,
  useSearchPostsQuery,
  useLazySearchPostsQuery,
  useSearchPostsRelevanceQuery,
  useGetPostsByTagQuery,
  useGetPostsByUserQuery,
} = postApi;

// Aliases for seamless drop-in compatibility across the codebase
export const useGetQuestionsQuery = postApi.useGetPostsQuery;
export const useLazyGetQuestionsQuery = postApi.useLazyGetPostsQuery;
export const useGetQuestionByIdQuery = postApi.useGetPostByIdQuery;
export const useCreateQuestionMutation = postApi.useCreatePostMutation;
export const useAddAnswerMutation = postApi.useCreateAnswerMutation;
export const useAcceptAnswerMutation = postApi.useUpdatePostMutation;

export default postApi;
