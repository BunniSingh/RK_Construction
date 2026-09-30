import { vi } from 'vitest';

const { createMock, createIfNotExistsMock, uploadMock } = vi.hoisted(() => ({
  createMock: vi.fn().mockResolvedValue({}),
  createIfNotExistsMock: vi.fn().mockResolvedValue({}),
  uploadMock: vi.fn().mockResolvedValue({ _id: 'image-abc123def456abc123def456abc123def456abcd-800x600-jpg' }),
}));

vi.mock('next-sanity', () => ({
  createClient: () => ({
    create: createMock,
    createIfNotExists: createIfNotExistsMock,
    assets: { upload: uploadMock },
  }),
}));

import { seed } from '../../scripts/seed';

test('seed is idempotent: every document is written with createIfNotExists and a deterministic _id, never the non-idempotent create()', async () => {
  await seed();

  expect(createMock).not.toHaveBeenCalled();
  expect(createIfNotExistsMock).toHaveBeenCalled();

  const ids: string[] = createIfNotExistsMock.mock.calls.map((call: any[]) => call[0]._id);
  expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
});

test('re-running seed writes the exact same set of document ids (safe to re-run)', async () => {
  createIfNotExistsMock.mockClear();
  await seed();
  const firstRunIds: string[] = createIfNotExistsMock.mock.calls.map((call: any[]) => call[0]._id).sort();

  createIfNotExistsMock.mockClear();
  await seed();
  const secondRunIds: string[] = createIfNotExistsMock.mock.calls.map((call: any[]) => call[0]._id).sort();

  expect(secondRunIds).toEqual(firstRunIds);
});
