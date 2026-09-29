import { isAnswerPost } from "../../config/postTypes.js";
export function rankContributors(posts, period = 'all', now = new Date(), reports = []) {
  const start = new Date(now);
  if (period === 'month') start.setDate(1);
  if (period === 'week') start.setDate(start.getDate() - (start.getDay() + 6) % 7);
  start.setHours(0, 0, 0, 0);
  const included = item => {
    if (period === 'all') return true;
    const date = new Date(item.creationDate ?? item.createdAt ?? item.itemDate);
    return Number.isFinite(date.getTime()) && date >= start && date <= now;
  };
  const users = new Map();
  const getUser = (id, name) => {
    if (id == null) return null;
    if (!users.has(String(id))) users.set(String(id), { id, name: name || `User #${id}`, handle: `#${id}`, upvotes: 0, answers: 0, solutions: 0, helpful: 0, tags: new Map() });
    return users.get(String(id));
  };
  const score = value => {
    const numericValue = Number(value ?? 0);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };
  for (const post of posts) {
    if (!post || typeof post !== 'object' || !included(post)) continue;
    const user = getUser(post.ownerId, post.ownerDisplayName);
    if (!user) continue;
    // Use the same score fields as the Q&A cards, including numeric strings.
    // A post with one upvote therefore contributes exactly one leaderboard point.
    user.upvotes += score(
      post.score ?? post.likeCount ?? post.likes ?? post.upVotes ?? post.upvotes,
    );
    user.solutions++;
    if (isAnswerPost(post)) user.answers++;
    for (const tag of post.tagResponses || []) if (tag.tagName) user.tags.set(tag.tagName, (user.tags.get(tag.tagName) || 0) + 1);
  }

  // Lost-and-found reports can also carry vote totals from the votes API.
  // Add those to the reporter's score so report likes rank the right author.
  for (const report of reports) {
    if (!report || typeof report !== 'object' || !included(report)) continue;
    const reporterId = report.userId ?? report.reporterUserId ?? report.ownerId;
    const user = getUser(reporterId, report.reporterName || report.ownerDisplayName);
    if (!user) continue;
    user.upvotes += score(Number(
      report.likeCount ?? report.likes ?? report.upVotes ?? report.upvotes ?? report.score ?? 0,
    ));
  }

  // Include comment scores in the contributor's points, matching the
  // leaderboard's "post score + comment score" description.
  const seenComments = new Set();
  for (const post of posts) {
    if (!post || typeof post !== 'object') continue;
    for (const comment of Array.isArray(post.comments) ? post.comments : []) {
      if (!comment || typeof comment !== 'object') continue;
      if (comment.id != null && seenComments.has(String(comment.id))) continue;
      if (comment.id != null) seenComments.add(String(comment.id));
      if (!included(comment)) continue;
      const user = getUser(comment.userId, comment.userDisplayName || comment.username);
      if (!user) continue;
      user.upvotes += score(comment.score);
      user.helpful++;
    }
  }

  return [...users.values()].sort((a, b) =>
    b.upvotes - a.upvotes ||
    b.answers - a.answers ||
    b.solutions - a.solutions ||
    b.helpful - a.helpful ||
    String(a.id).localeCompare(String(b.id), undefined, { numeric: true }),
  ).map((user, index) => ({
    ...user,
    rank: index + 1,
    points: user.upvotes,
    category: [...user.tags].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '—',
    tags: undefined,
  }));
}
