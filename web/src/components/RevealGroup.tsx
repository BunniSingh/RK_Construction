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
