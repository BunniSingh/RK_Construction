import { sectionHref } from '@/lib/sectionHref';

test('returns a same-page anchor when already on the home page', () => {
  expect(sectionHref('/', 'projects')).toBe('#projects');
});

test('returns a home-page anchor when on any other page', () => {
  expect(sectionHref('/projects', 'contact')).toBe('/#contact');
  expect(sectionHref('/gallery', 'overview')).toBe('/#overview');
});
