import { render, screen } from '@testing-library/react';
import { Services } from '@/components/Services';

test('renders each service name', () => {
  render(<Services services={[{ _id: '1', name: 'Sinter Plant Construction', order: 0 }]} />);
  expect(screen.getByText('Sinter Plant Construction')).toBeInTheDocument();
});

test('shows a content-pending message when there are no services yet', () => {
  render(<Services services={[]} />);
  expect(screen.getByText(/service list is being updated/i)).toBeInTheDocument();
});
