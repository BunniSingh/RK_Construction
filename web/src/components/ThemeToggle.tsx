'use client';

import { getEffectiveTheme, setTheme } from '@/lib/theme';

export function ThemeToggle() {
  function handleClick() {
    const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={handleClick}
    >
      <svg className="sun" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.4M12 19.6V22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2 12h2.4M19.6 12H22M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
      </svg>
      <svg className="moon" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 14.3A8.4 8.4 0 1 1 9.7 4a6.9 6.9 0 0 0 10.3 10.3Z" />
      </svg>
    </button>
  );
}
