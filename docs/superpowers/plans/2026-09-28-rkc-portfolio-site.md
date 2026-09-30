# RKC Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy the R.K. Constructions portfolio website — a Next.js site backed by Sanity CMS, matching the approved mockup, seeded with real content (including real ETP project photography) and a working contact form.

**Architecture:** Next.js (App Router, TypeScript) statically renders content fetched from Sanity via GROQ queries. Sanity Studio is embedded in the same app at `/studio` so non-technical staff edit content without a separate deployment. A Next.js API route handles contact-form submissions and emails them via Resend. Deployed to Vercel.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Sanity v3 (`sanity`, `next-sanity`, `@sanity/image-url`), Resend (transactional email), Vitest + React Testing Library, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-28-rkc-portfolio-site-design.md`

## Global Constraints

- App lives in `web/` at the repo root; `doc/`, `docs/`, and `media/` stay where they are.
- Default theme is **dark** unless the visitor has an explicit saved preference (spec §5).
- No stock/dummy photography anywhere. Every image slot without a real Sanity asset renders the hatch-pattern placeholder plate (spec §6).
- Real ETP photography (in `media/`) is used for the ETP project card and part of the Site Gallery (spec §6).
- All motion (reveal, count-up, hover, toggle) must respect `prefers-reduced-motion` (spec §5).
- Responsive down to ~360px width, no horizontal scroll (spec §8).
- Contact form must validate server-side and deliver a real email before launch (spec §8).
- Sanity and hosting stay on free tiers (spec §7).

## Review Focus

- Sanity returns empty/missing data (e.g. `siteSettings` singleton not yet created) — the site must render sensible fallback content, not crash the build or show `undefined`.
- Contact form receives an empty or garbage submission (blank required fields, no `@` in email) — the API route must reject with a 400 and a clear message, not rely on client-side `required` alone, and must not 500.
- A client/project name or description from Sanity is unusually long — cards must wrap text at 360px width, never clip or overflow their container.
- A visitor has JavaScript disabled or blocked — dark-default theme must still resolve with no flash, and all content (reveal-animated sections included) must still be visible.
- A Sanity image field exists but its asset reference is broken or absent — the image component must render the placeholder plate, never a broken-image icon.

---

## File Structure

```
web/
  package.json, tsconfig.json, next.config.mjs, vitest.config.ts
  .env.example
  test/setup.ts
  sanity/
    sanity.config.ts
    schemaTypes/
      project.ts
      client.ts
      service.ts
      galleryImage.ts
      siteSettings.ts
      index.ts
  src/
    app/
      layout.tsx
      page.tsx
      globals.css
      api/contact/route.ts
      studio/[[...tool]]/page.tsx
    components/
      ThemeToggle.tsx
      RevealGroup.tsx
      ScrollProgress.tsx
      StatReadout.tsx
      ImagePlate.tsx
      Nav.tsx
      Footer.tsx
      Hero.tsx
      Overview.tsx
      MissionVision.tsx
      CoreValues.tsx
      Services.tsx
      Clients.tsx
      Projects.tsx
      ProjectCard.tsx
      Gallery.tsx
      Contact.tsx
      ContactForm.tsx
    lib/
      theme.ts
      countUp.ts
      sanity.client.ts
      sanity.image.ts
      queries.ts
      types.ts
  scripts/
    seed.ts
```

---

### Task 1: Project scaffold & test harness

**Files:**
- Create: `web/package.json`, `web/tsconfig.json`, `web/next.config.mjs`, `web/vitest.config.ts`, `web/test/setup.ts`
- Create: `web/src/app/layout.tsx`, `web/src/app/page.tsx`, `web/src/app/globals.css`
- Test: `web/test/app/page.test.tsx`

**Interfaces:**
- Produces: a working `npm test` and `npm run dev` in `web/`, and a root `<html>`/`<body>` shell every later page/component renders into.

- [ ] **Step 1: Scaffold Next.js app**

Run from the repo root:
```bash
npx create-next-app@latest web --typescript --eslint --app --src-dir --import-alias "@/*"
```
Answer "No" to Tailwind if prompted (this project uses hand-written CSS tokens, not a utility framework). If the CLI initializes a nested git repo inside `web/`, remove it so the whole project stays one repo:
```bash
rm -rf web/.git
```

- [ ] **Step 2: Install test tooling**

```bash
cd web
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Configure Vitest**

Create `web/vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
  },
});
```

Create `web/test/setup.ts`:
```ts
import '@testing-library/jest-dom/vitest';
```

Add to `web/package.json` `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 4: Write the failing smoke test**

Create `web/test/app/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import Page from '@/app/page';

