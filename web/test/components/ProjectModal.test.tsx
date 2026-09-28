import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectModal } from '@/components/ProjectModal';

const PROJECT = {
  _id: '1',
  title: 'Water Treatment Plant',
  client: 'Jindal Steel & Power',
  location: 'Raigarh, CG',
  category: 'Water Treatment',
  description: 'Full turnkey construction of the treatment facility.',
  order: 0,
};

test('renders the project details, including the description', () => {
  render(<ProjectModal project={PROJECT} code="P-01" onClose={() => {}} />);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Water Treatment Plant')).toBeInTheDocument();
  expect(screen.getByText('Jindal Steel & Power')).toBeInTheDocument();
  expect(screen.getByText('Raigarh, CG')).toBeInTheDocument();
  expect(screen.getByText('Water Treatment')).toBeInTheDocument();
  expect(screen.getByText('Full turnkey construction of the treatment facility.')).toBeInTheDocument();
});

test('does not render a description line when the project has none', () => {
  const { description: _omit, ...withoutDescription } = PROJECT;
  render(<ProjectModal project={withoutDescription} code="P-01" onClose={() => {}} />);
  expect(screen.queryByText(/turnkey/)).toBeNull();
});

test('calls onClose when the close button is clicked', async () => {
  const onClose = vi.fn();
  render(<ProjectModal project={PROJECT} code="P-01" onClose={onClose} />);
  await userEvent.click(screen.getByRole('button', { name: /close/i }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('calls onClose when the backdrop (outside the dialog content) is clicked', async () => {
  const onClose = vi.fn();
  render(<ProjectModal project={PROJECT} code="P-01" onClose={onClose} />);
  const backdrop = document.querySelector('.modal-backdrop')!;
  await userEvent.click(backdrop);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('renders into document.body via a portal so no ancestor can trap its z-index', () => {
  const { container } = render(<ProjectModal project={PROJECT} code="P-01" onClose={() => {}} />);
  expect(container.querySelector('.modal-backdrop')).toBeNull();
  expect(document.body.querySelector('.modal-backdrop')).not.toBeNull();
});

test('locks page scroll while open and restores it when closed', () => {
  document.body.style.overflow = 'auto';
  const { unmount } = render(<ProjectModal project={PROJECT} code="P-01" onClose={() => {}} />);
  expect(document.body.style.overflow).toBe('hidden');
  unmount();
  expect(document.body.style.overflow).toBe('auto');
});

test('does not call onClose when clicking inside the dialog content', async () => {
  const onClose = vi.fn();
  render(<ProjectModal project={PROJECT} code="P-01" onClose={onClose} />);
  await userEvent.click(screen.getByText('Water Treatment Plant'));
  expect(onClose).not.toHaveBeenCalled();
});

test('calls onClose when Escape is pressed', async () => {
  const onClose = vi.fn();
  render(<ProjectModal project={PROJECT} code="P-01" onClose={onClose} />);
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});
