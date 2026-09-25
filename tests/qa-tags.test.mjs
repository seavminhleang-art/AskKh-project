import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeTag, matchingTags, resolveTag } from '../src/features/tags/tagModel.js';

test('normalizes hashtags while preserving Khmer and programming tag names', () => {
  assert.equal(normalizeTag(' #React JS '), 'react_js');
  assert.equal(normalizeTag('#ខ្មែរ'), 'ខ្មែរ');
  assert.equal(normalizeTag('#C++'), 'c++');
  assert.equal(normalizeTag('#C#'), 'c#');
});

test('suggestions prioritize prefix matches and usage', () => {
  const tags = [{ id: 1, tagName: 'preact', count: 20 }, { id: 2, tagName: 'react', count: 10 }, { id: 3, tagName: 'reactjs', count: 5 }];
  assert.deepEqual(matchingTags(tags, '#REA').map(tag => tag.id), [2, 3, 1]);
  assert.deepEqual(matchingTags(tags, 'python'), []);
});

test('reuses existing tags without creating duplicates', async () => {
  const tag = { id: 1, tagName: 'React' };
  assert.equal(await resolveTag('react', [tag], () => { throw new Error('Must not create'); }), tag);
});

test('creates a new tag and retains the returned ID', async () => {
  const tag = { id: 8, tagName: 'khmer' };
  const create = name => {
    assert.equal(name, 'khmer');
    return { unwrap: async () => tag };
  };
  assert.equal(await resolveTag('khmer', [], create), tag);
});

test('recovers a duplicate conflict by fetching the existing tag', async () => {
  const tag = { id: 8, tagName: 'React' };
  const create = () => ({ unwrap: async () => { throw { status: 409 }; } });
  assert.equal(await resolveTag('react', [], create, async () => [tag]), tag);
});

test('does not turn authorization failures or missing IDs into selected tags', async () => {
  const failure = { status: 403 };
  await assert.rejects(resolveTag('react', [], () => ({ unwrap: async () => { throw failure; } })), error => error === failure);
  await assert.rejects(resolveTag('react', [], () => ({ unwrap: async () => ({ tagName: 'react' }) })), /Invalid tag response/);
});
