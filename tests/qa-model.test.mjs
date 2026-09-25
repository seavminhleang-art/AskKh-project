import test from 'node:test';
import assert from 'node:assert/strict';
import { rowsOf, savedPosts, mapPost, errorMessage } from '../src/features/qa/model.js';

test('normalizes direct and paginated API collections', () => {
  const rows = [{ id: 5 }];
  assert.deepEqual(rowsOf(rows), rows);
  assert.deepEqual(rowsOf({ data: { content: rows } }), rows);
  assert.deepEqual(rowsOf(undefined), []);
});
test('extracts posts from the documented bookmark response', () => {
  const posts = [{ id: 7 }, { id: 9 }];
  assert.deepEqual(savedPosts({ id: 1, bookMarkList: posts }), posts);
  assert.deepEqual(savedPosts([{ id: 1, bookMarkList: posts }]), posts);
});
test('maps backend fields without fabricated counts or authors', () => {
  const post = mapPost({ id: 5, ownerId: 8, body: 'Question', score: 3, viewCount: 12, tagResponses: [{ tagName: 'Java' }], codeSnippet: 'int x = 1;', codeLanguage: 'java' }, '8');
  assert.equal(post.isOwnPost, true);
  assert.equal(post.likes, 3);
  assert.equal(post.views, 12);
  assert.equal(post.content, 'Question');
  assert.deepEqual(post.tags, ['Java']);
  assert.equal(post.codeSnippet, 'int x = 1;');
  assert.equal(mapPost({}, null).isOwnPost, false);
});
test('authentication and validation errors are actionable', () => {
  assert.match(errorMessage({ status: 401 }), /sign in/);
  assert.equal(errorMessage({ data: { message: 'Title is too short' } }), 'Title is too short');
});

test('existing post images use the public media URL instead of localhost', () => {
  assert.equal(mapPost({ imageUrls: ['http://localhost:8070/api/v1/photo.jpg'] }).image, 'https://forum-istad-api.cheat.casa/api/v1/media/photo.jpg');
  assert.equal(mapPost({ imageUrls: ['https://example.com/photo.jpg'] }).image, 'https://example.com/photo.jpg');
});
