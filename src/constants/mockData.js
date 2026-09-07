export const INITIAL_USERS = [
  {
    id: 'user-1',
    name: 'Sokha Mean',
    nameKh: 'សុខា មាន',
    email: 'sokha.mean@istad.edu.kh',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Year 3 Software Engineering Student',
    points: 1250,
    reputation: 98,
    isBlocked: false,
    createdAt: '2025-10-12T08:30:00Z',
    bio: 'Passionate full-stack developer focusing on React, Tailwind, and Spring Boot.',
    badgeCount: 6,
  },
  {
    id: 'user-2',
    name: 'Chenda Keo',
    nameKh: 'ចិន្តា កែវ',
    email: 'chenda.keo@istad.edu.kh',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    title: 'Year 2 Mobile Application Development Student',
    points: 840,
    reputation: 94,
    isBlocked: false,
    createdAt: '2025-11-05T10:15:00Z',
    bio: 'Flutter enthusiast & UI/UX explorer. Always happy to help classmates.',
    badgeCount: 4,
  },
  {
    id: 'user-3',
    name: 'Dr. Chan Vichea',
    nameKh: 'បណ្ឌិត ចាន់ វិជ្ជា',
    email: 'vichea.chan@istad.edu.kh',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Faculty & Database Architecture Lead',
    points: 3420,
    reputation: 99,
    isBlocked: false,
    createdAt: '2025-08-01T09:00:00Z',
    bio: 'Lecturer in Distributed Systems and PostgreSQL optimizations at ISTAD.',
    badgeCount: 12,
  },
  {
    id: 'user-4',
    name: 'Admin Virak',
    nameKh: 'វីរៈ រដ្ឋបាល',
    email: 'admin.virak@istad.edu.kh',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'ISTAD Campus Community & Operations Admin',
    points: 5120,
    reputation: 100,
    isBlocked: false,
    createdAt: '2025-06-15T08:00:00Z',
    bio: 'Overseeing campus digital workflow, student safety, and community compliance.',
    badgeCount: 15,
  },
];

