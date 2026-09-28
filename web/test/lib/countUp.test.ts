import { formatCount } from '@/lib/countUp';

test('formats a value at partial progress with prefix and suffix', () => {
  expect(formatCount(300, 0.5, '', '+')).toBe('150+');
});

test('formats the exact target at full progress', () => {
  expect(formatCount(10, 1, '₹', 'Cr+')).toBe('₹10Cr+');
});

test('clamps progress below 0 and above 1', () => {
  expect(formatCount(10, -1, '', '+')).toBe('0+');
  expect(formatCount(10, 2, '', '+')).toBe('10+');
});
