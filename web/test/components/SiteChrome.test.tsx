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
  expect(screen.getByText('content')).toBeInTheDocument();
});

test('shows Nav and Footer chrome on marketing pages', () => {
  mockUsePathname.mockReturnValue('/');
  render(
    <SiteChrome settings={null}>
      <div>content</div>
    </SiteChrome>
  );
  expect(screen.getAllByText('R.K. Constructions').length).toBeGreaterThan(0);
  expect(screen.getByText('content')).toBeInTheDocument();
});
