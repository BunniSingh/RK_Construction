import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

test('does not show the placeholder caption once a real photo is showing', () => {
  render(<ImagePlate src="/photo.jpg" alt="Site photo" caption="Photo pending — P-05" />);
  expect(screen.queryByText('Photo pending — P-05')).toBeNull();
});

test('shows a real caption over the real photo when photoCaption is provided', () => {
  render(<ImagePlate src="/photo.jpg" alt="Site photo" caption="Photo pending — X" photoCaption="Rebar & footing work — ETP site" />);
  expect(screen.getByText('Rebar & footing work — ETP site')).toBeInTheDocument();
  expect(screen.queryByText('Photo pending — X')).toBeNull();
});

test('shows a loading skeleton until the photo finishes loading', async () => {
  const { container } = render(<ImagePlate src="/photo.jpg" alt="Site photo" caption="P-06" />);
  expect(container.querySelector('.plate--photo')).not.toHaveClass('is-loaded');
  const img = container.querySelector('img')!;
  fireEvent.load(img);
  await waitFor(() => expect(container.querySelector('.plate--photo')).toHaveClass('is-loaded'));
});
