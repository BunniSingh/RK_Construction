import { urlFor } from '@/lib/sanity.image';

test('returns null for a missing image source', () => {
  expect(urlFor(null)).toBeNull();
  expect(urlFor(undefined)).toBeNull();
});

test('returns null instead of throwing for a malformed/incomplete image reference', () => {
  expect(() => urlFor({} as any)).not.toThrow();
  expect(urlFor({} as any)).toBeNull();
});
