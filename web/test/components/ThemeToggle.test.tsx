import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/ThemeToggle';

test('clicking the toggle switches the theme attribute', async () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  render(<ThemeToggle />);
  const button = screen.getByRole('button', { name: /toggle dark mode/i });
  await userEvent.click(button);
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});
