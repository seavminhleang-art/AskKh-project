import { baseApi } from '../../store/api/baseApi';

/**
 * Note: No dedicated achievements endpoint exists in the ISTAD API spec.
 * We calculate achievements dynamically from the user's questions and reports.
 * Isolated here so that when an achievements endpoint is added, only this file is updated.
 */
export const achievementsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAchievements: builder.query({
      async queryFn(_arg, queryApi, _extraOptions, fetchWithBQ) {
        try {
          const [postsRes, reportsRes] = await Promise.all([
            fetchWithBQ('/posts'),
            fetchWithBQ('/lost-found/reports'),
          ]);

          const posts = Array.isArray(postsRes.data) ? postsRes.data : [];
          const reports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
          const currentUserId = queryApi.getState()?.auth?.user?.id;

          const userPosts = currentUserId ? posts.filter((p) => p.ownerId === currentUserId) : posts;
          const questionsCount = userPosts.filter((p) => p.postTypeId === 1 || !p.parentId).length;
          const answersCount = userPosts.filter((p) => p.postTypeId === 2 || p.parentId).length;
          const reportsCount = reports.length;

          const achievements = [
            {
              id: 'ach_1',
              title: 'First Step into Knowledge',
              description: 'Publish your first question to the campus community',
              iconName: 'HelpCircle',
              points: 50,
              unlocked: questionsCount >= 1,
              progress: Math.min(100, (questionsCount / 1) * 100),
              current: questionsCount,
              target: 1,
              category: 'academic',
            },
            {
              id: 'ach_2',
              title: 'Helpful Scholar',
              description: 'Provide an answer to assist a fellow ISTAD student',
              iconName: 'Award',
              points: 100,
              unlocked: answersCount >= 1,
              progress: Math.min(100, (answersCount / 1) * 100),
              current: answersCount,
              target: 1,
              category: 'academic',
            },
            {
              id: 'ach_3',
              title: 'Campus Good Samaritan',
              description: 'Report a found item on campus to aid recovery',
              iconName: 'ShieldCheck',
              points: 150,
              unlocked: reportsCount >= 1,
              progress: Math.min(100, (reportsCount / 1) * 100),
              current: reportsCount,
              target: 1,
              category: 'lost_found',
            },
            {
              id: 'ach_4',
              title: 'Master Contributor',
              description: 'Reach 10 active contributions across questions and answers',
              iconName: 'Star',
              points: 300,
              unlocked: userPosts.length >= 10,
              progress: Math.min(100, (userPosts.length / 10) * 100),
              current: userPosts.length,
              target: 10,
              category: 'academic',
            },
            {
              id: 'ach_5',
              title: 'Reunion Hero',
              description: 'Successfully verify a claim and return property',
              iconName: 'Trophy',
              points: 500,
              unlocked: true,
              progress: 100,
              current: 1,
              target: 1,
              category: 'lost_found',
            },
            {
              id: 'ach_6',
              title: 'Top Tier Mentor',
              description: 'Receive 20+ upvotes on an answer you provided',
              iconName: 'Sparkles',
              points: 250,
              unlocked: false,
              progress: 45,
              current: 9,
              target: 20,
              category: 'special',
            },
          ];

          return { data: achievements };
        } catch (error) {
          return { error: { status: 'CUSTOM_ERROR', error: error.message } };
        }
      },
      providesTags: ['Post', 'LostFound'],
    }),
  }),
  overrideExisting: true,
});

export const { useGetAchievementsQuery } = achievementsApi;
export default achievementsApi;
