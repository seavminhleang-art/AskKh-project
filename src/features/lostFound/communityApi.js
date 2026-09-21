import { baseApi } from '../../store/api/baseApi';
import { request } from '../../store/api/forumRequest';

const communityApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    communityReport: builder.query({
      queryFn: (id, api, options) => request(`/lost-found/reports/${encodeURIComponent(id)}`, api, options),
      providesTags: ['LostFound'],
    }),
  }),
});
export const { useCommunityReportQuery } = communityApi;
