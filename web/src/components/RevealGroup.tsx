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
