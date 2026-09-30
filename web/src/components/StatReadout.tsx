'use client';

import { useEffect, useState } from 'react';
import { formatCount } from '@/lib/countUp';

export type Stat = { target: number; prefix?: string; suffix?: string; label: string };

function Cell({ stat }: { stat: Stat }) {
  // Starts at the final value so SSR output (and the first client render,
  // before this effect runs) always shows the real number — never a zero
  // a no-JS visitor or crawler would be stuck with.
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    setProgress(0);
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
