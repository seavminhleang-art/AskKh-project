import { isAnswerPost } from "../../config/postTypes.js";
export function rankContributors(posts, period = 'all', now = new Date()) {
  const start = new Date(now);
  if (period === 'month') start.setDate(1);
  if (period === 'week') start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  start.setHours(0, 0, 0, 0);
  const included = item => {
    if (period === 'all') return true;
    const date = new Date(item.creationDate);
    return Number.isFinite(date.getTime()) && date >= start && date <= now;
  };
  const users = new Map();
  const getUser = (id, name) => {
    if (id == null) return null;
    if (!users.has(String(id))) users.set(String(id), { id, name: name || `User #${id}`, handle: `#${id}`, upvotes: 0, answers: 0, solutions: 0, helpful: 0, tags: new Map() });
    return users.get(String(id));
  };
  const score = value => Number.isFinite(value) ? value : 0;
  const seenComments = new Set();
  for (const post of posts) {
    if (!post || typeof post !== 'object') continue;
    if (included(post)) {
      const user = getUser(post.ownerId, post.ownerDisplayName);
      if (user) {
        user.upvotes += score(post.score);
        user.solutions++;
        if (isAnswerPost(post)) user.answers++;
        for (const tag of post.tagResponses || []) if (tag.tagName) user.tags.set(tag.tagName, (user.tags.get(tag.tagName) || 0) + 1);
      }
    }
    for (const comment of Array.isArray(post.comments) ? post.comments : []) {
      if (!comment || typeof comment !== 'object') continue;
      if (comment.id != null && seenComments.has(String(comment.id))) continue;
      if (comment.id != null) seenComments.add(String(comment.id));
      if (!included(comment)) continue;
      const user = getUser(comment.userId, comment.userDisplayName);
      if (user) { user.helpful++; user.upvotes += score(comment.score); }
    }
  }
  return [...users.values()].sort((a, b) => b.upvotes - a.upvotes || String(a.id).localeCompare(String(b.id), undefined, { numeric: true })).map((user, index, sorted) => ({
    ...user,
    rank: sorted.findIndex(other => other.upvotes === user.upvotes) + 1,
    points: user.upvotes,
    category: [...user.tags].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '—',
    tags: undefined,
  }));
}
