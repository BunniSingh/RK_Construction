import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { PROJECTS, CLIENTS, SERVICES, ETP_FEATURED_PHOTO, ETP_GALLERY_FILES, MEDIA_DIR } from '../../scripts/seed';

test('every referenced media filename actually exists on disk', () => {
  expect(existsSync(resolve(MEDIA_DIR, ETP_FEATURED_PHOTO))).toBe(true);
  for (const { file } of ETP_GALLERY_FILES) {
    expect(existsSync(resolve(MEDIA_DIR, file))).toBe(true);
  }
});

test('seed data matches the spec counts (6 base projects + ETP = 7, 5 clients, 12 services)', () => {
  expect(PROJECTS).toHaveLength(6);
  expect(CLIENTS).toHaveLength(5);
  expect(SERVICES).toHaveLength(12);
  expect(ETP_GALLERY_FILES).toHaveLength(12);
});
