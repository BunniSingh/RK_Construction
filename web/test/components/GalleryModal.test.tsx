import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GalleryModal } from '@/components/GalleryModal';

const IMAGE = {
  _id: '1',
  image: {} as any,
  caption: 'ETP commissioning — Phase 2',
};

test('renders the photo caption inside a dialog', () => {
  render(<GalleryModal image={IMAGE} onClose={() => {}} />);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('ETP commissioning — Phase 2')).toBeInTheDocument();
});

test('calls onClose when the close button is clicked', async () => {
  const onClose = vi.fn();
  render(<GalleryModal image={IMAGE} onClose={onClose} />);
  await userEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when the backdrop (outside the dialog content) is clicked', async () => {
  const onClose = vi.fn();
  render(<GalleryModal image={IMAGE} onClose={onClose} />);
  const backdrop = document.querySelector('.modal-backdrop')!;
  await userEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('does not call onClose when clicking inside the dialog content', async () => {
  const onClose = vi.fn();
  render(<GalleryModal image={IMAGE} onClose={onClose} />);
  await userEvent.click(screen.getByText('ETP commissioning — Phase 2'));
  expect(onClose).not.toHaveBeenCalled();
});

test('calls onClose when Escape is pressed', async () => {
  const onClose = vi.fn();
  render(<GalleryModal image={IMAGE} onClose={onClose} />);
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('renders into document.body via a portal so no ancestor can trap its z-index', () => {
  const { container } = render(<GalleryModal image={IMAGE} onClose={() => {}} />);
  expect(container.querySelector('.modal-backdrop')).toBeNull();
  expect(document.body.querySelector('.modal-backdrop')).not.toBeNull();
});

test('locks page scroll while open and restores it when closed', () => {
  document.body.style.overflow = 'auto';
  const { unmount } = render(<GalleryModal image={IMAGE} onClose={() => {}} />);
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('auto');
});
