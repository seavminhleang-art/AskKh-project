import { USE_MOCK_API, mockDelay } from '@/utils/mockMode'
import { useAsyncMock } from '@/utils/useAsyncMock'
import {
  mockDashboardStats, mockUserGrowth, mockPostActivity,
  mockCategoryDistribution, mockRecentPosts, mockCampusChampions,
} from '@/mocks/dashboardMock'

// TODO(real-api): no dashboard-aggregate endpoint exists in the OpenAPI
// spec yet. When one is added, replace this loader with an RTK Query
// hook injected into baseApi (e.g. useGetDashboardSummaryQuery) — the
// shape returned below should stay the same so Dashboard.jsx is untouched.
function loadMock() {
  return mockDelay({
    stats: mockDashboardStats,
    userGrowth: mockUserGrowth,
    postActivity: mockPostActivity,
    categoryDistribution: mockCategoryDistribution,
    recentPosts: mockRecentPosts,
    champions: mockCampusChampions,
  })
}

export function useDashboardData() {
  return useAsyncMock(() => (USE_MOCK_API ? loadMock() : loadMock()))
}