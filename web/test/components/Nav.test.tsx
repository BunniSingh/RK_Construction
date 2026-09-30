import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

import { Nav } from '@/components/Nav';

beforeEach(() => {
  mockUsePathname.mockReturnValue('/');
});

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

test('uses same-page anchors when already on the home page', () => {
  mockUsePathname.mockReturnValue('/');
  render(<Nav />);
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '#overview');
  expect(screen.getByRole('link', { name: 'Site Gallery' })).toHaveAttribute('href', '#gallery');
  expect(screen.getByRole('link', { name: 'Request a Proposal' })).toHaveAttribute('href', '#contact');
});

test('links back to the home page sections when on a different page', () => {
  mockUsePathname.mockReturnValue('/projects');
  render(<Nav />);
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/#overview');
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects');
  expect(screen.getByRole('link', { name: 'Site Gallery' })).toHaveAttribute('href', '/#gallery');
  expect(screen.getByRole('link', { name: 'Request a Proposal' })).toHaveAttribute('href', '/#contact');
});
