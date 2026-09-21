import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const english = JSON.parse(readFileSync(new URL('../src/locales/workspace/en.json', import.meta.url)));
const khmer = JSON.parse(readFileSync(new URL('../src/locales/workspace/km.json', import.meta.url)));
test('English and Khmer workspace dictionaries have matching keys and interpolation values', () => {
  assert.deepEqual(Object.keys(english).sort(), Object.keys(khmer).sort());
  for (const [key, value] of Object.entries(english)) {
    assert.ok(khmer[key].trim(), `Missing Khmer text: ${key}`);
    const tokens = text => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map(match => match[1]).sort();
    assert.deepEqual(tokens(value), tokens(khmer[key]), `Mismatched values: ${key}`);
  }
});
test('both workspaces include translated navigation and permission feedback', () => {
  for (const key of ['Dashboard', 'My Activity', 'User Management', 'Moderation', 'Settings', 'Save changes', 'Your account does not have permission for this action.']) {
    assert.match(khmer[key], /[\u1780-\u17ff]/);
  }
});
