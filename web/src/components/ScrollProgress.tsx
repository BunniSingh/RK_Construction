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
