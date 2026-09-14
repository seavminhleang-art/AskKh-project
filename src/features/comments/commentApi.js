import { baseApi } from '../../store/api/baseApi';

export const commentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommentsByPost: builder.query({
      query: (postId) => `/comments/post/${postId}`,
      providesTags: (result, error, postId) => [{ type: 'Comment', id: postId }],
    }),
    getCommentsByUser: builder.query({
      query: (userId) => `/comments/user/${userId}`,
      providesTags: ['Comment'],
    }),
    createComment: builder.mutation({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body, // { postId, text }
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: postId },
        { type: 'Post', id: postId },
      ],
    }),
    updateComment: builder.mutation({
      query: ({ commentId, ...body }) => ({
        url: `/comments/${commentId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Comment'],
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/comments/${commentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetCommentsByPostQuery,
  useGetCommentsByUserQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;

export const useAddCommentMutation = commentApi.useCreateCommentMutation;

export default commentApi;
