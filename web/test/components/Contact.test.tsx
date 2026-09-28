import { render, screen } from '@testing-library/react';
import { Contact } from '@/components/Contact';

test('renders a heading and sub-heading paragraph above the contact details and form', () => {
  render(<Contact settings={null} />);
  expect(screen.getByRole('heading', { name: 'Start a proposal.' })).toBeInTheDocument();
  expect(
    screen.getByText(/Share your project details and our team will respond/)
  ).toBeInTheDocument();
});
