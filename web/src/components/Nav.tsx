'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  function sectionHref(id: string) {
    return isHome ? `#${id}` : `/#${id}`;
  }

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
          <a href={sectionHref('overview')}>Overview</a>
          <a href={sectionHref('services')}>Services</a>
          <a href={sectionHref('projects')}>Projects</a>
          <a href={sectionHref('clients')}>Clients</a>
        </nav>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeToggle />
          <a className="btn btn-ghost" href={sectionHref('gallery')}>Site Gallery</a>
          <a className="btn btn-solid" href={sectionHref('contact')}>Request a Proposal</a>
        </div>
      </div>
    </header>
  );
}
