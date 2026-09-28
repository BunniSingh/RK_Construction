import { render, screen } from '@testing-library/react';
import { Nav } from '@/components/Nav';

test('renders the brand name and primary nav links', () => {
  render(<Nav />);
  expect(screen.getByText('R.K. Constructions')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
});

test('adds the js class to the document root on mount', () => {
  document.documentElement.classList.remove('js');
  render(<Nav />);
  expect(document.documentElement.classList.contains('js')).toBe(true);
});
