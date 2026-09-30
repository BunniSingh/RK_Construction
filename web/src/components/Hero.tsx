<<<<<<< HEAD
=======
'use client';

import { useEffect, useRef, useState } from 'react';
>>>>>>> main
import { StatReadout, type Stat } from './StatReadout';

const STATS: Stat[] = [
  { target: 10, suffix: '+', label: 'Years in operation' },
  { target: 10, prefix: '₹', suffix: 'Cr+', label: 'Annual project value' },
  { target: 300, suffix: '+', label: 'Workforce on site' },
  { target: 15, suffix: '+', label: 'Engineering staff' },
];

<<<<<<< HEAD
export function Hero() {
=======
const HEADLINE_PREFIX = 'We build ';
const HEADLINE_PHRASES = [
  'the backbone of industry.',
  'so the plant starts on time.',
  'with strength & precision.',
  'strong. We build smart.',
  'fast, right, and built to last.',
  'what heavy industry needs.',
  "where failure isn't an option.",
  'on a decade of experience.',
];

const DESKTOP_QUERY = '(min-width: 1024px)';
const MAX_FONT = 72;
const MIN_FONT = 24;
const TYPE_MS = 45;
const DELETE_MS = 28;
const HOLD_MS = 1700;

export function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(HEADLINE_PHRASES[0]);

  // Typewriter cycle: holds on a full phrase, deletes it, types the next.
  // Starts already holding phrase 0 so first paint (and no-JS/SSR) shows real copy.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      let i = 0;
      const id = setInterval(() => {
        i = (i + 1) % HEADLINE_PHRASES.length;
        setDisplay(HEADLINE_PHRASES[i]);
      }, HOLD_MS + 900);
      return () => clearInterval(id);
    }

    let phraseIndex = 0;
    let charIndex = HEADLINE_PHRASES[0].length;
    let mode: 'holding' | 'deleting' | 'typing' = 'holding';
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      const phrase = HEADLINE_PHRASES[phraseIndex];
      if (mode === 'holding') {
        mode = 'deleting';
        timeoutId = setTimeout(tick, HOLD_MS);
        return;
      }
      if (mode === 'deleting') {
        charIndex--;
        setDisplay(phrase.slice(0, charIndex));
        if (charIndex <= 0) {
          phraseIndex = (phraseIndex + 1) % HEADLINE_PHRASES.length;
          mode = 'typing';
          charIndex = 0;
        }
        timeoutId = setTimeout(tick, DELETE_MS);
        return;
      }
      const next = HEADLINE_PHRASES[phraseIndex];
      charIndex++;
      setDisplay(next.slice(0, charIndex));
      if (charIndex >= next.length) {
        mode = 'holding';
        timeoutId = setTimeout(tick, HOLD_MS);
        return;
      }
      timeoutId = setTimeout(tick, TYPE_MS);
    }

    timeoutId = setTimeout(tick, HOLD_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  // Desktop/laptop: shrink to a fixed size (sized to the longest phrase) so the
  // heading always fits one line without resizing as the phrase changes.
  useEffect(() => {
    const heading = headingRef.current;
    const measure = measureRef.current;
    if (!heading || !measure) return;
    const mq = window.matchMedia(DESKTOP_QUERY);

    function fitOneLine() {
      if (!heading || !measure) return;
      if (!mq.matches) {
        heading.style.fontSize = '';
        heading.style.whiteSpace = '';
        return;
      }
      heading.style.whiteSpace = 'nowrap';
      const container = heading.parentElement;
      const available = container ? container.clientWidth : heading.clientWidth;

      function longestWidth(size: number) {
        measure!.style.fontSize = `${size}px`;
        let max = 0;
        for (const phrase of HEADLINE_PHRASES) {
          measure!.textContent = HEADLINE_PREFIX + phrase;
          max = Math.max(max, measure!.scrollWidth);
        }
        return max;
      }

      let size = MAX_FONT;
      while (size > MIN_FONT && longestWidth(size) > available) {
        size -= 1;
      }
      heading.style.fontSize = `${size}px`;
    }

    fitOneLine();
    window.addEventListener('resize', fitOneLine);
    mq.addEventListener('change', fitOneLine);
    document.fonts?.ready.then(fitOneLine);
    return () => {
      window.removeEventListener('resize', fitOneLine);
      mq.removeEventListener('change', fitOneLine);
    };
  }, []);

>>>>>>> main
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="eyebrow">Raigarh, Chhattisgarh &middot; Est. one decade in industrial construction</span>
<<<<<<< HEAD
          <h1>We build what <span>steel</span> runs on.</h1>
=======
          <h1 ref={headingRef} aria-label={`${HEADLINE_PREFIX}${HEADLINE_PHRASES[0]}`}>
            <span aria-hidden="true">
              <span className="headline-static">{HEADLINE_PREFIX}</span>
              <span className="headline-rotate">{display}</span>
              <span className="headline-cursor" />
            </span>
          </h1>
          <span ref={measureRef} className="headline-measure" aria-hidden="true" />
>>>>>>> main
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
