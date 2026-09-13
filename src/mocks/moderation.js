export const mockModerationStats = [
  { key: 'pending', title: 'Pending Review', value: 4 },
  { key: 'flagged', title: 'Flagged Content', value: 143 },
  { key: 'resolutionRate', title: 'Resolution Rate', value: '98.2%' },
]

export const mockModerationQueue = [
  { id: 'm1', content: 'This post violates the community guidelines?', author: 'Sopheak Ros', reason: 'Spam / self-promotion', severity: 'High', status: 'Pending', date: '2026-09-08' },
  { id: 'm2', content: 'Comment reported for inappropriate language', author: 'Piseth Ouk', reason: 'Inappropriate language', severity: 'Medium', status: 'Pending', date: '2026-09-07' },
  { id: 'm3', content: 'Duplicate marketplace listing', author: 'Vanna Ly', reason: 'Duplicate content', severity: 'Low', status: 'Resolved', date: '2026-09-05' },
]