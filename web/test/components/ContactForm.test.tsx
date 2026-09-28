import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/ContactForm';

test('submits the form and shows a confirmation message', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }) as any;

  render(<ContactForm />);
  await userEvent.type(screen.getByLabelText(/name/i), 'Priya');
  await userEvent.type(screen.getByLabelText(/^email/i), 'priya@example.com');
  await userEvent.type(screen.getByLabelText(/project details/i), 'We need a quote.');
  await userEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

  await waitFor(() => expect(screen.getByText(/thanks/i)).toBeInTheDocument());
});

test('shows the server error message instead of a silent failure', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, error: 'A valid email is required.' }) }) as any;

  render(<ContactForm />);
  await userEvent.type(screen.getByLabelText(/name/i), 'Priya');
  await userEvent.type(screen.getByLabelText(/project details/i), 'We need a quote.');
  await userEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

  await waitFor(() => expect(screen.getByText('A valid email is required.')).toBeInTheDocument());
});
