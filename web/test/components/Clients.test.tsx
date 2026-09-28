import { render, screen } from '@testing-library/react';
import { Clients } from '@/components/Clients';

test('renders each client name and location', () => {
  render(<Clients clients={[{ _id: '1', name: 'JSW Steel', location: 'Raigarh, CG' }]} />);
  expect(screen.getByText('JSW Steel')).toBeInTheDocument();
  expect(screen.getByText('Raigarh, CG')).toBeInTheDocument();
});
