import test from 'node:test';
import assert from 'node:assert/strict';
import { notificationTarget } from '../src/features/notifications/notificationTarget.js';
globalThis.window = { location: { origin: 'https://askkh.example' } };

test('comment notification API links open the post comments', () => {
  for (const targetUrl of ['/posts/42', '/api/v1/posts/42', 'https://backend.example/api/v1/posts/42']) {
    assert.equal(notificationTarget({ type: 'COMMENT_ON_POST', targetUrl }), '/dashboard/questions/42#comments');
  }
});
test('public and workspace question links open the complete comment thread', () => {
  for (const targetUrl of ['/questions/42/title', '/dashboard/questions/42']) {
    assert.equal(notificationTarget({ type: 'COMMENT_ON_POST', targetUrl }), '/dashboard/questions/42#comments');
  }
});
test('fallback uses explicit post ID before generic target ID', () => {
  assert.equal(notificationTarget({ type: 'COMMENT_ON_POST', postId: 42, targetId: 99 }), '/dashboard/questions/42#comments');
  assert.equal(notificationTarget({ type: 'COMMENT_ON_POST' }), '/dashboard/questions');
});
test('vote and other notification routes remain valid', () => {
  assert.equal(notificationTarget({ type: 'POST_VOTE', targetUrl: '/posts/42' }), '/dashboard/questions/42');
  assert.equal(notificationTarget({ type: 'LOST_FOUND_MATCH' }), '/dashboard/matches');
  assert.equal(notificationTarget({ targetUrl: 'javascript:alert(1)' }), '/dashboard/notifications');
});
