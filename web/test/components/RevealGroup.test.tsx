import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { RevealGroup } from '@/components/RevealGroup';

test('server-rendered HTML never includes in-view, so the client\'s first paint matches it exactly (no hydration mismatch)', () => {
  const html = renderToString(
    <RevealGroup className="overview-grid">
      <p>Child</p>
    </RevealGroup>
  );
  expect(html).not.toContain('in-view');
});

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

test('applies the stagger index directly to each child, without introducing a wrapper element', () => {
  const { container } = render(
    <RevealGroup>
      <p>First</p>
      <p>Second</p>
    </RevealGroup>
  );
  const revealEl = container.querySelector('.reveal')!;
  expect(revealEl.children).toHaveLength(2);
  expect(revealEl.children[0].tagName).toBe('P');
  expect(revealEl.children[0].textContent).toBe('First');
  expect(revealEl.children[1].tagName).toBe('P');
  expect((revealEl.children[1] as HTMLElement).style.getPropertyValue('--i')).toBe('1');
});
