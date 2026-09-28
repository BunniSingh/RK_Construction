import '@testing-library/jest-dom/vitest';

// jsdom does not implement matchMedia; components that check
// prefers-reduced-motion / prefers-color-scheme need this shim to render in tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
