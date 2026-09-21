import { baseApi } from '../../store/api/baseApi';
import { rankContributors } from './rankings';

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLeaderboard: builder.query({
      async queryFn(period = 'all', _api, _options, fetchWithBQ) {
        const response = await fetchWithBQ('/posts');
        if (response.error) return response;
        const body = response.data?.data ?? response.data;
        const posts = Array.isArray(body) ? body : body?.content ?? body?.items ?? body?.results;
        if (!Array.isArray(posts)) return { error: { status: 'CUSTOM_ERROR', error: 'Unsupported posts response.' } };
        return { data: rankContributors(posts, period) };
      },
      providesTags: ['Post', 'Comment', 'Vote'],
    }),
  }),
  overrideExisting: true,
});
export const { useGetLeaderboardQuery } = leaderboardApi;
export default leaderboardApi;