export const INITIAL_QUESTIONS = [
  {
    id: 'q-101',
    title: 'How to properly structure RTK Query cache invalidation for nested relations in React 19?',
    titleKh: 'របៀបរៀបចំរចនាសម្ព័ន្ធ RTK Query cache invalidation សម្រាប់ទិន្នន័យ nested ក្នុង React 19?',
    description: 'In our ISTAD final year project, we have Questions, Answers, and nested Comments. When someone votes on an answer, what is the cleanest way to invalidate tags without re-fetching the entire parent question payload?',
    category: 'web-dev',
    tags: ['react', 'redux-toolkit', 'rtk-query', 'javascript'],
    author: INITIAL_USERS[0],
    votes: 42,
    userVote: 0, // -1, 0, 1
    views: 480,
    createdAt: '2026-02-28T14:20:00Z',
    isResolved: true,
    answers: [
      {
        id: 'ans-1',
        content: 'You can achieve granular cache updates using `providesTags: (result, error, id) => [{ type: "Answer", id }]` and then dispatching `invalidatesTags: (result, error, { answerId }) => [{ type: "Answer", id: answerId }]`. Alternatively, you can use `onQueryStarted` for optimistic cache updates (`apiSlice.util.updateQueryData`) which delivers zero-latency UI responses!',
        author: INITIAL_USERS[2],
        votes: 28,
        userVote: 0,
        createdAt: '2026-02-28T16:00:00Z',
        isAccepted: true,
        comments: [
          {
            id: 'c-1',
            content: 'Thank you Dr. Vichea! The optimistic update pattern worked flawlessly in our demo.',
            author: INITIAL_USERS[0],
            createdAt: '2026-02-28T16:45:00Z',
          }
        ]
      },
      {
        id: 'ans-2',
        content: 'Check out the RTK Query `tagTypes` documentation for `providesTags` with list IDs. Keeping a distinct list tag like `{ type: "Answer", id: "LIST" }` prevents unintended full refetches.',
        author: INITIAL_USERS[1],
        votes: 11,
        userVote: 0,
        createdAt: '2026-03-01T09:10:00Z',
        isAccepted: false,
        comments: []
      }
    ]
  },
  {
    id: 'q-102',
    title: 'Best approach for handling JWT Refresh Tokens with Spring Boot 3 & HTTP-Only cookies?',
    titleKh: 'វិធីសាស្ត្រល្អបំផុតក្នុងការដោះស្រាយ JWT Refresh Token ជាមួយ Spring Boot 3 & Cookies?',
    description: 'We are developing our authentication microservice for the ISTAD campus portal. Should we store refresh tokens in Redis or PostgreSQL, and what is the best rotation strategy?',
    category: 'spring-java',
    tags: ['spring-boot', 'jwt', 'security', 'java', 'redis'],
    author: INITIAL_USERS[1],
    votes: 35,
    userVote: 0,
    views: 390,
    createdAt: '2026-03-02T11:00:00Z',
    isResolved: false,
    answers: [
      {
        id: 'ans-3',
        content: 'For high-throughput campus services, Redis with short TTL (e.g. 7 days) and token family rotation is recommended. If a reused token is detected, invalidate the entire family immediately to protect the student account.',
        author: INITIAL_USERS[2],
        votes: 19,
        userVote: 0,
        createdAt: '2026-03-02T12:30:00Z',
        isAccepted: false,
        comments: []
      }
    ]
  },
  {
    id: 'q-103',
    title: 'Where can I borrow extra USB-C to HDMI adapters for presentation in Lab 302?',
    titleKh: 'តើខ្ញុំអាចខ្ចីឧបករណ៍បម្លែង USB-C ទៅ HDMI បន្ថែមសម្រាប់ធ្វើបទបង្ហាញនៅបន្ទប់ Lab 302 នៅឯណា?',
    description: 'Our team has a presentation this afternoon at 2:00 PM in Lab 302. Does the IT office on the 1st floor have adapters available for loan today?',
    category: 'campus-life',
    tags: ['campus', 'presentation', 'hardware', 'lab302'],
    author: INITIAL_USERS[0],
    votes: 15,
    userVote: 0,
    views: 210,
    createdAt: '2026-03-03T08:45:00Z',
    isResolved: true,
    answers: [
      {
        id: 'ans-4',
        content: 'Yes! You can visit the Student Operations Desk in the 1st Floor Admin wing. Just present your ISTAD Student ID card to check one out for 4 hours.',
        author: INITIAL_USERS[3],
        votes: 14,
        userVote: 0,
        createdAt: '2026-03-03T09:05:00Z',
        isAccepted: true,
        comments: []
      }
    ]
  },
  {
    id: 'q-104',
    title: 'Flutter Riverpod 2.0 vs Bloc for large-scale graduation projects?',
    titleKh: 'ប្រៀបធៀប Flutter Riverpod 2.0 និង Bloc សម្រាប់គម្រោងបញ្ចប់ការសិក្សា?',
    description: 'We are starting our final semester capstone project. Some teammates prefer Riverpod for code generation and simplicity, while others advocate for Bloc due to strict unidirectional events. What are your experiences?',
    category: 'mobile-dev',
    tags: ['flutter', 'riverpod', 'bloc', 'state-management', 'dart'],
    author: INITIAL_USERS[1],
    votes: 27,
    userVote: 0,
    views: 340,
    createdAt: '2026-03-03T16:15:00Z',
    isResolved: false,
    answers: [
      {
        id: 'ans-5',
        content: 'Both are industry standards. If your team values rapid prototyping and clean dependency injection, Riverpod 2.0 with `@riverpod` annotations is faster to write. If your faculty evaluator expects enterprise patterns, Bloc with clear Events/States is very easy to audit.',
        author: INITIAL_USERS[0],
        votes: 18,
        userVote: 0,
        createdAt: '2026-03-03T18:00:00Z',
        isAccepted: false,
        comments: []
      }
    ]
  },
  {
    id: 'q-105',
    title: 'Indexing strategies for PostgreSQL full-text search in Khmer and English text?',
    titleKh: 'យុទ្ធសាស្ត្រ Indexing សម្រាប់ PostgreSQL full-text search ជាភាសាខ្មែរ និង អង់គ្លេស?',
    description: 'We want to search both English tech terms and Khmer descriptions in our campus repository. How do GIN and GiST indexes perform with pg_trgm for partial matching?',
    category: 'database',
    tags: ['postgresql', 'database', 'khmer-nlp', 'sql', 'performance'],
    author: INITIAL_USERS[0],
    votes: 38,
    userVote: 0,
    views: 512,
    createdAt: '2026-03-04T07:20:00Z',
    isResolved: true,
    answers: [
      {
        id: 'ans-6',
        content: 'Use `pg_trgm` extension with a `GIN (column gin_trgm_ops)` index! GIN has higher build time but provides lightning-fast search queries for `LIKE %keyword%` and bilingual strings.',
        author: INITIAL_USERS[2],
        votes: 30,
        userVote: 0,
        createdAt: '2026-03-04T09:00:00Z',
        isAccepted: true,
        comments: []
      }
    ]
  }
];

