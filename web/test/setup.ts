import '@testing-library/jest-dom/vitest';

// sanity.client.ts calls createClient() at module load time, which throws
// synchronously if NEXT_PUBLIC_SANITY_PROJECT_ID is unset. Real credentials
// are only configured at deploy time; tests need a dummy value so importing
// anything that touches the Sanity client (urlFor, queries) doesn't crash.
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||= 'test-project';
process.env.NEXT_PUBLIC_SANITY_DATASET ||= 'test';

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
