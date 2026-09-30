'use client';

import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactElement } from 'react';

export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Always false on both server and client's first render — the server has
  // no IntersectionObserver at all, so branching on it here (as the very
  // first version of this component did) made the client's initial render
  // disagree with the server's, which React flags as an unrecoverable
  // hydration mismatch. Environment-dependent behavior belongs in the
  // effect below, which only ever runs on the client, after hydration.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !ref.current) {
      setInView(true);
      return;
    }
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

  const wrapperClass = `reveal${inView ? ' in-view' : ''}${className ? ` ${className}` : ''}`;

  return (
    <div ref={ref} className={wrapperClass}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ style?: React.CSSProperties }>;
        return cloneElement(el, {
          style: { ...el.props.style, ['--i' as string]: i },
        });
      })}
    </div>
  );
}
