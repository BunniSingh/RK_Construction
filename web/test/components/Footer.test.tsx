import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

import { Footer } from '@/components/Footer';

beforeEach(() => {
  mockUsePathname.mockReturnValue('/');
});

test('renders fallback contact details when siteSettings has not been created yet', () => {
  render(<Footer settings={null} />);
  expect(screen.getByText('+91 97524 50852')).toBeInTheDocument();
  expect(screen.getByText('raju2021rgh@gmail.com')).toBeInTheDocument();
  expect(screen.getByText(/Bhagwanpur/)).toBeInTheDocument();
});

test('renders contact details from siteSettings when provided', () => {
  render(
    <Footer
      settings={{ address: '123 Test Road', phone: '+91 99999 99999', email: 'test@example.com' }}
    />
  );
  expect(screen.getByText('+91 99999 99999')).toBeInTheDocument();
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
  expect(screen.getByText('123 Test Road')).toBeInTheDocument();
});

test('renders quick links using pathname-aware section hrefs', () => {
  mockUsePathname.mockReturnValue('/projects');
  render(<Footer settings={null} />);
  expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('href', '/#overview');
  expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/#contact');
});

test('links to the downloadable company profile PDF', () => {
  render(<Footer settings={null} />);
  const link = screen.getByRole('link', { name: /download company profile/i });
  expect(link).toHaveAttribute('href', '/rkc-company-profile.pdf');
});

test('shows the current year in the copyright line', () => {
  render(<Footer settings={null} />);
  const year = new Date().getFullYear().toString();
  expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
});
