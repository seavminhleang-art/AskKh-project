import { baseApi } from '../../store/api/baseApi';

export const lostFoundApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => {
        if (!params) return '/lost-found/reports';
        if (typeof params === 'string') return `/lost-found/reports?itemType=${encodeURIComponent(params)}`;
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            queryParams.append(key, val);
          }
        });
        const qs = queryParams.toString();
        return qs ? `/lost-found/reports?${qs}` : '/lost-found/reports';
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'LostFound', id })),
              { type: 'LostFound', id: 'LIST' },
            ]
          : [{ type: 'LostFound', id: 'LIST' }],
    }),
    getReportById: builder.query({
      query: (reportId) => `/lost-found/reports/${reportId}`,
      providesTags: (result, error, reportId) => [{ type: 'LostFound', id: reportId }],
    }),
    createReport: builder.mutation({
      query: (reportData) => ({
        url: '/lost-found/reports',
        method: 'POST',
        body: reportData,
      }),
      invalidatesTags: [{ type: 'LostFound', id: 'LIST' }],
    }),
    getCategories: builder.query({
      query: () => '/lost-found/categories',
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: '/lost-found/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    getLocations: builder.query({
      query: () => '/lost-found/locations',
      providesTags: ['Location'],
    }),
    createLocation: builder.mutation({
      query: (body) => ({
        url: '/lost-found/locations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Location'],
    }),
    getClaims: builder.query({
      query: (reportId) =>
        reportId
          ? `/lost-found/reports/${reportId}/claims`
          : '/lost-found/reports/1/claims', // fallback if reportId is omitted
      providesTags: (result, error, reportId) => [{ type: 'Claim', id: reportId || 'LIST' }],
    }),
    createClaim: builder.mutation({
      query: ({ reportId, ...body }) => ({
        url: `/lost-found/reports/${reportId}/claims`,
        method: 'POST',
        body, // { describedHiddenDetail }
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: 'Claim', id: reportId },
        { type: 'Claim', id: 'LIST' },
      ],
    }),
    approveClaim: builder.mutation({
      query: (claimId) => ({
        url: `/lost-found/claims/${claimId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Claim', id: 'LIST' }, { type: 'LostFound', id: 'LIST' }],
    }),
    rejectClaim: builder.mutation({
      query: (claimId) => ({
        url: `/lost-found/claims/${claimId}/reject`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Claim', id: 'LIST' }, { type: 'LostFound', id: 'LIST' }],
    }),
    getMatches: builder.query({
      query: (reportId) =>
        reportId
          ? `/lost-found/reports/${reportId}/matches`
          : '/lost-found/reports/1/matches',
      providesTags: (result, error, reportId) => [{ type: 'Match', id: reportId || 'LIST' }],
    }),
    updateMatchStatus: builder.mutation({
      query: ({ matchId, status }) => ({
        url: `/lost-found/matches/${matchId}?status=${encodeURIComponent(status)}`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Match', id: 'LIST' }],
    }),
    deleteReport: builder.mutation({
      query: (reportId) => ({
        url: `/lost-found/reports/${reportId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'LostFound', id: 'LIST' }],
    }),
    updateReport: builder.mutation({
      query: ({ reportId, ...patch }) => ({
        url: `/lost-found/reports/${reportId}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: 'LostFound', id: reportId },
        { type: 'LostFound', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetReportsQuery,
  useLazyGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetLocationsQuery,
  useCreateLocationMutation,
  useGetClaimsQuery,
  useCreateClaimMutation,
  useApproveClaimMutation,
  useRejectClaimMutation,
  useGetMatchesQuery,
  useUpdateMatchStatusMutation,
  useDeleteReportMutation,
  useUpdateReportMutation,
} = lostFoundApi;

// Compatibility aliases
export const useGetLostFoundItemsQuery = lostFoundApi.useGetReportsQuery;
export const useLazyGetLostFoundItemsQuery = lostFoundApi.useLazyGetReportsQuery;
export const useGetLostFoundItemByIdQuery = lostFoundApi.useGetReportByIdQuery;
export const useCreateItemMutation = lostFoundApi.useCreateReportMutation;
export const useDeleteItemMutation = lostFoundApi.useDeleteReportMutation;
export const useUpdateItemStatusMutation = lostFoundApi.useUpdateReportMutation;

export default lostFoundApi;
