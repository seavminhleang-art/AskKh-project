import { baseApi } from '../../store/api/baseApi';

// The API requires `value` for its non-null votes.value column. Always derive
// it from voteTypeId so callers cannot accidentally submit null/undefined or
// an inconsistent value.
const votePayload = ({ postId, userId, voteTypeId }) => {
  const normalizedVoteTypeId = Number(voteTypeId);
  if (normalizedVoteTypeId !== 1 && normalizedVoteTypeId !== 2) {
    throw new Error('voteTypeId must be 1 (upvote) or 2 (downvote).');
  }
  return {
    postId,
    ...(userId == null ? {} : { userId }),
    voteTypeId: normalizedVoteTypeId,
    value: normalizedVoteTypeId === 1 ? 1 : -1,
  };
};

export const voteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    upvotePost: builder.mutation({
      query: (postId) => ({
        url: `/votes/posts/${encodeURIComponent(postId)}/upvote`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, postId) => [
        { type: 'Vote', id: postId },
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
        { type: 'LostFound', id: postId },
        { type: 'LostFound', id: 'LIST' },
      ],
    }),
    votePost: builder.mutation({
      query: (vote) => ({
        url: '/votes',
        method: 'POST',
        body: votePayload(vote),
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Vote', id: postId },
        { type: 'Post', id: postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),
    updateVote: builder.mutation({
      query: ({ voteId, ...vote }) => ({
        url: `/votes/${voteId}`,
        method: 'PUT',
        body: votePayload(vote),
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
  useUpvotePostMutation,
  useVotePostMutation,
  useUpdateVoteMutation,
  useDeleteVoteMutation,
} = voteApi;

// Compatibility aliases
export const useVoteQuestionMutation = voteApi.useVotePostMutation;
export const useVoteAnswerMutation = voteApi.useVotePostMutation;

export default voteApi;
