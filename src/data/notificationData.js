/**
 * Realistic Static Sample Data for Notifications Page
 * STRICT SPECIFICATION: Notifications are ONLY for claim-match events.
 * No notifications for Q&A, answers, comments, edits, or general activity.
 */

export const sampleNotifications = [
  {
    id: 'n-1',
    title: 'Your claim has been matched',
    description: 'A verified match was found for your claimed item "Sony WH-1000XM4 Wireless Headphones" in Campus Library.',
    time: '2 hours ago',
    date: 'Today',
    isRead: false,
    type: 'claim-match',
    link: '/lost-found/claims',
    matchScore: '95%',
    claimId: 'claim-1',
  },
  {
    id: 'n-2',
    title: 'Claim match found',
    description: 'A newly logged found item in ISTAD Cafeteria matches your submitted claim for "Brown Leather Bi-fold Wallet".',
    time: '5 hours ago',
    date: 'Today',
    isRead: false,
    type: 'claim-match',
    link: '/lost-found/claims',
    matchScore: '88%',
    claimId: 'claim-2',
  },
  {
    id: 'n-3',
    title: 'Claim verification approved',
    description: 'Your ownership claim for "AirPods Pro Case" has been verified and confirmed ready for physical collection.',
    time: 'Yesterday',
    date: 'Sep 9, 2026',
    isRead: true,
    type: 'claim-match',
    link: '/lost-found/claims',
    matchScore: 'Confirmed',
    claimId: 'claim-3',
  },
];
