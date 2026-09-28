import { render, screen } from '@testing-library/react';
import { SkeletonGrid } from '@/components/SkeletonGrid';

test('renders the requested number of project skeleton cards', () => {
  const { container } = render(<SkeletonGrid variant="proj" count={4} />);
  expect(container.querySelectorAll('.proj-card').length).toBe(4);
});

test('renders the requested number of gallery skeleton tiles', () => {
  const { container } = render(<SkeletonGrid variant="gal" count={5} />);
  expect(container.querySelectorAll('.skel-photo').length).toBe(5);
});

test('defaults to 6 items when no count is given', () => {
  render(<SkeletonGrid variant="proj" />);
  expect(screen.getByTestId('skeleton-grid').children.length).toBe(6);
});