test('home page renders the company name', () => {
  render(<Page />);
  expect(screen.getByText(/R\.K\. Constructions/i)).toBeInTheDocument();
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `create-next-app`'s default `page.tsx` doesn't contain "R.K. Constructions".

- [ ] **Step 6: Make it pass minimally**

Replace `web/src/app/page.tsx`:
```tsx
export default function Page() {
  return <main>R.K. Constructions</main>;
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
cd ..
git add web
git commit -m "chore: scaffold Next.js app with Vitest test harness"
```

---

### Task 2: Design tokens & global styles

**Files:**
- Modify: `web/src/app/globals.css`
- Modify: `web/src/app/layout.tsx`
- Test: `web/test/app/globals.test.ts`

**Interfaces:**
- Produces: CSS custom properties (`--bg`, `--surface`, `--surface-2`, `--ink`, `--muted`, `--line`, `--line-strong`, `--accent`, `--accent-ink`, `--steel`) available globally, dark by default, with a `[data-theme="light"]` override. Every later component styles through these tokens.

- [ ] **Step 1: Write the failing test**

Create `web/test/app/globals.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('globals.css defines the dark-default token set and a light override', () => {
  const css = readFileSync(resolve(__dirname, '../../src/app/globals.css'), 'utf-8');
  expect(css).toMatch(/:root\s*{[^}]*--accent:/s);
  expect(css).toMatch(/\[data-theme=["']light["']\]/);
  expect(css).toMatch(/--bg:\s*#14171A/i);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `globals.css` is still the `create-next-app` default.

- [ ] **Step 3: Write the token stylesheet**

Replace `web/src/app/globals.css` (dark values live on bare `:root` since dark is default; `[data-theme="light"]` overrides them — this is the inverse of the mockup's light-default structure, per spec §5):
```css
@import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;900&family=Archivo:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root {
  --bg: #14171A;
  --surface: #1B1F23;
  --surface-2: #20252A;
  --ink: #E9E5DA;
  --muted: #9AA1A6;
  --line: #2B3239;
  --line-strong: #3B444C;
  --accent: #FF7A29;
  --accent-ink: #161616;
  --steel: #8492A0;
  --hatch-a: rgba(132, 146, 160, 0.16);
  --hatch-b: rgba(132, 146, 160, 0);
}

[data-theme='light'] {
  --bg: #F0EEE5;
  --surface: #FFFFFF;
  --surface-2: #E7E3D7;
  --ink: #1A1F23;
  --muted: #5B6268;
  --line: #D3CDBD;
  --line-strong: #B9B29D;
  --accent: #E05A00;
  --accent-ink: #FFFFFF;
  --steel: #3E4C59;
  --hatch-a: rgba(62, 76, 89, 0.14);
  --hatch-b: rgba(62, 76, 89, 0);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Archivo', ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  transition: background-color .4s ease, color .4s ease;
}

h1, h2, h3 {
  font-family: 'Big Shoulders Display', 'Archivo Black', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  text-wrap: balance;
  margin: 0;
  line-height: 0.92;
}

.mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
p { line-height: 1.6; margin: 0; }
a { color: inherit; }
.wrap { max-width: 1180px; margin-inline: auto; padding-inline: 20px; }
img, [data-aspect] { max-width: 100%; }
section[id] { scroll-margin-top: 78px; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 4: Wire the no-flash theme-restore script into the root layout**

Replace `web/src/app/layout.tsx`:
```tsx
import './globals.css';

export const metadata = {
  title: 'R.K. Constructions',
  description: 'Industrial and infrastructure construction, Raigarh, Chhattisgarh.',
};

const THEME_INIT = `
try {
  var saved = localStorage.getItem('rkc-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add web/src/app/globals.css web/src/app/layout.tsx web/test/app/globals.test.ts
git commit -m "feat: add dark-default design tokens and no-flash theme init"
```

---

### Task 3: Theme persistence utility + ThemeToggle

**Files:**
- Create: `web/src/lib/theme.ts`
- Create: `web/src/components/ThemeToggle.tsx`
- Test: `web/test/lib/theme.test.ts`, `web/test/components/ThemeToggle.test.tsx`

**Interfaces:**
- Produces: `getEffectiveTheme(): 'light' | 'dark'`, `setTheme(theme: 'light' | 'dark'): void` from `@/lib/theme`; `<ThemeToggle />` component (client component, no props) used by `Nav` (Task 9).

- [ ] **Step 1: Write the failing utility test**

Create `web/test/lib/theme.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `@/lib/theme` doesn't exist.

- [ ] **Step 3: Implement the utility**

Create `web/src/lib/theme.ts`:
```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Write the failing component test**

Create `web/test/components/ThemeToggle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/ThemeToggle';

test('clicking the toggle switches the theme attribute', async () => {
  document.documentElement.setAttribute('data-theme', 'dark');
  render(<ThemeToggle />);
  const button = screen.getByRole('button', { name: /toggle dark mode/i });
  await userEvent.click(button);
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ThemeToggle` doesn't exist.

- [ ] **Step 7: Implement the component**

Create `web/src/components/ThemeToggle.tsx`:
```tsx
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
```

Append to `web/src/app/globals.css`:
```css
.theme-toggle {
  position: relative; width: 38px; height: 38px; flex: none; border-radius: 2px;
  border: 1px solid var(--line-strong); background: var(--surface); color: var(--ink);
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  transition: border-color .3s ease, color .3s ease;
}
.theme-toggle:hover { border-color: var(--accent); color: var(--accent); }
.theme-toggle svg { position: absolute; transition: opacity .35s ease, transform .5s ease; }
.theme-toggle .moon { opacity: 0; transform: rotate(-70deg) scale(.4); }
.theme-toggle .sun { opacity: 1; transform: rotate(0) scale(1); }
[data-theme='light'] .theme-toggle .sun { opacity: 0; transform: rotate(70deg) scale(.4); }
[data-theme='light'] .theme-toggle .moon { opacity: 1; transform: rotate(0) scale(1); }
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add web/src/lib/theme.ts web/src/components/ThemeToggle.tsx web/src/app/globals.css web/test/lib/theme.test.ts web/test/components/ThemeToggle.test.tsx
git commit -m "feat: add theme persistence utility and toggle button"
```

---

### Task 4: RevealGroup + ScrollProgress

**Files:**
- Create: `web/src/components/RevealGroup.tsx`, `web/src/components/ScrollProgress.tsx`
- Test: `web/test/components/RevealGroup.test.tsx`

**Interfaces:**
- Produces: `<RevealGroup>{children}</RevealGroup>` (client component, wraps a section's direct children in scroll-reveal behavior) and `<ScrollProgress />` (client component, no props). Both consumed by page sections built in later tasks.

- [ ] **Step 1: Write the failing test**

Create `web/test/components/RevealGroup.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `RevealGroup` doesn't exist.

- [ ] **Step 3: Implement RevealGroup**

Create `web/src/components/RevealGroup.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function RevealGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={`reveal${inView ? ' in-view' : ''}`}>
      {items.map((child, i) => (
        <div key={i} style={{ ['--i' as string]: i }}>
          {child}
        </div>
      ))}
    </div>
  );
}
```

Create `web/src/components/ScrollProgress.tsx`:
```tsx
'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function update() {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="progress-track" aria-hidden="true">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
```

Append to `web/src/app/globals.css`:
```css
html.js .reveal > * {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity .6s cubic-bezier(.22,.7,.3,1), transform .6s cubic-bezier(.22,.7,.3,1);
  transition-delay: calc(var(--i, 0) * 60ms);
}
html.js .reveal.in-view > * { opacity: 1; transform: translateY(0); }

.progress-track { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 40; background: transparent; }
.progress-fill { height: 100%; background: var(--accent); }
```

Note: the `html.js` gate class is added by `Nav` in Task 9 (the first client component mounted on every page), so a no-JS visitor always sees fully visible, unstaggered content.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/RevealGroup.tsx web/src/components/ScrollProgress.tsx web/src/app/globals.css web/test/components/RevealGroup.test.tsx
git commit -m "feat: add scroll-reveal and scroll-progress components"
```

---

### Task 5: countUp utility + StatReadout

**Files:**
- Create: `web/src/lib/countUp.ts`, `web/src/components/StatReadout.tsx`
- Test: `web/test/lib/countUp.test.ts`

**Interfaces:**
- Produces: `formatCount(target: number, progress: number, prefix?: string, suffix?: string): string` from `@/lib/countUp`; `<StatReadout stats={Stat[]} />` where `Stat = { target: number; prefix?: string; suffix?: string; label: string }`, consumed by `Hero` (Task 10).

- [ ] **Step 1: Write the failing test**

Create `web/test/lib/countUp.test.ts`:
```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `@/lib/countUp` doesn't exist.

- [ ] **Step 3: Implement countUp**

Create `web/src/lib/countUp.ts`:
```ts
export function formatCount(target: number, progress: number, prefix = '', suffix = ''): string {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return `${prefix}${Math.round(target * clamped)}${suffix}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Implement StatReadout (no separate test — behavior is exercised via `formatCount` above and visually via manual QA in Task 16)**

Create `web/src/components/StatReadout.tsx`:
```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCount } from '@/lib/countUp';

export type Stat = { target: number; prefix?: string; suffix?: string; label: string };

function Cell({ stat }: { stat: Stat }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setProgress(1);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const duration = 900;
    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="readout-cell">
      <div className="num">{formatCount(stat.target, progress, stat.prefix, stat.suffix)}</div>
      <div className="lbl">{stat.label}</div>
    </div>
  );
}

export function StatReadout({ stats }: { stats: Stat[] }) {
  return (
    <div className="readout">
      {stats.map((s) => (
        <Cell key={s.label} stat={s} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add web/src/lib/countUp.ts web/src/components/StatReadout.tsx web/test/lib/countUp.test.ts
git commit -m "feat: add count-up stat readout"
```

---

### Task 6: ImagePlate (placeholder fallback)

**Files:**
- Create: `web/src/components/ImagePlate.tsx`
- Test: `web/test/components/ImagePlate.test.tsx`

**Interfaces:**
- Produces: `<ImagePlate src={string | null | undefined} alt={string} caption={string} />`, consumed by `ProjectCard` (Task 13), `Clients` (Task 12), and `Gallery` (Task 14). This is the component that owns the "no fake photos" rule from spec §6 and Review Focus item 5.

- [ ] **Step 1: Write the failing test**

Create `web/test/components/ImagePlate.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { ImagePlate } from '@/components/ImagePlate';

test('renders the real image when src is provided', () => {
  render(<ImagePlate src="/photo.jpg" alt="Site photo" caption="P-01" />);
  const img = screen.getByRole('img', { name: 'Site photo' });
  expect(img).toHaveAttribute('src', '/photo.jpg');
});

test('renders the hatch placeholder when src is missing', () => {
  render(<ImagePlate src={null} alt="Site photo placeholder" caption="Photo pending — P-02" />);
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('Photo pending — P-02')).toBeInTheDocument();
});

test('renders the hatch placeholder when src is an empty string', () => {
  render(<ImagePlate src="" alt="Site photo placeholder" caption="Photo pending — P-03" />);
  expect(screen.queryByRole('img')).toBeNull();
});

test('falls back to the placeholder if the image fails to load (broken asset reference)', () => {
  render(<ImagePlate src="/broken.jpg" alt="Site photo" caption="Photo pending — P-04" />);
  const img = screen.getByRole('img', { name: 'Site photo' });
  img.dispatchEvent(new Event('error'));
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText('Photo pending — P-04')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ImagePlate` doesn't exist.

- [ ] **Step 3: Implement ImagePlate**

Create `web/src/components/ImagePlate.tsx`:
```tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  src?: string | null;
  alt: string;
  caption: string;
};

function Placeholder({ alt, caption }: { alt: string; caption: string }) {
  return (
    <div className="plate" role="img" aria-label={alt}>
      <svg className="crosshair tl" viewBox="0 0 16 16"><path d="M8 0v16M0 8h16" stroke="var(--steel)" strokeWidth="1" /></svg>
      <svg className="crosshair br" viewBox="0 0 16 16"><path d="M8 0v16M0 8h16" stroke="var(--steel)" strokeWidth="1" /></svg>
      <div className="cap">{caption}</div>
    </div>
  );
}

export function ImagePlate({ src, alt, caption }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <Placeholder alt={alt} caption={caption} />;
  }

  return (
    <div className="plate plate--photo">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, 33vw"
        style={{ objectFit: 'cover' }}
        onError={() => setFailed(true)}
      />
      <div className="cap">{caption}</div>
    </div>
  );
}
```

Append to `web/src/app/globals.css`:
```css
.plate {
  position: relative; aspect-ratio: 4/3; overflow: hidden;
  background-image: repeating-linear-gradient(45deg, var(--hatch-a) 0 2px, var(--hatch-b) 2px 11px);
  background-position: 0 0;
  background-color: var(--surface-2);
  border: 1px solid var(--line-strong);
  transition: background-position .7s ease, border-color .35s ease;
}
.plate--photo { background-image: none; }
.plate .crosshair { position: absolute; width: 16px; height: 16px; opacity: .55; }
.plate .crosshair.tl { top: 8px; left: 8px; }
.plate .crosshair.br { bottom: 8px; right: 8px; transform: rotate(180deg); }
.plate .cap {
  position: absolute; left: 0; right: 0; bottom: 0;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  border-top: 1px solid var(--line-strong);
  font-family: 'IBM Plex Mono'; font-size: 10.5px; letter-spacing: .03em;
  padding: 7px 10px; color: var(--steel); text-transform: uppercase;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/ImagePlate.tsx web/src/app/globals.css web/test/components/ImagePlate.test.tsx
git commit -m "feat: add ImagePlate with hatch-pattern placeholder fallback"
```

---

### Task 7: Sanity schemas + Studio route

**Files:**
- Create: `web/sanity/schemaTypes/project.ts`, `client.ts`, `service.ts`, `galleryImage.ts`, `siteSettings.ts`, `index.ts`
- Create: `web/sanity/sanity.config.ts`
- Create: `web/src/app/studio/[[...tool]]/page.tsx`
- Create: `web/.env.example`
- Test: `web/test/sanity/schemaTypes.test.ts`

**Interfaces:**
- Produces: the Sanity schema shape that `lib/types.ts` (Task 8) and `scripts/seed.ts` (Task 15) must match exactly: `project` (title, client, location, category, description, photo, order), `client` (name, location, logo), `service` (name, description, order), `galleryImage` (image, caption), `siteSettings` (singleton: mission, vision, workforceCount, engineeringStaffCount, machineryList, annualProjectValue, address, phone, email).

- [ ] **Step 1: Install Sanity**

```bash
cd web
npm install sanity next-sanity @sanity/image-url @sanity/vision
```

- [ ] **Step 2: Write the failing schema test**

Create `web/test/sanity/schemaTypes.test.ts`:
```ts
import { schemaTypes } from '../../sanity/schemaTypes';

test('exports exactly the five expected document types', () => {
  const names = schemaTypes.map((t) => t.name).sort();
  expect(names).toEqual(['client', 'galleryImage', 'project', 'service', 'siteSettings']);
});

test('siteSettings is a singleton-shaped document (no title needed for listing)', () => {
  const siteSettings = schemaTypes.find((t) => t.name === 'siteSettings')!;
  expect(siteSettings.type).toBe('document');
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `sanity/schemaTypes` doesn't exist.

- [ ] **Step 4: Write the schemas**

Create `web/sanity/schemaTypes/project.ts`:
```ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'client', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'category', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
});
```

Create `web/sanity/schemaTypes/client.ts`:
```ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
  ],
});
```

Create `web/sanity/schemaTypes/service.ts`:
```ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'string' }),
    defineField({ name: 'order', type: 'number', initialValue: 0 }),
  ],
});
```

Create `web/sanity/schemaTypes/galleryImage.ts`:
```ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'document',
  fields: [
    defineField({ name: 'image', type: 'image', validation: (r) => r.required() }),
    defineField({ name: 'caption', type: 'string', validation: (r) => r.required() }),
  ],
});
```

Create `web/sanity/schemaTypes/siteSettings.ts`:
```ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'mission', type: 'text' }),
    defineField({ name: 'vision', type: 'text' }),
    defineField({ name: 'workforceCount', type: 'string' }),
    defineField({ name: 'engineeringStaffCount', type: 'string' }),
    defineField({ name: 'machineryList', type: 'string' }),
    defineField({ name: 'annualProjectValue', type: 'string' }),
    defineField({ name: 'address', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'email', type: 'string' }),
  ],
});
```

Create `web/sanity/schemaTypes/index.ts`:
```ts
import project from './project';
import client from './client';
import service from './service';
import galleryImage from './galleryImage';
import siteSettings from './siteSettings';

