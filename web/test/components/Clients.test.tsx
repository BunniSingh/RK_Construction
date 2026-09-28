import { render, screen } from '@testing-library/react';
import { Clients } from '@/components/Clients';

test('renders each client name and location', () => {
  render(<Clients clients={[{ _id: '1', name: 'JSW Steel', location: 'Raigarh, CG' }]} />);
  expect(screen.getByText('JSW Steel')).toBeInTheDocument();
  expect(screen.getByText('Raigarh, CG')).toBeInTheDocument();
});

test('does not render a logo image when the client has none', () => {
  const { container } = render(<Clients clients={[{ _id: '1', name: 'JSW Steel', location: 'Raigarh, CG' }]} />);
  expect(container.querySelector('img')).toBeNull();
});

test('renders the uploaded logo when the client has one', () => {
  const logo = {
    _type: 'image',
    asset: { _type: 'reference', _ref: 'image-abc123def456abc123def456abc123def456abcd-800x600-jpg' },
  } as any;
  const { container } = render(
    <Clients clients={[{ _id: '1', name: 'JSW Steel', location: 'Raigarh, CG', logo }]} />
  );
  const img = container.querySelector('img');
  expect(img).not.toBeNull();
  expect(img).toHaveAttribute('alt', 'JSW Steel logo');
});
