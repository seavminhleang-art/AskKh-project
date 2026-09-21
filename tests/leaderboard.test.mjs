import test from 'node:test';
import assert from 'node:assert/strict';
import { rankContributors } from '../src/features/leaderboard/rankings.js';

test('ranks actual scores, counts answers/comments and does not invent winners', () => {
  assert.deepEqual(rankContributors([]), []);
  const comment = { id: 5, userId: 2, userDisplayName: 'B', score: 4 };
  const rows = rankContributors([
    { ownerId: 1, ownerDisplayName: 'A', score: 2, postTypeId: 2, comments: [comment] },
    { ownerId: 1, score: -1, comments: [comment] },
    { score: 100 },
  ]);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].id, 2);
  assert.equal(rows[0].points, 4);
  assert.equal(rows[0].helpful, 1);
  assert.equal(rows[1].points, 1);
  assert.equal(rows[1].answers, 1);
  assert.equal(rows[1].solutions, 2);
});
test('recent comments on older posts count in the selected period', () => {
  const rows = rankContributors([{ ownerId: 1, score: 10, creationDate: '2025-01-01', comments: [{ id: 3, userId: 2, score: 2, creationDate: '2026-09-16T12:00:00' }] }], 'week', new Date('2026-09-20T12:00:00'));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, 2);
});
test('equal scores share ranks and top tag follows actual posts', () => {
  const rows = rankContributors([{ ownerId: 2, score: 3, tagResponses: [{ tagName: 'React' }] }, { ownerId: 1, score: 3 }, { ownerId: 3, score: 1 }]);
  assert.deepEqual(rows.map(row => row.rank), [1, 1, 3]);
  assert.equal(rows.find(row => row.id === 2).category, 'React');
});
