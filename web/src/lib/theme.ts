export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'rkc-theme';

export function getEffectiveTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'light' || attr === 'dark') return attr;
  return 'dark';
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage may be unavailable (private mode, blocked storage) — theme still applies for this view.
  }
}
