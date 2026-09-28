import { render, screen } from '@testing-library/react';
import { CoreValues } from '@/components/CoreValues';

test('renders a section heading and sub-heading paragraph above the values list', () => {
  render(<CoreValues />);
  expect(screen.getByRole('heading', { name: 'The standards we build to.' })).toBeInTheDocument();
  expect(
    screen.getByText(/Four principles that govern how our teams operate on every site/)
  ).toBeInTheDocument();
});
