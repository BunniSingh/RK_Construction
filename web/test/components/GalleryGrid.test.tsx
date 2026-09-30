import { render, screen } from '@testing-library/react';
import { GalleryGrid } from '@/components/GalleryGrid';

function makeImages(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    _id: String(i),
    image: {} as any,
    caption: `Photo ${i}`,
  }));
}

test('renders every image when there is no limit', () => {
  render(<GalleryGrid images={makeImages(3)} />);
  expect(screen.getByText('Photo 0')).toBeInTheDocument();
  expect(screen.getByText('Photo 2')).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /view all photos/i })).toBeNull();
});

test('renders only the first `limit` images and a "view all" link when there are more', () => {
  render(<GalleryGrid images={makeImages(12)} limit={6} moreHref="/gallery" />);
  expect(screen.getByText('Photo 0')).toBeInTheDocument();
  expect(screen.getByText('Photo 5')).toBeInTheDocument();
  expect(screen.queryByText('Photo 6')).toBeNull();
  const link = screen.getByRole('link', { name: /view all photos/i });
  expect(link).toHaveAttribute('href', '/gallery');
});

test('does not show a "view all" link when the count is within the limit', () => {
  render(<GalleryGrid images={makeImages(4)} limit={6} moreHref="/gallery" />);
  expect(screen.queryByRole('link', { name: /view all photos/i })).toBeNull();
});
