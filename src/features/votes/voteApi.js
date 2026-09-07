import { baseApi } from '../../store/api/baseApi';

export const voteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    votePost: builder.mutation({
      query: ({ postId, voteTypeId }) => ({
        url: '/votes',
        method: 'POST',
        body: { postId, voteTypeId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Vote', id: postId },
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    updateVote: builder.mutation({
      query: ({ voteId, voteTypeId }) => ({
        url: `/votes/${voteId}`,
        method: 'PUT',
        body: { voteTypeId },
      }),
      invalidatesTags: ['Vote', 'Post'],
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
