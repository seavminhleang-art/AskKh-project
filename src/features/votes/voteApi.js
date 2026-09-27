import { baseApi } from '../../store/api/baseApi';

export const voteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    votePost: builder.mutation({
      query: ({ postId, voteTypeId, value }) => ({
        url: '/votes',
        method: 'POST',
        body: {
          postId,
          voteTypeId,
          value: value ?? (voteTypeId === 1 ? 1 : -1),
        },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Vote', id: postId },
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    updateVote: builder.mutation({
      query: ({ voteId, postId, voteTypeId, value }) => ({
        url: `/votes/${voteId}`,
        method: 'PUT',
        body: {
          postId,
          voteTypeId,
          value: value ?? (voteTypeId === 1 ? 1 : -1),
        },
      }),
      invalidatesTags: (result, error, { postId, voteId }) => [
        { type: 'Vote', id: voteId },
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    deleteVote: builder.mutation({
      query: (voteId) => ({
        url: `/votes/${voteId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vote', 'Post'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useVotePostMutation,
  useUpdateVoteMutation,
  useDeleteVoteMutation,
} = voteApi;

// Compatibility aliases
export const useVoteQuestionMutation = voteApi.useVotePostMutation;
export const useVoteAnswerMutation = voteApi.useVotePostMutation;

export default voteApi;
