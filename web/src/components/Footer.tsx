'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { SiteSettings } from '@/lib/types';
import { sectionHref } from '@/lib/sectionHref';

const FALLBACK = {
  address: 'House No. 24, Bhagwanpur Uper Basti, Jindal Road, Raigarh, CG',
  phone: '+91 97524 50852',
  email: 'raju2021rgh@gmail.com',
};

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const s = { ...FALLBACK, ...(settings ?? {}) };
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-col footer-brand">
          <div className="brand">
            <Image className="brand-mark" src="/logo.png" alt="R.K. Constructions logo" width={62} height={62} unoptimized />
            <div className="brand-text">
              <div className="name">R.K. Constructions</div>
              <div className="tag">Infra &middot; Engineering &middot; Dev.</div>
            </div>
          </div>
          <p className="footer-blurb">
            Industrial and infrastructure construction serving steel plants, power plants, and heavy industry across Raigarh, Chhattisgarh.
          </p>
          <a className="btn btn-ghost footer-pdf" href="/rkc-company-profile.pdf" target="_blank" rel="noopener noreferrer">
            Download Company Profile (PDF)
          </a>
        </div>

        <div className="footer-col">
          <div className="footer-heading">Quick Links</div>
          <nav className="footer-links">
            <a href={sectionHref(pathname, 'overview')}>Overview</a>
            <a href={sectionHref(pathname, 'services')}>Services</a>
            <a href={sectionHref(pathname, 'projects')}>Projects</a>
            <a href={sectionHref(pathname, 'clients')}>Clients</a>
            <a href={sectionHref(pathname, 'gallery')}>Site Gallery</a>
            <a href={sectionHref(pathname, 'contact')}>Contact</a>
          </nav>
        </div>

        <div className="footer-col">
          <div className="footer-heading">Contact</div>
          <div className="footer-contact mono">
            <div>{s.address}</div>
            <div>{s.phone}</div>
            <div>{s.email}</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="wrap">
          <span>&copy; {year} R.K. Constructions &mdash; Infrastructure, Engineering &amp; Development</span>
        </div>
      </div>
    </footer>
  );
}
