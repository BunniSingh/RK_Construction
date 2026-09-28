import { urlFor } from '@/lib/sanity.image';

test('returns null for a missing image source', () => {
  expect(urlFor(null)).toBeNull();
  expect(urlFor(undefined)).toBeNull();
});

test('returns null instead of throwing for a malformed/incomplete image reference', () => {
  expect(() => urlFor({} as any)).not.toThrow();
  expect(urlFor({} as any)).toBeNull();
});

const VALID_SOURCE = {
  _type: 'image',
  asset: { _type: 'reference', _ref: 'image-abc123def456abc123def456abc123def456abcd-800x600-jpg' },
} as any;

test('requests the given width instead of the full-resolution original', () => {
  const url = urlFor(VALID_SOURCE, 400);
  expect(url).toContain('w=400');
});

test('defaults to a bounded width when none is given, never the unsized original', () => {
  const url = urlFor(VALID_SOURCE);
  expect(url).toMatch(/[?&]w=\d+/);
});
