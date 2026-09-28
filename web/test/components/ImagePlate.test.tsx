import { render, screen, fireEvent } from '@testing-library/react';
import { ImagePlate } from '@/components/ImagePlate';

test('renders the real image when src is provided', () => {
  const { container } = render(<ImagePlate src="/photo.jpg" alt="Site photo" caption="P-01" />);
  const img = container.querySelector('img');
  expect(img?.getAttribute('src')).toContain('/photo.jpg');
});

test('renders the hatch placeholder when src is missing', () => {
  const { container } = render(<ImagePlate src={null} alt="Site photo placeholder" caption="Photo pending — P-02" />);
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('Photo pending — P-02')).toBeInTheDocument();
});

test('renders the hatch placeholder when src is an empty string', () => {
  const { container } = render(<ImagePlate src="" alt="Site photo placeholder" caption="Photo pending — P-03" />);
  expect(container.querySelector('img')).toBeNull();
});

test('falls back to the placeholder if the image fails to load (broken asset reference)', () => {
  const { container } = render(<ImagePlate src="/broken.jpg" alt="Site photo" caption="Photo pending — P-04" />);
  const img = container.querySelector('img')!;
  fireEvent.error(img);
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByText('Photo pending — P-04')).toBeInTheDocument();
});
