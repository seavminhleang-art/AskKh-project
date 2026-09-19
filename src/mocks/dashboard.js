export const mockDashboardStats = [
  { key: 'totalUsers', title: 'Total Users', value: 11350, trend: 8.2, direction: 'up', supportingText: 'vs last month' },
  { key: 'activeUsers', title: 'Active Users', value: 794, trend: 3.4, direction: 'up', supportingText: 'in the last 24h' },
  { key: 'totalPosts', title: 'Total Posts', value: 4812, trend: -1.2, direction: 'down', supportingText: 'vs last month' },
  { key: 'pendingModeration', title: 'Pending Moderation', value: 143, trend: 12.5, direction: 'up', supportingText: 'needs review' },
]

export const mockUserGrowth = [
  { month: 'Mar', users: 7200 }, { month: 'Apr', users: 7860 }, { month: 'May', users: 8410 },
  { month: 'Jun', users: 9120 }, { month: 'Jul', users: 9990 }, { month: 'Aug', users: 10680 }, { month: 'Sep', users: 11350 },
]

export const mockPostActivity = [
  { day: 'Mon', posts: 62, comments: 140 }, { day: 'Tue', posts: 78, comments: 165 },
  { day: 'Wed', posts: 54, comments: 120 }, { day: 'Thu', posts: 91, comments: 200 },
  { day: 'Fri', posts: 70, comments: 158 }, { day: 'Sat', posts: 40, comments: 88 }, { day: 'Sun', posts: 35, comments: 70 },
]

export const mockCategoryDistribution = [
  { name: 'Academic', value: 38 }, { name: 'Campus Life', value: 24 },
  { name: 'Lost & Found', value: 14 }, { name: 'Marketplace', value: 12 }, { name: 'General', value: 12 },
]

export const mockRecentPosts = [
  { id: 'p101', title: 'Midterm study group for Data Structures?', author: 'Sokha Chan', date: '2026-09-10', status: 'Published' },
  { id: 'p102', title: 'Selling a barely-used scientific calculator', author: 'Vanna Ly', date: '2026-09-10', status: 'Pending' },
  { id: 'p103', title: 'Found a student ID card near Building C', author: 'Rithy Heng', date: '2026-09-09', status: 'Published' },
  { id: 'p104', title: 'Best cafes near campus for group study?', author: 'Sreymom Kea', date: '2026-09-09', status: 'Published' },
]

export const mockCampusChampions = [
  { id: 'ch1', name: 'Dr. Chara Oueng', title: 'Top All-Round Campus Champion', score: 5560, avatar: 'https://i.pravatar.cc/80?img=45' },
  { id: 'ch2', name: 'Khen Sereypanha', title: 'Runner Up', score: 4890, avatar: 'https://i.pravatar.cc/80?img=32' },
]