export const INITIAL_LOST_FOUND_ITEMS = [
  {
    id: 'item-201',
    name: 'MacBook Pro M2 14" Space Gray',
    nameKh: 'កុំព្យូទ័រ MacBook Pro M2 14 អ៊ីញ ពណ៌ប្រផេះ',
    type: 'LOST', // LOST or FOUND
    status: 'LOST', // LOST, FOUND, RECOVERED, PENDING, CLAIMED
    category: 'electronics',
    location: 'ISTAD Main Building - Floor 3 (Lab 302)',
    date: '2026-03-03',
    time: '17:30',
    description: 'Left on desk 14 near the back window of Lab 302 after the evening Advanced React session. It has a blue ISTAD Developer sticker and a GitHub Octocat decal on the top lid.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    ],
    contactInfo: 'Telegram: @sokha_dev / Phone: 012 345 678',
    reporter: INITIAL_USERS[0],
    createdAt: '2026-03-03T18:15:00Z',
    potentialMatchesCount: 1,
    verified: true,
  },
  {
    id: 'item-202',
    name: 'Apple MacBook Pro (Retrieved by Custodian)',
    nameKh: 'កុំព្យូទ័រ MacBook Pro រើសបានដោយបុគ្គលិកអនាម័យ',
    type: 'FOUND',
    status: 'FOUND',
    category: 'electronics',
    location: 'ISTAD Main Building - Floor 3 (Lab 302)',
    date: '2026-03-03',
    time: '18:45',
    description: 'Found on table in Lab 302 during evening classroom cleaning. Space gray finish with programming stickers. Safely deposited at Student Services Desk Floor 1.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    ],
    contactInfo: 'Admin Reception Desk Floor 1',
    reporter: INITIAL_USERS[3],
    createdAt: '2026-03-03T19:00:00Z',
    potentialMatchesCount: 1,
    verified: true,
  },
  {
    id: 'item-203',
    name: 'ISTAD Student ID Card (Sokha Mean)',
    nameKh: 'កាតសិស្ស ISTAD (សុខា មាន)',
    type: 'FOUND',
    status: 'FOUND',
    category: 'id-cards',
    location: 'Cafeteria & Canteen Area',
    date: '2026-03-04',
    time: '12:15',
    description: 'Found on the lunch bench near the drink station. Card holder has a red ISTAD lanyard with Student ID: CST-2023-089.',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    ],
    contactInfo: 'Cafeteria counter / or contact 098 765 432',
    reporter: INITIAL_USERS[1],
    createdAt: '2026-03-04T12:30:00Z',
    potentialMatchesCount: 1,
    verified: true,
  },
  {
    id: 'item-204',
    name: 'Sony WH-1000XM5 Wireless Headphones',
    nameKh: 'កាសឥតខ្សែ Sony WH-1000XM5',
    type: 'LOST',
    status: 'LOST',
    category: 'accessories',
    location: 'Campus Library & Study Area',
    date: '2026-03-02',
    time: '15:20',
    description: 'Black Sony headphones in original zippered case. Left near individual study carrel #8 on the second floor of the library.',
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    ],
    contactInfo: 'Telegram: @chenda_keo',
    reporter: INITIAL_USERS[1],
    createdAt: '2026-03-02T16:00:00Z',
    potentialMatchesCount: 0,
    verified: true,
  },
  {
    id: 'item-205',
    name: 'Hydro Flask 32oz Cobalt Water Bottle',
    nameKh: 'ដបទឹក Hydro Flask ពណ៌ខៀវ 32oz',
    type: 'FOUND',
    status: 'FOUND',
    category: 'accessories',
    location: 'Student Lounge & Discussion Room',
    date: '2026-03-04',
    time: '10:00',
    description: 'Blue insulated water bottle with straw lid. In good condition, left on round table.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
    ],
    contactInfo: 'Front desk reception Floor 1',
    reporter: INITIAL_USERS[3],
    createdAt: '2026-03-04T10:30:00Z',
    potentialMatchesCount: 0,
    verified: true,
  },
  {
    id: 'item-206',
    name: 'Honda Scoopy Motorcycle Smart Key',
    nameKh: 'សោឆ្លាតវៃម៉ូតូ Honda Scoopy',
    type: 'FOUND',
    status: 'RECOVERED',
    category: 'keys',
    location: 'Ground Floor Parking Lot',
    date: '2026-03-01',
    time: '08:15',
    description: 'Black remote key fob with Doraemon rubber keychain, found near row B motorcycle parking.',
    images: [
      'https://images.unsplash.com/photo-1589330694653-dad6ef49ab6f?w=800&auto=format&fit=crop&q=80',
    ],
    contactInfo: 'Security checkpoint gate 1',
    reporter: INITIAL_USERS[3],
    createdAt: '2026-03-01T08:30:00Z',
    potentialMatchesCount: 0,
    verified: true,
  }
];

