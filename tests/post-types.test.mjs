import test from 'node:test';
import assert from 'node:assert/strict';
import { QUESTION_POST_TYPE_ID, ANSWER_POST_TYPE_ID, isQuestionPost, isAnswerPost } from '../src/config/postTypes.js';

test('creation defaults use the type observed in the current backend', () => {
  assert.equal(QUESTION_POST_TYPE_ID, 3);
  assert.equal(ANSWER_POST_TYPE_ID, 3);
});
test('shared type distinguishes top-level questions from replies by parentId', () => {
  assert.equal(isQuestionPost({ postTypeId: 3, parentId: null }), true);
  assert.equal(isAnswerPost({ postTypeId: 3, parentId: 7 }), true);
  assert.equal(isQuestionPost({ postTypeId: 3, parentId: 7 }), false);
  assert.equal(isAnswerPost({ postTypeId: 3, parentId: null }), false);
});
test('legacy records stay recognized without treating unrelated types as questions', () => {
  assert.equal(isQuestionPost({ postTypeId: 1 }), true);
  assert.equal(isAnswerPost({ postTypeId: 2 }), true);
  assert.equal(isQuestionPost({ postTypeId: 1, parentId: 7 }), false);
  assert.equal(isQuestionPost({ postTypeId: 9 }), false);
});
