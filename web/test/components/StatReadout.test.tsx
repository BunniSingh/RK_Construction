import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { StatReadout } from '@/components/StatReadout';

test('server-rendered HTML (what a no-JS visitor or crawler gets) shows the real value, not zero', () => {
  const html = renderToString(<StatReadout stats={[{ target: 300, suffix: '+', label: 'Workforce on site' }]} />);
  expect(html).toContain('300+');
  expect(html).not.toContain('>0+<');
});

test('renders the label for each stat once mounted', () => {
  render(<StatReadout stats={[{ target: 300, suffix: '+', label: 'Workforce on site' }]} />);
  expect(screen.getByText('Workforce on site')).toBeInTheDocument();
});
