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
