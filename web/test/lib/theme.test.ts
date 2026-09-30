import { getEffectiveTheme, setTheme } from '@/lib/theme';

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
});

test('defaults to dark when nothing is saved', () => {
  expect(getEffectiveTheme()).toBe('dark');
});

test('setTheme updates the attribute and persists the choice', () => {
  setTheme('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  expect(localStorage.getItem('rkc-theme')).toBe('light');
  expect(getEffectiveTheme()).toBe('light');
});

test('setTheme survives localStorage being unavailable', () => {
  const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('blocked');
  });
  expect(() => setTheme('dark')).not.toThrow();
  spy.mockRestore();
});
