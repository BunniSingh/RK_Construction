import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const { IMAGES } = vi.hoisted(() => ({
  IMAGES: Array.from({ length: 12 }, (_, i) => ({
    _id: String(i),
    image: {} as any,
    caption: `Photo ${i}`,
  })),
}));

vi.mock('@/lib/queries', () => ({
  getGalleryImages: vi.fn().mockResolvedValue(IMAGES),
}));

import GalleryPage from '@/app/gallery/page';

test('renders every photo with no "view all" overflow link (this IS the full gallery)', async () => {
  const ui = await GalleryPage();
  render(ui);
  expect(screen.getByText('Photo 0')).toBeInTheDocument();
  expect(screen.getByText('Photo 11')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /view all photos/i })).toBeNull();
});

test('links back to the home page', async () => {
  const ui = await GalleryPage();
  render(ui);
  expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/#gallery');
});
