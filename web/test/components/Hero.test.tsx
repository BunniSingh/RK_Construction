import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';

test('renders the headline and all four stats', () => {
  render(<Hero />);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent(/we build/i);
  expect(heading).toHaveTextContent(/the backbone of industry/i);
  expect(screen.getByText('Years in operation')).toBeInTheDocument();
  expect(screen.getByText('Annual project value')).toBeInTheDocument();
  expect(screen.getByText('Workforce on site')).toBeInTheDocument();
  expect(screen.getByText('Engineering staff')).toBeInTheDocument();
});
