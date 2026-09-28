import { render, screen } from '@testing-library/react';
import { Gallery } from '@/components/Gallery';

test('renders a caption for each gallery image', () => {
  render(
    <Gallery
      images={[
        { _id: '1', image: {} as any, caption: 'ETP aerial view — Raigarh' },
        { _id: '2', image: {} as any, caption: 'Tank formwork — ETP site' },
      ]}
    />
  );
  expect(screen.getByText('ETP aerial view — Raigarh')).toBeInTheDocument();
  expect(screen.getByText('Tank formwork — ETP site')).toBeInTheDocument();
});

test('renders a section heading and sub-heading paragraph above the gallery grid', () => {
  render(<Gallery images={[]} />);
  expect(screen.getByRole('heading', { name: 'Inside an active site.' })).toBeInTheDocument();
  expect(screen.getByText(/Real photographs from our ongoing ETP and industrial works/)).toBeInTheDocument();
});
