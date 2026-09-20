export function rowsOf(value) {
  const data = value?.data ?? value;
  if (Array.isArray(data)) return data;
  return data?.content ?? data?.items ?? data?.results ?? [];
}
export function savedPosts(value) {
  const data = value?.data ?? value;
  return data?.bookMarkList ?? rowsOf(data).flatMap(item => item.bookMarkList ?? [item.post ?? item]);
}
export function errorMessage(error) {
  if (error?.status === 401) return 'Please sign in to continue.';
  if (error?.status === 403) return 'Your account does not have permission for this action.';
  return error?.data?.message || error?.message || 'The request failed. Please try again.';
}
export function mapPost(post, userId) {
  const date = new Date(post.creationDate ?? post.createdAt);
  return { ...post, content: post.body ?? '', tags: (post.tagResponses ?? []).map(tag => tag.tagName),
    author: { name: post.ownerDisplayName || 'Community member', avatar: post.ownerAvatarUrl, time: Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString() },
    views: post.viewCount ?? 0, likes: post.score ?? 0, comments: post.comments ?? [], image: post.imageUrls?.[0],
    isOwnPost: userId != null && String(post.ownerId) === String(userId) };
}