export const INITIAL_SMART_MATCHES = [
  {
    id: 'match-301',
    lostItem: INITIAL_LOST_FOUND_ITEMS[0], // MacBook Pro M2
    foundItem: INITIAL_LOST_FOUND_ITEMS[1], // Retrieved Apple MacBook
    matchScore: 96,
    status: 'NEW', // NEW, PENDING, CONFIRMED, REJECTED
    matchingAttributes: [
      { label: 'Category Match', score: '100%', detail: 'Both identified as Laptop / Electronics' },
      { label: 'Location Match', score: '98%', detail: 'Floor 3 (Lab 302) reported on same desk cluster' },
      { label: 'Time Proximity', score: '94%', detail: 'Reported within 1 hour 15 minutes window' },
      { label: 'Visual Identifier', score: '92%', detail: 'Space gray finish with software developer decals' },
    ],
    createdAt: '2026-03-03T19:05:00Z',
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'claim-401',
    itemId: 'item-203',
    item: INITIAL_LOST_FOUND_ITEMS[2], // ID Card
    claimant: INITIAL_USERS[0], // Sokha Mean
    status: 'PENDING', // PENDING, APPROVED, REJECTED, COMPLETED
    proofDescription: 'The student ID card has my name "Sokha Mean" and Student ID CST-2023-089. I can show my digital campus profile and national ID.',
    proofPhoto: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    createdAt: '2026-03-04T13:00:00Z',
    adminNotes: 'Awaiting student to visit Student Services Desk with digital student app.',
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-501',
    userId: 'user-1',
    type: 'match_found',
    title: 'Smart Match Detected! (96% Confidence)',
    titleKh: 'ប្រព័ន្ធបានរកឃើញការផ្គូផ្គង! (ទំនុកចិត្ត 96%)',
    message: 'An item matching your "MacBook Pro M2" was turned in at Student Services by Campus Operations.',
    link: '/matches',
    isRead: false,
    createdAt: '2026-03-03T19:10:00Z',
  },
  {
    id: 'notif-502',
    userId: 'user-1',
    type: 'question_answer',
    title: 'New Answer on your RTK Query question',
    titleKh: 'មានចម្លើយថ្មីលើសំនួរ RTK Query របស់អ្នក',
    message: 'Dr. Chan Vichea accepted your technical scenario and posted a solution on granular cache updates.',
    link: '/questions/q-101',
    isRead: false,
    createdAt: '2026-02-28T16:05:00Z',
  },
  {
    id: 'notif-503',
    userId: 'user-1',
    type: 'claim_update',
    title: 'Claim Received for Student ID Card',
    titleKh: 'ការស្នើសុំទាមទារកាតសិស្សត្រូវបានទទួល',
    message: 'Your claim request #claim-401 for Student ID Card is currently under review by Campus Admin.',
    link: '/claims',
    isRead: true,
    createdAt: '2026-03-04T13:05:00Z',
  },
  {
    id: 'notif-504',
    userId: 'user-1',
    type: 'system',
    title: 'Welcome to Nexa Ask & Found Hub',
    titleKh: 'សូមស្វាគមន៍មកកាន់ Nexa Ask & Found',
    message: 'You have earned the "First Registration" campus badge. Explore Q&A or search recovered items.',
    link: '/achievements',
    isRead: true,
    createdAt: '2026-02-28T14:00:00Z',
  }
];

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'ach-1',
    title: 'First Question Asked',
    titleKh: 'សំនួរដំបូងបង្អស់',
    description: 'Posted your inaugural inquiry on the ISTAD technical forum.',
    tier: 'BRONZE',
    points: 50,
    unlocked: true,
    icon: 'HelpCircle',
    dateUnlocked: '2026-02-28',
  },
  {
    id: 'ach-2',
    title: 'Helpful Member',
    titleKh: 'សមាជិកជួយយកអាសា',
    description: 'Received 10+ upvotes on an answer or verified recovery tip.',
    tier: 'SILVER',
    points: 150,
    unlocked: true,
    icon: 'ThumbsUp',
    dateUnlocked: '2026-03-01',
  },
  {
    id: 'ach-3',
    title: 'First Technical Answer',
    titleKh: 'ចម្លើយបច្ចេកវិទ្យាដំបូង',
    description: 'Shared knowledge to solve a classmate’s development roadblock.',
    tier: 'BRONZE',
    points: 75,
    unlocked: true,
    icon: 'MessageSquare',
    dateUnlocked: '2026-03-02',
  },
  {
    id: 'ach-4',
    title: 'Lost Item Reporter',
    titleKh: 'អ្នករាយការណ៍សម្ភារៈបាត់បង់',
    description: 'Successfully submitted a detailed lost or found item report.',
    tier: 'SILVER',
    points: 100,
    unlocked: true,
    icon: 'Search',
    dateUnlocked: '2026-03-03',
  },
  {
    id: 'ach-5',
    title: 'Successful Recovery Hero',
    titleKh: 'វីរបុរសស្វែងរកសម្ភារៈជោគជ័យ',
    description: 'Directly helped an owner reunite with their verified belongings.',
    tier: 'GOLD',
    points: 300,
    unlocked: true,
    icon: 'Award',
    dateUnlocked: '2026-03-04',
  },
  {
    id: 'ach-6',
    title: 'Community Pillar',
    titleKh: 'សសរទ្រូងនៃសហគមន៍',
    description: 'Surpassed 1,000 total reputation score on the Nexa platform.',
    tier: 'DIAMOND',
    points: 500,
    unlocked: true,
    icon: 'Shield',
    dateUnlocked: '2026-03-04',
  },
  {
    id: 'ach-7',
    title: 'Smart Match Champion',
    titleKh: 'ជើងឯក Smart Match',
    description: 'Confirmed 5 successful AI-assisted item matches.',
    tier: 'GOLD',
    points: 250,
    unlocked: false,
    progress: 3,
    totalRequired: 5,
    icon: 'Zap',
  },
  {
    id: 'ach-8',
    title: 'Top Scholar',
    titleKh: 'និស្សិតឆ្នើមប្រចាំខែ',
    description: 'Ranked in the top 3 on the monthly community leaderboard.',
    tier: 'DIAMOND',
    points: 600,
    unlocked: false,
    progress: 1,
    totalRequired: 3,
    icon: 'Star',
  }
];

