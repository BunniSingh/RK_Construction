import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

test('home page renders the company name', () => {
  render(<Page />);
  expect(screen.getByText(/R\.K\. Constructions/i)).toBeInTheDocument();
});
