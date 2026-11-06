import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatBookmark,
  generateSlug,
  loadBookmarks,
  normalizeUrl,
} from '../src/lib/bookmarks.js';

test('normalizes a URL with or without https:// to the same value', () => {
  assert.equal(
    normalizeUrl('www.example.com/article'),
    normalizeUrl('https://www.example.com/article'),
  );
});

test('recovers empty, corrupted, legacy, and non-array storage values', () => {
  for (const value of [
    null,
    '',
    '{broken json',
    '"legacy value"',
    '["https://old.example.com"]',
    '{"url":"https://example.com"}',
  ]) {
    assert.doesNotThrow(() => loadBookmarks(value));
    assert.deepEqual(loadBookmarks(value), []);
  }
});

test('drops malformed objects from bookmark storage', () => {
  const saved = loadBookmarks(JSON.stringify([
    { url: 'https://example.com/', slug: 'mona-7fk2' },
    { url: 'javascript:alert(1)', slug: 'mona-1234' },
    { url: 'https://example.com/', slug: 'legacy-slug' },
    null,
  ]));

  assert.deepEqual(saved, [{ url: 'https://example.com/', slug: 'mona-7fk2' }]);
});

test('formats a bookmark with the exact visible separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});

test('generates a four-character base62 slug with the mona- prefix', () => {
  assert.equal(generateSlug(() => 0.5), 'mona-vvvv');
});
