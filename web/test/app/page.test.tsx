import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/lib/queries', () => ({
  getProjects: vi.fn().mockResolvedValue([]),
  getClients: vi.fn().mockResolvedValue([]),
  getServices: vi.fn().mockResolvedValue([]),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  getSiteSettings: vi.fn().mockResolvedValue(null),
}));

import Page from '@/app/page';

test('home page renders every section', async () => {
  const ui = await Page();
  render(ui);
  expect(screen.getAllByText(/R\.K\. Constructions/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  expect(screen.getByText(/Start a proposal/i)).toBeInTheDocument();
});