export const schemaTypes = [project, client, service, galleryImage, siteSettings];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Wire the Studio config and route**

Create `web/sanity/sanity.config.ts`:
```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'rkc',
  title: 'R.K. Constructions',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

Create `web/src/app/studio/[[...tool]]/page.tsx`:
```tsx
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity/sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Create `web/.env.example`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=
RESEND_API_KEY=
CONTACT_TO_EMAIL=raju2021rgh@gmail.com
```

- [ ] **Step 7: Commit**

```bash
git add web/sanity web/src/app/studio web/.env.example web/package.json web/package-lock.json web/test/sanity
git commit -m "feat: add Sanity schemas and embedded Studio route"
```

---

### Task 8: Sanity client, GROQ queries, and types

**Files:**
- Create: `web/src/lib/sanity.client.ts`, `web/src/lib/sanity.image.ts`, `web/src/lib/queries.ts`, `web/src/lib/types.ts`
- Test: `web/test/lib/queries.test.ts`

**Interfaces:**
- Consumes: schema field names from Task 7.
- Produces: `Project`, `Client`, `Service`, `GalleryImage`, `SiteSettings` types; `getProjects()`, `getClients()`, `getServices()`, `getGalleryImages()`, `getSiteSettings()` async functions from `@/lib/queries`, each returning an array (or `null` for `getSiteSettings`) — never throwing on empty data (Review Focus: empty Sanity data). `urlFor(source)` from `@/lib/sanity.image` returning `{ url(): string }` or `null` for a missing image.

- [ ] **Step 1: Write the failing test**

Create `web/test/lib/queries.test.ts`:
```ts
import { describe, expect, test, vi } from 'vitest';

vi.mock('@/lib/sanity.client', () => ({
  sanityClient: { fetch: vi.fn() },
}));

import { sanityClient } from '@/lib/sanity.client';
import { getProjects, getSiteSettings } from '@/lib/queries';

describe('getProjects', () => {
  test('returns the array Sanity provides', async () => {
    (sanityClient.fetch as any).mockResolvedValueOnce([{ title: 'ETP' }]);
    const result = await getProjects();
    expect(result).toEqual([{ title: 'ETP' }]);
  });

  test('returns an empty array when Sanity has no projects yet', async () => {
    (sanityClient.fetch as any).mockResolvedValueOnce(null);
    const result = await getProjects();
    expect(result).toEqual([]);
  });
});

