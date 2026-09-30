'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { sectionHref } from '@/lib/sectionHref';

const HIDE_THRESHOLD = 80;

export function Nav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  // Hide the nav while scrolling down (past the top of the page), show it
  // again as soon as the visitor scrolls up — keeps content in view without
  // losing quick access back to navigation.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let ticking = false;

    function update() {
      const currentY = window.scrollY;
      if (currentY <= HIDE_THRESHOLD) {
        setHidden(false);
      } else {
        setHidden(currentY > lastScrollY.current);
      }
      lastScrollY.current = currentY;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={hidden ? 'nav nav--hidden' : 'nav'}>
      <div className="wrap">
        <div className="brand">
          <Image className="brand-mark" src="/logo.png" alt="R.K. Constructions logo" width={62} height={62} unoptimized />
          <div className="brand-text">
            <div className="name">R.K. Constructions</div>
            <div className="tag">Infra &middot; Engineering &middot; Dev.</div>
          </div>
        </div>
        <nav className="nav-links">
          <a href={sectionHref(pathname, 'overview')}>Overview</a>
          <a href={sectionHref(pathname, 'services')}>Services</a>
          <a href={sectionHref(pathname, 'projects')}>Projects</a>
          <a href={sectionHref(pathname, 'clients')}>Clients</a>
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle />
          <a className="btn btn-ghost" href={sectionHref(pathname, 'gallery')}>Site Gallery</a>
          <a className="btn btn-solid" href={sectionHref(pathname, 'contact')}>Request a Proposal</a>
        </div>
      </div>
    </header>
  );
}
