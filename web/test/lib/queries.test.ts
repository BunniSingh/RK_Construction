import { describe, expect, test, vi } from 'vitest';

vi.mock('@/lib/sanity.client', () => ({
  sanityClient: { fetch: vi.fn() },
}));

import { sanityClient } from '@/lib/sanity.client';
import { getProjects, getSiteSettings } from '@/lib/queries';

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
