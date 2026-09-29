import { baseApi } from '../../store/api/baseApi';
import { rankContributors } from './rankings';

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getLeaderboard: builder.query({
      async queryFn(period = 'all', api, _options, fetchWithBQ) {
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
            reportsList = Array.isArray(reportsBody)
              ? reportsBody
              : reportsBody?.content ?? reportsBody?.items ?? reportsBody?.results ?? [];
          } catch {
            // Optional reports count enhancement
          }

          let savedVotes = {};
          const currentUserId = api.getState()?.auth?.user?.id;
          if (currentUserId != null && typeof window !== 'undefined') {
            try {
              savedVotes = JSON.parse(window.localStorage.getItem('askkh:qa-votes') || '{}');
            } catch {
              savedVotes = {};
            }
          }
          const postsWithCurrentVote = posts.map((post) => {
            const vote = savedVotes[`${currentUserId}:${post.id}`];
            if (!vote || ![1, 2].includes(Number(vote.voteTypeId))) return post;
            const serverScore = Number(post.score ?? post.likeCount ?? post.likes ?? post.upVotes ?? post.upvotes ?? 0);
            const baseScore = Number(vote.baseScore ?? serverScore);
            if (!Number.isFinite(serverScore) || !Number.isFinite(baseScore) || serverScore !== baseScore) return post;
            return { ...post, score: baseScore + (Number(vote.voteTypeId) === 1 ? 1 : -1) };
          });

          const ranked = rankContributors(postsWithCurrentVote, period, new Date(), reportsList);
          const reportCounts = new Map();
          for (const rep of reportsList) {
            const reporterId = rep.userId ?? rep.reporterUserId ?? rep.ownerId;
            if (reporterId != null) {
              reportCounts.set(String(reporterId), (reportCounts.get(String(reporterId)) || 0) + 1);
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
      providesTags: ['Post', 'Comment', 'Vote', 'User', 'LostFound'],
    }),
  }),
  overrideExisting: true,
});
export const { useGetLeaderboardQuery } = leaderboardApi;
export default leaderboardApi;
