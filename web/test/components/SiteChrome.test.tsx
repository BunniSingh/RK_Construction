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
    <SiteChrome>
      <div>content</div>
    </SiteChrome>
  );
  expect(screen.queryByText('R.K. Constructions')).toBeNull();
  expect(screen.getByText('content')).toBeInTheDocument();
});

test('shows Nav and Footer chrome on marketing pages', () => {
  mockUsePathname.mockReturnValue('/');
  render(
    <SiteChrome>
      <div>content</div>
    </SiteChrome>
  );
  expect(screen.getByText('R.K. Constructions')).toBeInTheDocument();
  expect(screen.getByText('content')).toBeInTheDocument();
});
