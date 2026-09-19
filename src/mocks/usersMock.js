export const mockUsers = [
  { id: 'u1', name: 'Sokha Chan', email: 'sokha.chan@istad.co', role: 'Student', status: 'Active', reputation: 4812, posts: 42, joined: '2025-02-14', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 'u2', name: 'Dara Poeun', email: 'dara.poeun@istad.co', role: 'Moderator', status: 'Active', reputation: 3120, posts: 88, joined: '2024-11-02', avatar: 'https://i.pravatar.cc/80?img=32' },
  { id: 'u3', name: 'Vanna Ly', email: 'vanna.ly@istad.co', role: 'Student', status: 'Suspended', reputation: 210, posts: 6, joined: '2026-01-19', avatar: 'https://i.pravatar.cc/80?img=5' },
  { id: 'u4', name: 'Chenda Sok', email: 'chenda.sok@istad.co', role: 'Instructor', status: 'Active', reputation: 5560, posts: 130, joined: '2023-08-30', avatar: 'https://i.pravatar.cc/80?img=45' },
  { id: 'u5', name: 'Rithy Heng', email: 'rithy.heng@istad.co', role: 'Student', status: 'Pending', reputation: 40, posts: 1, joined: '2026-08-02', avatar: 'https://i.pravatar.cc/80?img=8' },
  { id: 'u6', name: 'Sreymom Kea', email: 'sreymom.kea@istad.co', role: 'Student', status: 'Active', reputation: 1980, posts: 27, joined: '2025-05-21', avatar: 'https://i.pravatar.cc/80?img=25' },
  { id: 'u7', name: 'Piseth Ouk', email: 'piseth.ouk@istad.co', role: 'Admin', status: 'Active', reputation: 9040, posts: 210, joined: '2022-06-10', avatar: 'https://i.pravatar.cc/80?img=15' },
  { id: 'u8', name: 'Sopheak Ros', email: 'sopheak.ros@istad.co', role: 'Student', status: 'Banned', reputation: 15, posts: 3, joined: '2026-03-11', avatar: 'https://i.pravatar.cc/80?img=19' },
]

export const mockUserActivity = (userId) => ({
  posts: [
    { id: 'p1', title: 'How to configure RTK Query base URL per environment?', date: '2026-08-20', score: 14 },
    { id: 'p2', title: 'Best way to debounce a search input in React 19', date: '2026-07-02', score: 31 },
  ],
  comments: [
    { id: 'c1', body: 'You could use fetchBaseQuery with prepareHeaders for that.', date: '2026-08-21' },
    { id: 'c2', body: 'This worked, thanks a lot!', date: '2026-07-03' },
  ],
})
