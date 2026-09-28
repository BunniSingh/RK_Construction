import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';

test('renders the headline and all four stats', () => {
  render(<Hero />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/steel/i);
  expect(screen.getByText('Years in operation')).toBeInTheDocument();
  expect(screen.getByText('Annual project value')).toBeInTheDocument();
  expect(screen.getByText('Workforce on site')).toBeInTheDocument();
  expect(screen.getByText('Engineering staff')).toBeInTheDocument();
});
