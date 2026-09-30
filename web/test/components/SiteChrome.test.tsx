import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

import { SiteChrome } from '@/components/SiteChrome';

test('hides Nav and Footer chrome on the /studio route', () => {
  mockUsePathname.mockReturnValue('/studio');
  render(
    <SiteChrome settings={null}>
      <div>content</div>
    </SiteChrome>
  );
  expect(screen.queryByText('R.K. Constructions')).toBeNull();
  expect(screen.queryByRole('navigation', { name: /quick contact/i })).toBeNull();
  expect(screen.getByText('content')).toBeInTheDocument();
});

test('shows Nav, Footer, and the mobile action bar on marketing pages', () => {
  mockUsePathname.mockReturnValue('/');
  render(
    <SiteChrome settings={null}>
      <div>content</div>
    </SiteChrome>
  );
  expect(screen.getAllByText('R.K. Constructions').length).toBeGreaterThan(0);
  expect(screen.getByRole('navigation', { name: /quick contact/i })).toBeInTheDocument();
  expect(screen.getByText('content')).toBeInTheDocument();
});

test('wraps page content in a fade-in transition on every route', () => {
  mockUsePathname.mockReturnValue('/projects');
  const { container } = render(
    <SiteChrome settings={null}>
      <div>content</div>
    </SiteChrome>
  );
  const fadeWrap = container.querySelector('.page-fade');
  expect(fadeWrap).not.toBeNull();
  expect(fadeWrap).toHaveTextContent('content');
});