describe('getSiteSettings', () => {
  test('returns null when the singleton has not been created yet', async () => {
    (sanityClient.fetch as any).mockResolvedValueOnce(null);
    const result = await getSiteSettings();
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `@/lib/queries` doesn't exist.

- [ ] **Step 3: Implement the client, types, and queries**

Create `web/src/lib/sanity.client.ts`:
```ts
import { createClient } from 'next-sanity';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

Create `web/src/lib/sanity.image.ts`:
```ts
import imageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';
import { sanityClient } from './sanity.client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source?: Image | null): string | null {
  if (!source) return null;
  return builder.image(source).auto('format').url();
}
```

Create `web/src/lib/types.ts`:
```ts
export type Project = {
  _id: string;
  title: string;
  client: string;
  location: string;
  category: string;
  description?: string;
  photo?: import('sanity').Image;
  order: number;
};

export type Client = {
  _id: string;
  name: string;
  location?: string;
  logo?: import('sanity').Image;
};

export type Service = {
  _id: string;
  name: string;
  description?: string;
  order: number;
};

export type GalleryImage = {
  _id: string;
  image: import('sanity').Image;
  caption: string;
};

export type SiteSettings = {
  mission?: string;
  vision?: string;
  workforceCount?: string;
  engineeringStaffCount?: string;
  machineryList?: string;
  annualProjectValue?: string;
  address?: string;
  phone?: string;
  email?: string;
};
```

Create `web/src/lib/queries.ts`:
```ts
import { sanityClient } from './sanity.client';
import type { Project, Client, Service, GalleryImage, SiteSettings } from './types';

export async function getProjects(): Promise<Project[]> {
  const result = await sanityClient.fetch<Project[]>(`*[_type == "project"] | order(order asc)`);
  return result ?? [];
}

export async function getClients(): Promise<Client[]> {
  const result = await sanityClient.fetch<Client[]>(`*[_type == "client"] | order(name asc)`);
  return result ?? [];
}

export async function getServices(): Promise<Service[]> {
  const result = await sanityClient.fetch<Service[]>(`*[_type == "service"] | order(order asc)`);
  return result ?? [];
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const result = await sanityClient.fetch<GalleryImage[]>(`*[_type == "galleryImage"]`);
  return result ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const result = await sanityClient.fetch<SiteSettings | null>(`*[_type == "siteSettings"][0]`);
  return result ?? null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/lib/sanity.client.ts web/src/lib/sanity.image.ts web/src/lib/queries.ts web/src/lib/types.ts web/test/lib/queries.test.ts
git commit -m "feat: add Sanity client, typed GROQ queries, and image URL helper"
```

---

### Task 9: Nav + Footer + layout wiring

**Files:**
- Create: `web/src/components/Nav.tsx`, `web/src/components/Footer.tsx`
- Modify: `web/src/app/layout.tsx`
- Test: `web/test/components/Nav.test.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 3), `ScrollProgress` (Task 4).
- Produces: `<Nav />` and `<Footer />` rendered by the root layout around every page's content; `Nav` is the component responsible for adding the `js` class to `<html>` (so `RevealGroup`'s CSS gate in Task 4 activates only when JS actually runs).

- [ ] **Step 1: Write the failing test**

Create `web/test/components/Nav.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Nav } from '@/components/Nav';

test('renders the brand name and primary nav links', () => {
  render(<Nav />);
  expect(screen.getByText('R.K. Constructions')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
});

test('adds the js class to the document root on mount', () => {
  document.documentElement.classList.remove('js');
  render(<Nav />);
  expect(document.documentElement.classList.contains('js')).toBe(true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Nav` doesn't exist.

- [ ] **Step 3: Implement Nav and Footer**

Create `web/src/components/Nav.tsx`:
```tsx
'use client';

import { useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  return (
    <header className="nav">
      <div className="wrap">
        <div className="brand">
          <svg className="brand-mark" viewBox="0 0 40 40" fill="none">
            <rect x="1" y="1" width="38" height="38" transform="rotate(45 20 20)" stroke="var(--ink)" strokeWidth="2" />
            <text x="20" y="25" textAnchor="middle" fontFamily="Big Shoulders Display" fontWeight="800" fontSize="14" fill="var(--ink)">RKC</text>
          </svg>
          <div className="brand-text">
            <div className="name">R.K. Constructions</div>
            <div className="tag">Infra &middot; Engineering &middot; Dev.</div>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#services">Services</a>
          <a href="#projects">Projects</a>
          <a href="#clients">Clients</a>
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle />
          <a className="btn btn-ghost" href="#gallery">Site Gallery</a>
          <a className="btn btn-solid" href="#contact">Request a Proposal</a>
        </div>
      </div>
    </header>
  );
}
```

Create `web/src/components/Footer.tsx`:
```tsx
export function Footer() {
  return (
    <footer>
      <div className="tblock">
        <div className="tblock-grid">
          <div className="tblock-cell"><div className="k">Project</div><div className="v">RKC &mdash; Corporate Website</div></div>
          <div className="tblock-cell"><div className="k">Drawn</div><div className="v">Production Build</div></div>
          <div className="tblock-cell"><div className="k">Scale</div><div className="v">N.T.S.</div></div>
          <div className="tblock-cell" style={{ borderRight: 'none' }}><div className="k">Sheet</div><div className="v">08 of 08</div></div>
        </div>
        <div className="tblock-note">
          <span>&copy; R.K. Constructions &mdash; Infrastructure, Engineering &amp; Development</span>
        </div>
      </div>
    </footer>
  );
}
```

Append the full nav/footer/button CSS block ported from the approved mockup (brand, nav-links, `.btn`, `.tblock*`) to `web/src/app/globals.css` — copy verbatim from the mockup source published at the design stage; the mockup already carries every selector this task's markup needs.

- [ ] **Step 4: Wire into the root layout**

Modify `web/src/app/layout.tsx` — add imports and render `<Nav />` / `<Footer />` around `{children}`:
```tsx
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';

// ...metadata and THEME_INIT stay as in Task 2...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <ScrollProgress />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add web/src/components/Nav.tsx web/src/components/Footer.tsx web/src/app/layout.tsx web/src/app/globals.css web/test/components/Nav.test.tsx
git commit -m "feat: add Nav and Footer, wire into root layout"
```

---

### Task 10: Hero section

**Files:**
- Create: `web/src/components/Hero.tsx`
- Test: `web/test/components/Hero.test.tsx`

**Interfaces:**
- Consumes: `StatReadout` (Task 5).
- Produces: `<Hero />` (no props — stats are the fixed headline figures from the profile PDF, spec §3), consumed by `page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

Create `web/test/components/Hero.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/Hero';

test('renders the headline and all four stats', () => {
  render(<Hero />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/steel/i);
  expect(screen.getByText('Years in operation')).toBeInTheDocument();
  expect(screen.getByText('Annual project value')).toBeInTheDocument();
  expect(screen.getByText('Workforce on site')).toBeInTheDocument();
  expect(screen.getByText('Engineering staff')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Hero` doesn't exist.

- [ ] **Step 3: Implement Hero**

Create `web/src/components/Hero.tsx`:
```tsx
import { StatReadout, type Stat } from './StatReadout';

const STATS: Stat[] = [
  { target: 10, suffix: '+', label: 'Years in operation' },
  { target: 10, prefix: '₹', suffix: 'Cr+', label: 'Annual project value' },
  { target: 300, suffix: '+', label: 'Workforce on site' },
  { target: 15, suffix: '+', label: 'Engineering staff' },
];

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Raigarh, Chhattisgarh &middot; Est. one decade in industrial construction</span>
          <h1>We build what <span>steel</span> runs on.</h1>
          <p className="lede">
            R.K. Constructions delivers industrial and infrastructure projects for India&apos;s steel and power
            plants — sinter plants, blast furnaces, treatment plants and the roads that connect them — on
            schedule, on spec, without compromise.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-solid" href="#contact">Request a Proposal &rarr;</a>
            <a className="btn" href="#projects">View Projects</a>
          </div>
        </div>
        <StatReadout stats={STATS} />
      </div>
    </section>
  );
}
```

Append the hero CSS block (grid background, radial glow, `.readout*`, `.eyebrow`, `.hero-ctas`) ported verbatim from the approved mockup to `web/src/app/globals.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Hero.tsx web/src/app/globals.css web/test/components/Hero.test.tsx
git commit -m "feat: add Hero section with stat readout"
```

---

### Task 11: Overview, Mission & Vision, Core Values

**Files:**
- Create: `web/src/components/Overview.tsx`, `web/src/components/MissionVision.tsx`, `web/src/components/CoreValues.tsx`
- Test: `web/test/components/Overview.test.tsx`

**Interfaces:**
- Consumes: `SiteSettings` type (Task 8), `RevealGroup` (Task 4).
- Produces: `<Overview settings={SiteSettings | null} />`, `<MissionVision settings={SiteSettings | null} />`, `<CoreValues />`, consumed by `page.tsx` (Task 16). Each renders sensible fallback text when `settings` is `null` (Review Focus: empty Sanity data).

- [ ] **Step 1: Write the failing test**

Create `web/test/components/Overview.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Overview } from '@/components/Overview';

test('renders fallback fact values when siteSettings has not been created yet', () => {
  render(<Overview settings={null} />);
  expect(screen.getByText(/300\+/)).toBeInTheDocument();
  expect(screen.getByText(/Raigarh, CG/)).toBeInTheDocument();
});

test('renders values from siteSettings when provided', () => {
  render(
    <Overview
      settings={{
        workforceCount: '450+ (variable)',
        engineeringStaffCount: '20+ engineers',
        machineryList: '3 Ajax · 3 JCB · 2 Excavator',
        annualProjectValue: '₹15 Cr+',
      }}
    />
  );
  expect(screen.getByText('450+ (variable)')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Overview` doesn't exist.

- [ ] **Step 3: Implement the three components**

Create `web/src/components/Overview.tsx`:
```tsx
import type { SiteSettings } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

const FALLBACK = {
  workforceCount: '300+ (variable)',
  engineeringStaffCount: '15+ engineers',
  machineryList: '2 Ajax · 2 JCB · 1 Excavator',
  annualProjectValue: '₹10 Cr+',
};

export function Overview({ settings }: { settings: SiteSettings | null }) {
  const s = { ...FALLBACK, ...(settings ?? {}) };
  return (
    <section id="overview">
      <div className="wrap">
        <div className="sheet-label">Sheet 01 / 08 &mdash; Overview</div>
        <RevealGroup>
          <div className="overview">
            <h2>Precision, at industrial scale.</h2>
            <p>
              R.K. Constructions is an emerging infrastructure development company where innovation meets
              precision. With a decade of experience, we specialize in delivering high-quality, efficient
              solutions for complex industrial and infrastructure projects.
            </p>
            <p>We build more than structures; we build lasting partnerships and transformative spaces that drive our clients&apos; success.</p>
          </div>
          <div className="fact-panel mono">
            <div className="row"><span className="k">Headquarters</span><span className="v">Raigarh, CG</span></div>
            <div className="row"><span className="k">Workforce</span><span className="v">{s.workforceCount}</span></div>
            <div className="row"><span className="k">Technical staff</span><span className="v">{s.engineeringStaffCount}</span></div>
            <div className="row"><span className="k">Plant &amp; machinery</span><span className="v">{s.machineryList}</span></div>
            <div className="row"><span className="k">Annual project value</span><span className="v">{s.annualProjectValue}</span></div>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
```

Create `web/src/components/MissionVision.tsx`:
```tsx
import type { SiteSettings } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

const FALLBACK_MISSION = 'To lead the construction industry with a commitment to excellence, safety, and innovation — exceeding client expectations through meticulous planning, transparent communication, and exceptional craftsmanship.';
const FALLBACK_VISION = 'To be the premier choice in the construction industry, renowned for innovation, sustainability and excellence — shaping the future of industrial infrastructure.';

export function MissionVision({ settings }: { settings: SiteSettings | null }) {
  return (
    <section id="mission">
      <div className="wrap">
        <div className="sheet-label">Sheet 02 / 08 &mdash; Mission &amp; Vision</div>
        <RevealGroup>
          <div className="mv-card">
            <span className="clause">01 &mdash; Mission</span>
            <h3>Lead with excellence, safety and trust.</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>{settings?.mission || FALLBACK_MISSION}</p>
          </div>
          <div className="mv-card">
            <span className="clause">02 &mdash; Vision</span>
            <h3>Set the standard for industrial infrastructure.</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>{settings?.vision || FALLBACK_VISION}</p>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
```

Create `web/src/components/CoreValues.tsx`:
```tsx
import { RevealGroup } from './RevealGroup';

const VALUES = [
  { no: '3.1', name: 'Excellence', body: 'We pursue excellence in all aspects of our work, delivering projects of the highest quality that exceed client expectations.' },
  { no: '3.2', name: 'Integrity', body: 'We uphold the highest ethical standards, fostering trust and transparency with clients, partners and stakeholders.' },
  { no: '3.3', name: 'Safety', body: 'Safety is our top priority — a secure work environment through rigorous standards, comprehensive training, and continuous vigilance.' },
  { no: '3.4', name: 'Planning & Deliverables', body: 'Meticulous planning, efficient workflows and proactive management ensure every project ships on schedule, without compromising quality or safety.' },
];

export function CoreValues() {
  return (
    <section id="values">
      <div className="wrap">
        <div className="sheet-label">Sheet 03 / 08 &mdash; Core Values</div>
        <RevealGroup>
          {VALUES.map((v) => (
            <div className="value-row" key={v.no}>
              <span className="clause-no">{v.no}</span>
              <div><h3>{v.name}</h3><p>{v.body}</p></div>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
```

Append the overview/mission/values CSS blocks ported verbatim from the mockup to `web/src/app/globals.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Overview.tsx web/src/components/MissionVision.tsx web/src/components/CoreValues.tsx web/src/app/globals.css web/test/components/Overview.test.tsx
git commit -m "feat: add Overview, Mission & Vision, and Core Values sections"
```

---

### Task 12: Services + Clients

**Files:**
- Create: `web/src/components/Services.tsx`, `web/src/components/Clients.tsx`
- Test: `web/test/components/Services.test.tsx`, `web/test/components/Clients.test.tsx`

**Interfaces:**
- Consumes: `Service`, `Client` types (Task 8), `ImagePlate` (Task 6), `RevealGroup` (Task 4).
- Produces: `<Services services={Service[]} />`, `<Clients clients={Client[]} />`, consumed by `page.tsx` (Task 16). Both render an explanatory empty state when the array is empty (Review Focus: empty Sanity data).

- [ ] **Step 1: Write the failing tests**

Create `web/test/components/Services.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Services } from '@/components/Services';

test('renders each service name', () => {
  render(<Services services={[{ _id: '1', name: 'Sinter Plant Construction', order: 0 }]} />);
  expect(screen.getByText('Sinter Plant Construction')).toBeInTheDocument();
});

test('shows a content-pending message when there are no services yet', () => {
  render(<Services services={[]} />);
  expect(screen.getByText(/service list is being updated/i)).toBeInTheDocument();
});
```

Create `web/test/components/Clients.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Clients } from '@/components/Clients';

test('renders each client name and location', () => {
  render(<Clients clients={[{ _id: '1', name: 'JSW Steel', location: 'Raigarh, CG' }]} />);
  expect(screen.getByText('JSW Steel')).toBeInTheDocument();
  expect(screen.getByText('Raigarh, CG')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Services` and `Clients` don't exist.

- [ ] **Step 3: Implement both components**

Create `web/src/components/Services.tsx`:
```tsx
import type { Service } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services">
      <div className="wrap">
        <div className="sheet-label">Sheet 04 / 08 &mdash; Services</div>
        <div className="services-head">
          <h2>Full-spectrum industrial construction.</h2>
          <p>A decade building integrated steel plants — from conceptual design and engineering through construction and ongoing maintenance.</p>
        </div>
        {services.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>The service list is being updated — check back shortly.</p>
        ) : (
          <RevealGroup>
            {services.map((s, i) => (
              <div className="svc-card" key={s._id}>
                <span className="idx mono">{`S${i + 1}`}</span>
                <div>
                  <div className="t">{s.name}</div>
                  {s.description && <div className="sub">{s.description}</div>}
                </div>
              </div>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
```

Create `web/src/components/Clients.tsx`:
```tsx
import type { Client } from '@/lib/types';
import { RevealGroup } from './RevealGroup';

export function Clients({ clients }: { clients: Client[] }) {
  return (
    <section id="clients">
      <div className="wrap">
        <div className="sheet-label">Sheet 06 / 08 &mdash; Key Clients</div>
        {clients.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>Client list is being updated — check back shortly.</p>
        ) : (
          <RevealGroup>
            {clients.map((c) => (
              <div className="client-cell" key={c._id}>
                <div className="cname">{c.name}</div>
                {c.location && <div className="cloc">{c.location}</div>}
              </div>
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
```

Append the services/clients CSS blocks (`.svc-grid`, `.svc-card`, `.client-wall`, `.client-cell`, with their hover states) ported verbatim from the mockup to `web/src/app/globals.css`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Services.tsx web/src/components/Clients.tsx web/src/app/globals.css web/test/components/Services.test.tsx web/test/components/Clients.test.tsx
git commit -m "feat: add Services and Clients sections with empty states"
```

---

### Task 13: Projects + ProjectCard

**Files:**
- Create: `web/src/components/Projects.tsx`, `web/src/components/ProjectCard.tsx`
- Test: `web/test/components/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: `Project` type (Task 8), `ImagePlate` (Task 6), `urlFor` (Task 8), `RevealGroup` (Task 4).
- Produces: `<Projects projects={Project[]} />`, consumed by `page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

Create `web/test/components/ProjectCard.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/ProjectCard';

const LONG_TITLE = 'Infrastructure Development And Full RCC Road, Drain, And Boundary Wall Construction Package';

test('renders project details and does not clip a very long title', () => {
  render(
    <ProjectCard
      code="P-07"
      project={{
        _id: '1',
        title: LONG_TITLE,
        client: 'NTPC',
        location: 'Lara, Raigarh',
        category: 'Infrastructure Dev.',
        order: 0,
      }}
    />
  );
  const title = screen.getByText(LONG_TITLE);
  expect(title).toBeInTheDocument();
  expect(title).toHaveClass('proj-title');
});

test('falls back to the placeholder plate when the project has no photo', () => {
  render(
    <ProjectCard
      code="P-01"
      project={{ _id: '1', title: 'Water Treatment Plant', client: 'Jindal Steel & Power', location: 'Raigarh, CG', category: 'Water Treatment', order: 0 }}
    />
  );
  expect(screen.queryByRole('img')).toBeNull();
  expect(screen.getByText(/Photo pending/)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ProjectCard` doesn't exist.

- [ ] **Step 3: Implement ProjectCard and Projects**

Create `web/src/components/ProjectCard.tsx`:
```tsx
import type { Project } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';

export function ProjectCard({ project, code }: { project: Project; code: string }) {
  return (
    <article className="proj-card">
      <ImagePlate
        src={urlFor(project.photo)}
        alt={`Site photo — ${project.title}`}
        caption={`Photo pending — ${code}`}
      />
      <div className="proj-body">
        <div className="proj-top">
          <span className="proj-code mono">{code}</span>
          <span className="proj-cat mono">{project.category}</span>
        </div>
        <div className="proj-title">{project.title}</div>
        <div className="proj-meta mono">
          <div><span className="k">Client</span>{project.client}</div>
          <div><span className="k">Location</span>{project.location}</div>
        </div>
      </div>
    </article>
  );
}
```

Create `web/src/components/Projects.tsx`:
```tsx
import type { Project } from '@/lib/types';
import { ProjectCard } from './ProjectCard';
import { RevealGroup } from './RevealGroup';

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects">
      <div className="wrap">
        <div className="sheet-label">Sheet 05 / 08 &mdash; Selected Projects</div>
        {projects.length === 0 ? (
          <p className="mono" style={{ color: 'var(--muted)' }}>Project records are being updated — check back shortly.</p>
        ) : (
          <RevealGroup>
            {projects.map((p, i) => (
              <ProjectCard key={p._id} project={p} code={`P-${String(i + 1).padStart(2, '0')}`} />
            ))}
          </RevealGroup>
        )}
      </div>
    </section>
  );
}
```

Append the `.proj-grid`, `.proj-card` (with hover lift), `.proj-body`, `.proj-title` (with `overflow-wrap: break-word`) CSS ported verbatim from the mockup to `web/src/app/globals.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Projects.tsx web/src/components/ProjectCard.tsx web/src/app/globals.css web/test/components/ProjectCard.test.tsx
git commit -m "feat: add Projects section with real/placeholder photo fallback"
```

---

### Task 14: Gallery

**Files:**
- Create: `web/src/components/Gallery.tsx`
- Test: `web/test/components/Gallery.test.tsx`

**Interfaces:**
- Consumes: `GalleryImage` type (Task 8), `ImagePlate` (Task 6), `urlFor` (Task 8), `RevealGroup` (Task 4).
- Produces: `<Gallery images={GalleryImage[]} />`, consumed by `page.tsx` (Task 16).

- [ ] **Step 1: Write the failing test**

Create `web/test/components/Gallery.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { Gallery } from '@/components/Gallery';

test('renders a caption for each gallery image', () => {
  render(
    <Gallery
      images={[
        { _id: '1', image: {} as any, caption: 'ETP aerial view — Raigarh' },
        { _id: '2', image: {} as any, caption: 'Tank formwork — ETP site' },
      ]}
    />
  );
  expect(screen.getByText('ETP aerial view — Raigarh')).toBeInTheDocument();
  expect(screen.getByText('Tank formwork — ETP site')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `Gallery` doesn't exist.

- [ ] **Step 3: Implement Gallery**

Create `web/src/components/Gallery.tsx`:
```tsx
import type { GalleryImage } from '@/lib/types';
import { ImagePlate } from './ImagePlate';
import { urlFor } from '@/lib/sanity.image';
import { RevealGroup } from './RevealGroup';

export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sheet-label">Sheet 07 / 08 &mdash; Site Gallery</div>
        <RevealGroup>
          {images.map((img) => (
            <ImagePlate key={img._id} src={urlFor(img.image)} alt={img.caption} caption={img.caption} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
```

Append the `.gal-grid` CSS ported verbatim from the mockup to `web/src/app/globals.css`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/components/Gallery.tsx web/src/app/globals.css web/test/components/Gallery.test.tsx
git commit -m "feat: add Site Gallery section"
```

---

### Task 15: Contact section, form, and API route

**Files:**
- Create: `web/src/components/Contact.tsx`, `web/src/components/ContactForm.tsx`, `web/src/app/api/contact/route.ts`
- Test: `web/test/components/ContactForm.test.tsx`, `web/test/api/contact.test.ts`

**Interfaces:**
- Consumes: `SiteSettings` type (Task 8).
- Produces: `<Contact settings={SiteSettings | null} />` consumed by `page.tsx` (Task 16); `POST /api/contact` accepting `{ name, company?, projectType, message, email }` returning `{ ok: true }` (200) or `{ ok: false, error: string }` (400).

- [ ] **Step 1: Write the failing API route test**

Create `web/test/api/contact.test.ts`:
```ts
import { describe, expect, test, vi } from 'vitest';

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({ id: 'test' }) },
  })),
}));

import { POST } from '@/app/api/contact/route';

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });
}

describe('POST /api/contact', () => {
  test('rejects a submission missing required fields', async () => {
    const res = await POST(makeRequest({ name: '', email: '', projectType: '', message: '' }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  test('rejects an email without an @', async () => {
    const res = await POST(makeRequest({ name: 'A', email: 'not-an-email', projectType: 'Other', message: 'Hi' }));
    expect(res.status).toBe(400);
  });

  test('accepts a valid submission', async () => {
    const res = await POST(
      makeRequest({ name: 'Priya', email: 'priya@example.com', projectType: 'Industrial construction', message: 'Please call me.' })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `@/app/api/contact/route` doesn't exist.

- [ ] **Step 3: Install Resend and implement the route**

```bash
cd web
npm install resend
```

Create `web/src/app/api/contact/route.ts`:
```ts
import { Resend } from 'resend';

type ContactBody = {
  name?: string;
  company?: string;
  projectType?: string;
  message?: string;
  email?: string;
};

function validate(body: ContactBody): string | null {
  if (!body.name?.trim()) return 'Name is required.';
  if (!body.email?.includes('@')) return 'A valid email is required.';
  if (!body.projectType?.trim()) return 'Project type is required.';
  if (!body.message?.trim()) return 'Project details are required.';
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;
  const error = validate(body);
  if (error) {
    return Response.json({ ok: false, error }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'RKC Website <onboarding@resend.dev>',
    to: process.env.CONTACT_TO_EMAIL || 'raju2021rgh@gmail.com',
    replyTo: body.email,
    subject: `New inquiry from ${body.name}`,
    text: `Name: ${body.name}\nCompany: ${body.company || '—'}\nProject type: ${body.projectType}\nEmail: ${body.email}\n\n${body.message}`,
  });

  return Response.json({ ok: true });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Write the failing form test**

Create `web/test/components/ContactForm.test.tsx`:
```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/ContactForm';

test('submits the form and shows a confirmation message', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) }) as any;

  render(<ContactForm />);
  await userEvent.type(screen.getByLabelText(/name/i), 'Priya');
  await userEvent.type(screen.getByLabelText(/^email/i), 'priya@example.com');
  await userEvent.type(screen.getByLabelText(/project details/i), 'We need a quote.');
  await userEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

  await waitFor(() => expect(screen.getByText(/thanks/i)).toBeInTheDocument());
});

test('shows the server error message instead of a silent failure', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, error: 'A valid email is required.' }) }) as any;

  render(<ContactForm />);
  await userEvent.type(screen.getByLabelText(/name/i), 'Priya');
  await userEvent.type(screen.getByLabelText(/project details/i), 'We need a quote.');
  await userEvent.click(screen.getByRole('button', { name: /submit inquiry/i }));

  await waitFor(() => expect(screen.getByText('A valid email is required.')).toBeInTheDocument());
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `ContactForm` doesn't exist.

- [ ] **Step 7: Implement ContactForm and Contact**

Create `web/src/components/ContactForm.tsx`:
```tsx
'use client';

import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''),
      company: String(data.get('company') || ''),
      projectType: String(data.get('projectType') || ''),
      message: String(data.get('message') || ''),
      email: String(data.get('email') || ''),
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await res.json();

    if (res.ok && body.ok) {
      setStatus('sent');
    } else {
      setStatus('error');
      setError(body.error || 'Something went wrong. Please try again.');
    }
  }

  if (status === 'sent') {
    return <div id="okmsg">Thanks — your inquiry has been sent. We&apos;ll get back to you shortly.</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="two-col">
        <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" required /></div>
        <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" /></div>
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div className="field">
        <label htmlFor="projectType">Project type</label>
        <select id="projectType" name="projectType">
          <option>Industrial construction</option>
          <option>Infrastructure development</option>
          <option>Water / effluent treatment</option>
          <option>Other</option>
        </select>
      </div>
      <div className="field"><label htmlFor="message">Project details</label><textarea id="message" name="message" required /></div>
      <button className="btn btn-solid" type="submit" style={{ alignSelf: 'flex-start' }}>Submit Inquiry &rarr;</button>
      {status === 'error' && <div id="okmsg" role="alert">{error}</div>}
    </form>
  );
}
```

Create `web/src/components/Contact.tsx`:
```tsx
import type { SiteSettings } from '@/lib/types';
import { ContactForm } from './ContactForm';
import { RevealGroup } from './RevealGroup';

const FALLBACK = {
  address: 'House No. 24, Bhagwanpur Uper Basti, Jindal Road, Raigarh, CG',
  phone: '+91 97524 50852',
  email: 'raju2021rgh@gmail.com',
};

export function Contact({ settings }: { settings: SiteSettings | null }) {
  const s = { ...FALLBACK, ...(settings ?? {}) };
  return (
    <section id="contact" style={{ borderBottom: 'none' }}>
      <div className="wrap">
        <div className="sheet-label">Sheet 08 / 08 &mdash; Contact</div>
        <RevealGroup>
          <div className="contact-info">
            <h2 style={{ fontSize: 'clamp(26px,4vw,36px)', marginBottom: 18 }}>Start a proposal.</h2>
            <div className="row"><span className="k">Address</span><span className="v">{s.address}</span></div>
            <div className="row"><span className="k">Phone</span><span className="v">{s.phone}</span></div>
            <div className="row"><span className="k">Email</span><span className="v">{s.email}</span></div>
          </div>
          <ContactForm />
        </RevealGroup>
      </div>
    </section>
  );
}
```

Append the `.contact-grid`, `.contact-info`, `form`, `.field*`, `.two-col`, `#okmsg` CSS ported verbatim from the mockup to `web/src/app/globals.css`.

- [ ] **Step 8: Run tests to verify they pass**

Run: `npm test`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add web/src/components/Contact.tsx web/src/components/ContactForm.tsx web/src/app/api/contact/route.ts web/src/app/globals.css web/package.json web/package-lock.json web/test/components/ContactForm.test.tsx web/test/api/contact.test.ts
git commit -m "feat: add Contact section with validated, emailed inquiry form"
```

---

### Task 16: Assemble the home page

**Files:**
- Modify: `web/src/app/page.tsx`
- Test: `web/test/app/page.test.tsx` (extends Task 1's test)

**Interfaces:**
- Consumes: every section component (Tasks 10–15) and every `get*` query (Task 8).

- [ ] **Step 1: Extend the failing test**

Replace `web/test/app/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/lib/queries', () => ({
  getProjects: vi.fn().mockResolvedValue([]),
  getClients: vi.fn().mockResolvedValue([]),
  getServices: vi.fn().mockResolvedValue([]),
  getGalleryImages: vi.fn().mockResolvedValue([]),
  getSiteSettings: vi.fn().mockResolvedValue(null),
}));

import Page from '@/app/page';

test('home page renders every section', async () => {
  const ui = await Page();
  render(ui);
  expect(screen.getByText(/R\.K\. Constructions/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  expect(screen.getByText(/Start a proposal/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `page.tsx` is still the Task 1 placeholder.

- [ ] **Step 3: Assemble the page**

Replace `web/src/app/page.tsx`:
```tsx
import { Hero } from '@/components/Hero';
import { Overview } from '@/components/Overview';
import { MissionVision } from '@/components/MissionVision';
import { CoreValues } from '@/components/CoreValues';
import { Services } from '@/components/Services';
import { Projects } from '@/components/Projects';
import { Clients } from '@/components/Clients';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import { getProjects, getClients, getServices, getGalleryImages, getSiteSettings } from '@/lib/queries';

export const revalidate = 60;

export default async function Page() {
  const [projects, clients, services, gallery, settings] = await Promise.all([
    getProjects(),
    getClients(),
    getServices(),
    getGalleryImages(),
    getSiteSettings(),
  ]);

  return (
    <main>
      <Hero />
      <Overview settings={settings} />
      <MissionVision settings={settings} />
      <CoreValues />
      <Services services={services} />
      <Projects projects={projects} />
      <Clients clients={clients} />
      <Gallery images={gallery} />
      <Contact settings={settings} />
    </main>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add web/src/app/page.tsx web/test/app/page.test.tsx
git commit -m "feat: assemble home page from all sections and Sanity data"
```

---

### Task 17: Seed script with curated real ETP photography

**Files:**
- Create: `web/scripts/seed.ts`
- Modify: `web/package.json` (add `"seed"` script)

**Interfaces:**
- Consumes: schema shapes from Task 7, `media/` files at the repo root (one level above `web/`).
- Produces: populated Sanity dataset — 7 `project` docs, 5 `client` docs, 12 `service` docs, `siteSettings` singleton, and gallery images built from curated ETP photos.

- [ ] **Step 1: Photo selection (already curated — no action needed)**

Seven photos from `media/` were reviewed and selected during design/planning:

| File | Use | Caption |
|---|---|---|
| `WhatsApp Image 2026-09-28 at 11.56.37 AM.jpeg` | ETP project featured photo | — |
| `WhatsApp Image 2026-09-28 at 11.57.24 AM.jpeg` | Gallery | Rebar & footing work — ETP site |
| `WhatsApp Image 2026-09-28 at 11.56.44 AM.jpeg` | Gallery | Tank & clarifier formwork — ETP site |
| `WhatsApp Image 2026-09-28 at 11.57.01 AM.jpeg` | Gallery | Site safety briefing — ETP crew |
| `WhatsApp Image 2026-09-28 at 11.56.42 AM.jpeg` | Gallery | Survey & layout marking — ETP site |
| `WhatsApp Image 2026-09-28 at 11.56.51 AM.jpeg` | Gallery | Site overview — ETP plant structure |
| `WhatsApp Image 2026-09-28 at 11.57.00 AM.jpeg` | Gallery | Night concrete pour — ETP site |

These are hardcoded into the seed script in Step 3 below. The remaining ~37 photos and 2 videos stay archived in `media/` unused (spec §6).

- [ ] **Step 2: Install the Sanity CLI client dependency for scripting**

```bash
cd web
npm install -D tsx
```

- [ ] **Step 3: Write the seed script**

Create `web/scripts/seed.ts`:

```ts
import { createClient } from 'next-sanity';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const MEDIA_DIR = resolve(__dirname, '../../media');

const ETP_FEATURED_PHOTO = 'WhatsApp Image 2026-09-28 at 11.56.37 AM.jpeg';
const ETP_GALLERY_FILES = [
  { file: 'WhatsApp Image 2026-09-28 at 11.57.24 AM.jpeg', caption: 'Rebar & footing work — ETP site' },
  { file: 'WhatsApp Image 2026-09-28 at 11.56.44 AM.jpeg', caption: 'Tank & clarifier formwork — ETP site' },
  { file: 'WhatsApp Image 2026-09-28 at 11.57.01 AM.jpeg', caption: 'Site safety briefing — ETP crew' },
  { file: 'WhatsApp Image 2026-09-28 at 11.56.42 AM.jpeg', caption: 'Survey & layout marking — ETP site' },
  { file: 'WhatsApp Image 2026-09-28 at 11.56.51 AM.jpeg', caption: 'Site overview — ETP plant structure' },
  { file: 'WhatsApp Image 2026-09-28 at 11.57.00 AM.jpeg', caption: 'Night concrete pour — ETP site' },
];

async function uploadAsset(filename: string) {
  const buffer = readFileSync(resolve(MEDIA_DIR, filename));
  return client.assets.upload('image', buffer, { filename });
}

const PROJECTS = [
  { title: 'Water Treatment Plant', client: 'Jindal Steel & Power', location: 'Raigarh, CG', category: 'Water Treatment', order: 0 },
  { title: 'Rolling Mill', client: 'Jindal Steel & Power', location: 'Patratu, JH', category: 'Industrial Construction', order: 1 },
  { title: 'PCI Unit', client: 'JSW Steel', location: 'Raigarh, CG', category: 'PCI / Coal Injection', order: 2 },
  { title: 'RCC Road & Drains', client: 'JSW Steel', location: 'Raigarh, CG', category: 'Infrastructure Dev.', order: 3 },
  { title: 'RMHS Feeding Circuit', client: 'Sinter & Pellet Plant', location: 'Raigarh, CG', category: 'Material Handling', order: 4 },
  { title: 'Infrastructure Development', client: 'NTPC', location: 'Lara, Raigarh', category: 'Infrastructure Dev.', order: 5 },
];

const CLIENTS = [
  { name: 'Jindal Steel & Power Ltd.', location: 'Raigarh, CG' },
  { name: 'JSW Steel', location: 'Raigarh, CG' },
  { name: 'Jindal Steel & Power Ltd.', location: 'Patratu, JH' },
  { name: 'NTPC', location: 'Lara, Raigarh' },
  { name: 'HARSCO India Pvt. Ltd.', location: 'Slag processing · Raigarh' },
];

const SERVICES = [
  { name: 'Infrastructure Development', description: 'RCC roads, drains, boundary walls' },
  { name: 'Sinter Plant Construction' },
  { name: 'Blast Furnace Construction' },
  { name: 'PCI Units', description: 'Pulverized coal injection' },
  { name: 'Power Plant Construction' },
  { name: 'Pellet Plant & DRI' },
  { name: 'Water Treatment Plants' },
  { name: 'Effluent Treatment (ETP)', description: 'Incl. Lamella clarifier tanks' },
  { name: 'SAF Area & Bag House', description: 'Road work & store construction' },
  { name: 'Oxygen Plant Flooring', description: 'Cooling tower flooring' },
  { name: 'Rail Forging Road Work' },
  { name: 'RMHS & Material Handling', description: 'Sinter & pellet plant circuits' },
];

async function seed() {
  console.log('Uploading ETP featured photo...');
  const featuredAsset = await uploadAsset(ETP_FEATURED_PHOTO);

  console.log('Creating projects...');
  for (const p of PROJECTS) {
    await client.create({ _type: 'project', ...p });
  }
  await client.create({
    _type: 'project',
    title: 'Effluent Treatment Plant (ETP)',
    client: 'Confidential — industrial client',
    location: 'Raigarh, CG',
    category: 'Effluent Treatment',
    order: 6,
    photo: { _type: 'image', asset: { _type: 'reference', _ref: featuredAsset._id } },
  });

  console.log('Creating clients...');
  for (const c of CLIENTS) {
    await client.create({ _type: 'client', ...c });
  }

  console.log('Creating services...');
  for (const [i, s] of SERVICES.entries()) {
    await client.create({ _type: 'service', ...s, order: i });
  }

  console.log('Uploading gallery photos...');
  for (const { file, caption } of ETP_GALLERY_FILES) {
    const asset = await uploadAsset(file);
    await client.create({
      _type: 'galleryImage',
      caption,
      image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    });
  }

  console.log('Creating site settings...');
  await client.createIfNotExists({
    _id: 'siteSettings',
    _type: 'siteSettings',
    workforceCount: '300+ (variable)',
    engineeringStaffCount: '15+ engineers',
    machineryList: '2 Ajax · 2 JCB · 1 Excavator',
    annualProjectValue: '₹10 Cr+',
    address: 'House No. 24, Bhagwanpur Uper Basti, Jindal Road, Raigarh, CG',
    phone: '+91 97524 50852',
    email: 'raju2021rgh@gmail.com',
  });

  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Add to `web/package.json` `"scripts"`:
```json
"seed": "tsx scripts/seed.ts"
```

- [ ] **Step 4: Run it against a real Sanity project**

This requires `NEXT_PUBLIC_SANITY_PROJECT_ID` and a `SANITY_API_WRITE_TOKEN` (create one with Editor access in manage.sanity.io) set in `web/.env.local`. Run:
```bash
cd web
npm run seed
```
Expected: console logs for each step, ending in "Seed complete." with no thrown errors.

- [ ] **Step 5: Commit**

```bash
git add web/scripts/seed.ts web/package.json web/package-lock.json
git commit -m "feat: add content seed script with curated real ETP photography"
```

---

### Task 18: Deployment config and launch checklist

**Files:**
- Create: `web/README.md`
- Create: `web/vercel.json` (only if any non-default settings are needed — otherwise document that none are)

**Interfaces:** None — this task wires the finished app to real infrastructure and documents it.

- [ ] **Step 1: Create a Sanity project**

Run (from `web/`):
```bash
npx sanity@latest init --project-name "RKC Portfolio" --dataset production
```
Follow the prompts (log in, create the project). Copy the generated project ID into `web/.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`.

- [ ] **Step 2: Create a Sanity write token**

In manage.sanity.io → your project → API → Tokens, create a token with "Editor" permissions. Add it to `web/.env.local` as `SANITY_API_WRITE_TOKEN`.

- [ ] **Step 3: Create a Resend account and API key**

Sign up at resend.com (free tier), create an API key, add it to `web/.env.local` as `RESEND_API_KEY`. Set `CONTACT_TO_EMAIL=raju2021rgh@gmail.com` (or the confirmed destination address from spec §10).

- [ ] **Step 4: Verify locally**

```bash
cd web
npm run dev
```
Visit `http://localhost:3000` — confirm the page renders in dark mode by default, the theme toggle works, and `http://localhost:3000/studio` loads Sanity Studio. Submit the contact form and confirm a real email arrives.

- [ ] **Step 5: Write the README**

Create `web/README.md`:
```markdown
# R.K. Constructions — Portfolio Site

## Local development
1. Copy `.env.example` to `.env.local` and fill in the Sanity project ID,
   dataset, write token, Resend API key, and contact destination email.
2. `npm install`
3. `npm run dev` — site at http://localhost:3000, CMS at http://localhost:3000/studio
4. `npm test` — run the test suite
5. `npm run seed` — one-time: populate Sanity with initial content and the
   curated ETP project photography (requires `SANITY_API_WRITE_TOKEN`)

## Editing content
Non-technical staff log into `/studio` with their Sanity account (Google or
email magic link) and edit Projects, Clients, Services, Gallery Images, and
Site Settings directly — changes go live within a minute (ISR revalidates
every 60 seconds).

## Deployment
1. Push this repo to GitHub.
2. Import it in Vercel, set the project root to `web/`.
3. Add the same environment variables from `.env.local` in the Vercel
   project settings.
4. Deploy. Point your purchased domain at the Vercel deployment (spec §7,
   §10 — domain not yet purchased as of this plan).
```

- [ ] **Step 6: Deploy to Vercel**

```bash
cd web
npx vercel
```
Follow the prompts to link/create the Vercel project, then add the environment variables from `.env.local` in the Vercel dashboard (Project Settings → Environment Variables) and redeploy with `npx vercel --prod`.

- [ ] **Step 7: Run a Lighthouse pass**

In Chrome DevTools on the deployed URL, run Lighthouse (Performance + Accessibility categories). Fix any accessibility errors (contrast, missing labels) before considering the site launch-ready, per spec §8.

- [ ] **Step 8: Commit**

```bash
git add web/README.md
git commit -m "docs: add deployment and content-editing instructions"
```
