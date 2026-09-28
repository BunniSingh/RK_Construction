import { render, screen } from '@testing-library/react';
import { RevealGroup } from '@/components/RevealGroup';

test('renders children visibly even before any intersection fires', () => {
  render(
    <RevealGroup>
      <p>First</p>
      <p>Second</p>
    </RevealGroup>
  );
  expect(screen.getByText('First')).toBeVisible();
  expect(screen.getByText('Second')).toBeVisible();
});

test('falls back to fully visible when IntersectionObserver is unavailable', () => {
  const original = window.IntersectionObserver;
  // @ts-expect-error simulating an unsupported environment
  delete window.IntersectionObserver;

  const { container } = render(
    <RevealGroup>
      <p>Only child</p>
    </RevealGroup>
  );
  expect(container.querySelector('.reveal.in-view')).not.toBeNull();

  window.IntersectionObserver = original;
});

test('applies a caller-provided className to the wrapper alongside reveal', () => {
  const { container } = render(
    <RevealGroup className="overview-grid">
      <p>Child</p>
    </RevealGroup>
  );
  const wrapper = container.querySelector('.reveal');
  expect(wrapper).toHaveClass('overview-grid');
});
