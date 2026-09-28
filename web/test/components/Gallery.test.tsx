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
