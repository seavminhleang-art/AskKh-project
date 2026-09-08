import { baseApi } from "../../api/baseApi";

export const votesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET /votes/{voteId}
        getVoteById: builder.query({
            query: (voteId) => `/votes/${voteId}`,
            providesTags: (result, error, voteId) => [{ type: "Vote", id: voteId }],
        }),

        // POST /votes   body: { postId, voteTypeId }
        createVote: builder.mutation({
            query: (body) => ({
                url: "/votes",
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { postId }) => [
                { type: "Post", id: postId },
            ],
        }),

        // PUT /votes/{voteId}   body: { postId, voteTypeId }
        updateVote: builder.mutation({
            query: ({ voteId, ...body }) => ({
                url: `/votes/${voteId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { voteId, postId }) => [
                { type: "Vote", id: voteId },
                { type: "Post", id: postId },
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