/**
 * Realistic Static Sample Data for Forum (Q&A Community)
 * Used for static UI rendering across Forum pages.
 */

export const forumCategories = [
  { id: 'all', label: 'All Questions' },
  { id: 'latest', label: 'Latest' },
  { id: 'popular', label: 'Popular' },
  { id: 'unanswered', label: 'Unanswered' },
  { id: 'my-questions', label: 'My Questions' },
];

export const forumTags = [
  { name: 'React', count: 48 },
  { name: 'JWT', count: 32 },
  { name: 'Spring Boot', count: 29 },
  { name: 'TailwindCSS', count: 24 },
  { name: 'Redux', count: 19 },
  { name: 'Vite', count: 16 },
  { name: 'PostgreSQL', count: 14 },
  { name: 'TypeScript', count: 12 },
];

export const sampleQuestions = [
  {
    id: '1',
    title: 'How can I use JWT authentication securely in a React + Vite SPA?',
    slug: 'how-can-i-use-jwt-authentication-in-react',
    body: `I am building a single-page application using React 19 and Vite with a Spring Boot REST API backend.

Currently, I receive an access token and a refresh token upon successful login. What is the industry recommended way to store the access token in memory while persisting the refresh token securely?

\`\`\`javascript
// Current token storage approach
const handleLoginSuccess = (tokens) => {
  localStorage.setItem('refreshToken', tokens.refreshToken);
  store.dispatch(setCredentials({ token: tokens.accessToken }));
};
\`\`\`

Any guidance on intercepting 401 Unauthorized responses with RTK Query and mutex re-authentication would be greatly appreciated!`,
    author: {
      name: 'Vicheka San',
      username: 'vicheka',
      role: 'ISTAD Scholar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['React', 'JWT', 'Authentication', 'Vite'],
    votes: 24,
    answersCount: 3,
    views: 342,
    createdAt: '2026-09-08T08:30:00Z',
    isAnswered: true,
    answers: [
      {
        id: 'ans-1',
        author: {
          name: 'Sokha Meng',
          username: 'sokhameng',
          role: 'Instructor',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        },
        content: `Great question! The standard best practice for SPAs is:

1. Keep the short-lived \`accessToken\` in **in-memory RAM** (such as Redux Toolkit store). Never store access tokens in \`localStorage\` because of XSS vulnerabilities.
2. Store the long-lived \`refreshToken\` in an **HttpOnly secure cookie** or encrypted local storage.
3. Use a custom base query wrapper (e.g. \`baseQueryWithReauth\`) to automatically catch 401 statuses and perform a refresh flow using a mutex lock to avoid race conditions.

Here is a recommended RTK Query wrapper:
\`\`\`javascript
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // refresh token logic with mutex
  }
  return result;
};
\`\`\``,
        votes: 18,
        createdAt: '2026-09-08T10:15:00Z',
        isAccepted: true,
        comments: [
          {
            id: 'c-1',
            author: 'Vicheka San',
            text: 'This mutex approach solved my double refresh issue completely. Thank you!',
            createdAt: '2026-09-08T11:00:00Z',
          },
        ],
      },
      {
        id: 'ans-2',
        author: {
          name: 'Chan Dara',
          username: 'chandara',
          role: 'Senior Member',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        },
        content: `Additionally, make sure your token expiration on the backend is tuned appropriately (e.g. 15 minutes for access token, 7 days for refresh token). Always invalidate refresh tokens upon explicit logout!`,
        votes: 6,
        createdAt: '2026-09-08T14:20:00Z',
        isAccepted: false,
        comments: [],
      },
      {
        id: 'ans-3',
        author: {
          name: 'Kimleang Rath',
          username: 'kimleang',
          role: 'ISTAD Member',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        },
        content: `Don't forget to handle the window unload or app rehydration so that on browser refresh, your app calls \`/auth/refresh-token\` to re-populate the memory store.`,
        votes: 4,
        createdAt: '2026-09-09T09:00:00Z',
        isAccepted: false,
        comments: [],
      },
    ],
  },
  {
    id: '2',
    title: 'How to optimize Tailwind CSS bundle size in Vite production builds?',
    slug: 'how-to-optimize-tailwind-css-bundle-size-in-vite',
    body: 'My production CSS bundle reached 140KB. Are there recommended Tailwind and Vite plugins to purge unused utility classes and enable modern CSS nesting without overhead?',
    author: {
      name: 'Piseth Long',
      username: 'piseth',
      role: 'ISTAD Scholar',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['TailwindCSS', 'Vite', 'Frontend'],
    votes: 15,
    answersCount: 2,
    views: 198,
    createdAt: '2026-09-09T11:00:00Z',
    isAnswered: true,
  },
  {
    id: '3',
    title: 'Best practices for managing global state in React 19 without Redux overkill?',
    slug: 'best-practices-for-managing-global-state-in-react-19',
    body: 'With React 19 Actions and useOptimistic, when is a dedicated state library like Zustand or RTK still recommended for campus enterprise dashboards?',
    author: {
      name: 'Rithy Sok',
      username: 'rithysok',
      role: 'Alumni',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['React', 'State Management'],
    votes: 19,
    answersCount: 4,
    views: 280,
    createdAt: '2026-09-09T14:45:00Z',
    isAnswered: true,
  },
  {
    id: '4',
    title: 'Connecting Spring Boot WebSockets for real-time campus notifications',
    slug: 'connecting-spring-boot-websockets-for-real-time-notifications',
    body: 'We are adding instant alerts for lost item matches. Has anyone configured STOMP over SockJS with React hooks cleanly?',
    author: {
      name: 'Thida Keo',
      username: 'thidakeo',
      role: 'ISTAD Scholar',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['Spring Boot', 'WebSockets', 'Notifications'],
    votes: 11,
    answersCount: 1,
    views: 145,
    createdAt: '2026-09-10T02:15:00Z',
    isAnswered: false,
  },
  {
    id: '5',
    title: 'Proper error boundary configuration for route-level failure recovery in React Router 7',
    slug: 'error-boundary-configuration-in-react-router',
    body: 'How should we handle chunk load failures and 404/500 screens cleanly without crashing the main application sidebar and header?',
    author: {
      name: 'Davit Chea',
      username: 'davitchea',
      role: 'ISTAD Scholar',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    },
    tags: ['React Router', 'Error Handling'],
    votes: 8,
    answersCount: 0,
    views: 92,
    createdAt: '2026-09-10T07:20:00Z',
    isAnswered: false,
  },
];

export const forumCommunityStats = {
  totalQuestions: 142,
  totalAnswers: 388,
  resolvedDiscussions: 118,
  activeScholars: 245,
};
