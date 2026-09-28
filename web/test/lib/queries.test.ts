import { describe, expect, test, vi } from 'vitest';

vi.mock('@/lib/sanity.client', () => ({
  sanityClient: { fetch: vi.fn() },
}));

import { sanityClient } from '@/lib/sanity.client';
import { getProjects, getSiteSettings } from '@/lib/queries';

describe('when the Sanity fetch itself fails (bad credentials, dataset not found, outage)', () => {
  test('getProjects falls back to an empty array instead of throwing', async () => {
    (sanityClient.fetch as any).mockRejectedValueOnce(new Error('Dataset not found'));
    await expect(getProjects()).resolves.toEqual([]);
  });

  test('getSiteSettings falls back to null instead of throwing', async () => {
    (sanityClient.fetch as any).mockRejectedValueOnce(new Error('Dataset not found'));
    await expect(getSiteSettings()).resolves.toBeNull();
  });
});

describe('getProjects', () => {
  test('returns the array Sanity provides', async () => {
    (sanityClient.fetch as any).mockResolvedValueOnce([{ title: 'ETP' }]);
    const result = await getProjects();
    expect(result).toEqual([{ title: 'ETP' }]);
  });

  test('returns an empty array when Sanity has no projects yet', async () => {
    (sanityClient.fetch as any).mockResolvedValueOnce(null);
    const result = await getProjects();
    expect(result).toEqual([]);
  });
});

describe('getSiteSettings', () => {
  test('returns null when the singleton has not been created yet', async () => {
    (sanityClient.fetch as any).mockResolvedValueOnce(null);
    const result = await getSiteSettings();
    expect(result).toBeNull();
  });
});
