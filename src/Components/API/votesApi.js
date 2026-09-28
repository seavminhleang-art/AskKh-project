import { baseApi } from "./baseApi.js";

const votePayload = ({ postId, userId, voteTypeId }) => {
    const normalizedVoteTypeId = Number(voteTypeId);
    if (normalizedVoteTypeId !== 1 && normalizedVoteTypeId !== 2) {
        throw new Error("voteTypeId must be 1 (upvote) or 2 (downvote).");
    }
    return {
        postId,
        ...(userId == null ? {} : { userId }),
        voteTypeId: normalizedVoteTypeId,
        value: normalizedVoteTypeId === 1 ? 1 : -1,
    };
};

export const votesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /votes/{voteId}
        getVoteById: builder.query({
            query: (voteId) => `/votes/${voteId}`,
            providesTags: (result, error, voteId) => [{ type: "Vote", id: voteId }],
        }),

        // POST /votes   body: { postId, voteTypeId, value }
        createVote: builder.mutation({
            query: (vote) => ({
                url: "/votes",
                method: "POST",
                body: votePayload(vote),
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
                { type: "Post", id: "LIST" },
            ],
        }),

        // PUT /votes/{voteId}   body: { postId, voteTypeId, value }
        updateVote: builder.mutation({
            query: ({ voteId, ...vote }) => ({
                url: `/votes/${voteId}`,
                method: "PUT",
                body: votePayload(vote),
            }),
            invalidatesTags: (result, error, { voteId, postId }) => [
                { type: "Vote", id: voteId },
                { type: "Post", id: postId },
                { type: "Post", id: "LIST" },
            ],
        }),

        // DELETE /votes/{voteId}
        deleteVote: builder.mutation({
            query: (voteId) => ({
                url: `/votes/${voteId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, voteId) => [{ type: "Vote", id: voteId }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetVoteByIdQuery,
    useCreateVoteMutation,
    useUpdateVoteMutation,
    useDeleteVoteMutation,
} = votesApi;