export const INITIAL_REPORTS = [
  {
    id: 'rep-601',
    targetType: 'QUESTION', // QUESTION, ANSWER, COMMENT, ITEM
    targetId: 'q-102',
    targetTitle: 'Best approach for handling JWT Refresh Tokens',
    reason: 'Duplicate Question / Potential Spam',
    reportedBy: INITIAL_USERS[1],
    status: 'PENDING', // PENDING, APPROVED, REJECTED
    createdAt: '2026-03-03T14:10:00Z',
    details: 'This seems very similar to the discussion posted last week in the security channel.',
  },
  {
    id: 'rep-602',
    targetType: 'ITEM',
    targetId: 'item-205',
    targetTitle: 'Hydro Flask 32oz Cobalt Water Bottle',
    reason: 'Wrong Location Tag',
    reportedBy: INITIAL_USERS[0],
    status: 'PENDING',
    createdAt: '2026-03-04T11:00:00Z',
    details: 'The item was originally spotted near cafeteria seating, not the discussion room.',
  }
];

export const INITIAL_ANALYTICS = {
  kpis: {
    totalUsers: 1420,
    activeUsers: 890,
    totalQuestions: 642,
    totalAnswers: 1530,
    totalLostReports: 310,
    totalFoundReports: 284,
    successfulRecoveries: 245,
    recoveryRate: 86.2,
    pendingModeration: 7,
  },
  userGrowth: [
    { month: 'Oct 2025', students: 320, faculty: 24 },
    { month: 'Nov 2025', students: 540, faculty: 38 },
    { month: 'Dec 2025', students: 780, faculty: 45 },
    { month: 'Jan 2026', students: 990, faculty: 56 },
    { month: 'Feb 2026', students: 1240, faculty: 72 },
    { month: 'Mar 2026', students: 1420, faculty: 85 },
  ],
  monthlyActivity: [
    { month: 'Oct', questions: 85, answers: 210, recovered: 32 },
    { month: 'Nov', questions: 110, answers: 290, recovered: 48 },
    { month: 'Dec', questions: 95, answers: 240, recovered: 40 },
    { month: 'Jan', questions: 130, answers: 340, recovered: 55 },
    { month: 'Feb', questions: 165, answers: 420, recovered: 68 },
    { month: 'Mar', questions: 180, answers: 460, recovered: 74 },
  ],
  categoryBreakdown: [
    { name: 'Web Dev', count: 210, percentage: 33 },
    { name: 'Mobile Dev', count: 145, percentage: 23 },
    { name: 'Spring Boot', count: 125, percentage: 19 },
    { name: 'Database', count: 90, percentage: 14 },
    { name: 'Campus Life', count: 72, percentage: 11 },
  ],
  itemRecoveryStats: [
    { type: 'Electronics', reported: 120, recovered: 104, rate: 86.6 },
    { type: 'Student IDs', reported: 95, recovered: 91, rate: 95.7 },
    { type: 'Keys & Remotes', reported: 68, recovered: 58, rate: 85.2 },
    { type: 'Accessories', reported: 55, recovered: 39, rate: 70.9 },
  ]
};
