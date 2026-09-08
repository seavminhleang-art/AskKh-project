import { baseApi } from "../../api/baseApi";

export const lostFoundApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ---- Reports ----

        // GET /lost-found/reports?itemType=
        getReports: builder.query({
            query: (itemType) => ({
                url: "/lost-found/reports",
                params: itemType ? { itemType } : undefined,
            }),
            providesTags: [{ type: "LostFoundReport", id: "LIST" }],
        }),

        // GET /lost-found/reports/{reportId}
        getReportById: builder.query({
            query: (reportId) => `/lost-found/reports/${reportId}`,
            providesTags: (result, error, reportId) => [
                { type: "LostFoundReport", id: reportId },
            ],
        }),

        // POST /lost-found/reports   body: ItemReportRequest
        // { itemType, title, categoryId, description, itemDate, scope,
        //   locationId, mapLat, mapLng, freeTextLocation, photoUrl, hiddenDetail }
        createReport: builder.mutation({
            query: (body) => ({
                url: "/lost-found/reports",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "LostFoundReport", id: "LIST" }],
        }),

        // NOTE: No PUT or DELETE exists for /lost-found/reports/{reportId}.
        // Do not add edit/delete mutations here — the API does not support them.

        // ---- Claims ----

        // GET /lost-found/reports/{reportId}/claims
        getClaimsForReport: builder.query({
            query: (reportId) => `/lost-found/reports/${reportId}/claims`,
            providesTags: (result, error, reportId) => [
                { type: "LostFoundClaim", id: `REPORT-${reportId}` },
            ],
        }),

        // POST /lost-found/reports/{reportId}/claims   body: { describedHiddenDetail }
        createClaim: builder.mutation({
            query: ({ reportId, ...body }) => ({
                url: `/lost-found/reports/${reportId}/claims`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { reportId }) => [
                { type: "LostFoundClaim", id: `REPORT-${reportId}` },
            ],
        }),

        // PATCH /lost-found/claims/{claimId}/approve
        approveClaim: builder.mutation({
            query: (claimId) => ({
                url: `/lost-found/claims/${claimId}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: [{ type: "LostFoundClaim", id: "LIST" }],
        }),

        // PATCH /lost-found/claims/{claimId}/reject
        rejectClaim: builder.mutation({
            query: (claimId) => ({
                url: `/lost-found/claims/${claimId}/reject`,
                method: "PATCH",
            }),
            invalidatesTags: [{ type: "LostFoundClaim", id: "LIST" }],
        }),

        // ---- Matches ----

        // GET /lost-found/reports/{reportId}/matches
        getMatchesForReport: builder.query({
            query: (reportId) => `/lost-found/reports/${reportId}/matches`,
            providesTags: (result, error, reportId) => [
                { type: "LostFoundMatch", id: `REPORT-${reportId}` },
            ],
        }),

        // PATCH /lost-found/matches/{matchId}?status=
        updateMatchStatus: builder.mutation({
            query: ({ matchId, status }) => ({
                url: `/lost-found/matches/${matchId}`,
                method: "PATCH",
                params: { status },
            }),
            invalidatesTags: [{ type: "LostFoundMatch", id: "LIST" }],
        }),

        // ---- Categories ----
        // NOTE: Only GET + POST exist. No PUT/DELETE — do not add edit/delete UI.

        // GET /lost-found/categories
        getCategories: builder.query({
            query: () => "/lost-found/categories",
            providesTags: [{ type: "LostFoundCategory", id: "LIST" }],
        }),

        // POST /lost-found/categories   body: { name }
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/lost-found/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "LostFoundCategory", id: "LIST" }],
        }),

        // ---- Locations ----
        // NOTE: Only GET + POST exist. No PUT/DELETE — do not add edit/delete UI.

        // GET /lost-found/locations
        getLocations: builder.query({
            query: () => "/lost-found/locations",
            providesTags: [{ type: "LostFoundLocation", id: "LIST" }],
        }),

        // POST /lost-found/locations   body: { building, floor, room }
        createLocation: builder.mutation({
            query: (body) => ({
                url: "/lost-found/locations",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "LostFoundLocation", id: "LIST" }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetReportsQuery,
    useGetReportByIdQuery,
    useCreateReportMutation,
    useGetClaimsForReportQuery,
    useCreateClaimMutation,
    useApproveClaimMutation,
    useRejectClaimMutation,
    useGetMatchesForReportQuery,
    useUpdateMatchStatusMutation,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useGetLocationsQuery,
    useCreateLocationMutation,
} = lostFoundApi;