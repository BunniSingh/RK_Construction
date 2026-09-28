import { render, screen } from '@testing-library/react';
import { Projects } from '@/components/Projects';

test('renders a section heading and sub-heading paragraph above the projects grid', () => {
  render(<Projects projects={[]} />);
  expect(screen.getByRole('heading', { name: "Work that speaks for itself." })).toBeInTheDocument();
  expect(
    screen.getByText(/A selection of completed and ongoing industrial builds/)
  ).toBeInTheDocument();
});
