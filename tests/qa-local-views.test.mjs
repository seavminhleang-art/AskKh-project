import test from 'node:test';
import assert from 'node:assert/strict';
import { hasLocalView, recordLocalView } from '../src/features/qa/localViews.js';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('opening the same question repeatedly records one browser view', () => {
  const saved = storage();
  assert.equal(hasLocalView('repeat', saved), false);
  recordLocalView('repeat', saved);
  recordLocalView('repeat', saved);
  assert.equal(hasLocalView('repeat', saved), true);
  assert.equal(saved.getItem('askkh:qa-viewed:repeat'), '1');
  assert.equal(hasLocalView('unopened', saved), false);
});

test('a fresh module after refresh restores the saved view', async () => {
  const saved = storage();
  recordLocalView(987, saved);
  const reloaded = await import('../src/features/qa/localViews.js?reload');
  assert.equal(reloaded.hasLocalView('987', saved), true);
  reloaded.recordLocalView('987', saved);
  assert.equal(saved.getItem('askkh:qa-viewed:987'), '1');
});

test('blocked storage does not break opening a question', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  assert.equal(hasLocalView('blocked', blocked), false);
  recordLocalView('blocked', blocked);
  assert.equal(hasLocalView('blocked', blocked), true);
});
