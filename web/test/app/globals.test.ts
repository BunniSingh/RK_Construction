import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('globals.css defines the dark-default token set and a light override', () => {
  const css = readFileSync(resolve(__dirname, '../../src/app/globals.css'), 'utf-8');
  expect(css).toMatch(/:root\s*{[^}]*--accent:/s);
  expect(css).toMatch(/\[data-theme=["']light["']\]/);
  expect(css).toMatch(/--bg:\s*#14171A/i);
});
