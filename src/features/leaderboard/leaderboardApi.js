import { baseApi } from '../../store/api/baseApi';
import { rankContributors } from './rankings';

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLeaderboard: builder.query({
      async queryFn(period = 'all', _api, _options, fetchWithBQ) {
        try {
          const response = await fetchWithBQ('/posts');
          if (response.error) return response;
          const body = response.data?.data ?? response.data;
          const posts = Array.isArray(body) ? body : body?.content ?? body?.items ?? body?.results;
          if (!Array.isArray(posts)) return { error: { status: 'CUSTOM_ERROR', error: 'Unsupported posts response.' } };

          let reportsList = [];
          try {
            const reportsRes = await fetchWithBQ('/lost-found/reports');
            const reportsBody = reportsRes.data?.data ?? reportsRes.data;
            if (Array.isArray(reportsBody)) reportsList = reportsBody;
          } catch {
            // Optional reports count enhancement
          }

          const ranked = rankContributors(posts, period);
          const reportCounts = new Map();
          for (const rep of reportsList) {
            if (rep.userId != null) {
              reportCounts.set(String(rep.userId), (reportCounts.get(String(rep.userId)) || 0) + 1);
            }
          }

          const enriched = ranked.map(item => {
            const returnedCount = reportCounts.get(String(item.id)) || item.helpful || 0;
            return {
              ...item,
              name: item.name || `User #${item.id}`,
              handle: item.handle || (item.name ? `@${item.name.toLowerCase().replace(/\s+/g, '_')}` : `@user${item.id}`),
              avatar: item.avatar || null,
              reputation: Math.max(10, item.points * 10),
              returned: returnedCount,
            };
          });

          return { data: enriched };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Post', 'Comment', 'Vote', 'User'],
    }),
  }),
  overrideExisting: true,
});
export const { useGetLeaderboardQuery } = leaderboardApi;
export default leaderboardApi;
