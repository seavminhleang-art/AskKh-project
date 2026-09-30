const PREFIX = 'askkh:qa-viewed:';
const viewedThisSession = new Set();

// Local views describe this browser only, not a total from other visitors.
export function hasLocalView(postId, storage) {
  const key = `${PREFIX}${postId}`;
  if (viewedThisSession.has(key)) return true;
  try {
    return (storage ?? globalThis.localStorage)?.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function recordLocalView(postId, storage) {
  if (postId == null) return;
  const key = `${PREFIX}${postId}`;
  viewedThisSession.add(key);
  try {
    (storage ?? globalThis.localStorage)?.setItem(key, '1');
  } catch {
    // Keep repeat clicks stable for this session when storage is unavailable.
  }
}
