'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';
import { sectionHref } from '@/lib/sectionHref';

export function Nav() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  return (
    <header className="nav">
      <div className="wrap">
        <div className="brand">
          <Image className="brand-mark" src="/logo.png" alt="R.K. Constructions logo" width={38} height={38} unoptimized />
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
