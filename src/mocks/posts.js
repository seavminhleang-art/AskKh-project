export const mockPosts = [
  { id: 'p1', title: 'How to configure RTK Query base URL per environment?', author: 'Sokha Chan', tags: ['react', 'redux'], type: 'Question', views: 1204, score: 34, comments: 12, date: '2026-08-20', status: 'Published' },
  { id: 'p2', title: 'Best way to debounce a search input in React 19', author: 'Dara Poeun', tags: ['react', 'hooks'], type: 'Question', views: 3021, score: 61, comments: 24, date: '2026-07-02', status: 'Published' },
  { id: 'p3', title: 'Selling a barely-used scientific calculator', author: 'Vanna Ly', tags: ['marketplace'], type: 'Marketplace', views: 210, score: 4, comments: 3, date: '2026-09-10', status: 'Pending' },
  { id: 'p4', title: 'Found a student ID card near Building C', author: 'Rithy Heng', tags: ['lost-found'], type: 'Lost & Found', views: 88, score: 9, comments: 5, date: '2026-09-09', status: 'Published' },
  { id: 'p5', title: 'Guide: setting up a monorepo with Turborepo', author: 'Chenda Sok', tags: ['tooling', 'monorepo'], type: 'Guide', views: 5210, score: 142, comments: 38, date: '2026-06-11', status: 'Published' },
  { id: 'p6', title: 'This post violates the community guidelines?', author: 'Sopheak Ros', tags: ['off-topic'], type: 'Discussion', views: 44, score: -3, comments: 2, date: '2026-09-08', status: 'Flagged' },
]

export const mockPostDetail = (id) => ({
  id, title: 'How to configure RTK Query base URL per environment?',
  author: 'Sokha Chan', body: 'I want to switch the base URL between staging and production without rebuilding the app...',
  images: [], tags: ['react', 'redux'], views: 1204, score: 34,
  comments: [
    { id: 'c1', author: 'Dara Poeun', body: 'Use import.meta.env with a .env.production file.', date: '2026-08-20' },
  ],
})