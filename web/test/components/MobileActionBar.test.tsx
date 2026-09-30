import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

const mockUsePathname = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

import { MobileActionBar } from '@/components/MobileActionBar';

beforeEach(() => {
  mockUsePathname.mockReturnValue('/');
});

test('renders a call link using the fallback phone number when settings has none', () => {
  render(<MobileActionBar settings={null} />);
  expect(screen.getByRole('link', { name: /call/i })).toHaveAttribute('href', 'tel:+919752450852');
});

test('renders a whatsapp link built from the phone number in settings', () => {
  render(<MobileActionBar settings={{ phone: '+91 99999 88888' }} />);
  expect(screen.getByRole('link', { name: /whatsapp/i })).toHaveAttribute('href', 'https://wa.me/919999988888');
});

test('links the proposal button to the pathname-aware contact section', () => {
  mockUsePathname.mockReturnValue('/projects');
  render(<MobileActionBar settings={null} />);
  expect(screen.getByRole('link', { name: /proposal/i })).toHaveAttribute('href', '/#contact');
});

test('proposal button links to a same-page anchor on the home page', () => {
  mockUsePathname.mockReturnValue('/');
  render(<MobileActionBar settings={null} />);
  expect(screen.getByRole('link', { name: /proposal/i })).toHaveAttribute('href', '#contact');
});
