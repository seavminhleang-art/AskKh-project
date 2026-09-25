import test from 'node:test';
import assert from 'node:assert/strict';
import { uploadQuestionImages } from '../src/features/qa/uploadQuestionImages.js';

const unused = () => { throw new Error('Unexpected upload'); };
const photo = () => new File(['image'], 'photo.png', { type: 'image/png' });

test('questions without images skip uploading', async () => {
  assert.deepEqual(await uploadQuestionImages([], unused, unused), []);
});

test('single image uses file and reads the media uri', async () => {
  const upload = form => {
    assert.deepEqual([...form.keys()], ['file']);
    assert.equal(form.get('file').name, 'photo.png');
    return { unwrap: async () => ({ uri: 'https://example.com/photo.png' }) };
  };
  assert.deepEqual(await uploadQuestionImages([photo()], upload, unused), ['https://example.com/photo.png']);
});

test('multiple images use repeated files and preserve returned URLs', async () => {
  const urls = ['https://example.com/1.png', 'https://example.com/2.png'];
  const upload = form => {
    assert.deepEqual([...form.keys()], ['files', 'files']);
    return { unwrap: async () => urls.map(uri => ({ uri })) };
  };
  assert.deepEqual(await uploadQuestionImages([photo(), photo()], unused, upload), urls);
});

test('failed or incomplete uploads stop question creation', async () => {
  const failed = () => ({ unwrap: async () => { throw new Error('Upload failed'); } });
  await assert.rejects(uploadQuestionImages([photo()], failed, unused), /Upload failed/);
  for (const response of [null, {}, { uri: 'invalid' }]) {
    await assert.rejects(uploadQuestionImages([photo()], () => ({ unwrap: async () => response }), unused), /valid image URLs/);
  }
  await assert.rejects(uploadQuestionImages([photo(), photo()], unused, () => ({ unwrap: async () => [{ uri: 'https://example.com/1.png' }] })), /valid image URLs/);
});

test('normalizes localhost media responses before saving a post', async () => {
  const upload = () => ({ unwrap: async () => ({ uri: 'http://localhost:8070/api/v1/photo.jpg' }) });
  assert.deepEqual(await uploadQuestionImages([photo()], upload, unused), ['https://forum-istad-api.cheat.casa/api/v1/media/photo.jpg']);
});
