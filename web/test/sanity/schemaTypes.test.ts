import { schemaTypes } from '../../sanity/schemaTypes';

test('exports exactly the five expected document types', () => {
  const names = schemaTypes.map((t) => t.name).sort();
  expect(names).toEqual(['client', 'galleryImage', 'project', 'service', 'siteSettings']);
});

test('siteSettings is a singleton-shaped document (no title needed for listing)', () => {
  const siteSettings = schemaTypes.find((t) => t.name === 'siteSettings')!;
  expect(siteSettings.type).toBe('document');
});
