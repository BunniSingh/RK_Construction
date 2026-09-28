'use client';

import { usePathname } from 'next/navigation';
import type { SiteSettings } from '@/lib/types';
import { sectionHref } from '@/lib/sectionHref';

const FALLBACK_PHONE = '+91 97524 50852';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function MobileActionBar({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const digits = digitsOnly(settings?.phone || FALLBACK_PHONE);

  return (
    <nav className="mobile-actionbar" aria-label="Quick contact">
      <a className="mab-btn" href={`tel:+${digits}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Call
      </a>
      <a className="mab-btn" href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-4.2-1.12L3 20l1.14-5.14A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3a8.5 8.5 0 0 1 8.5 8.5" />
          <path d="M8.5 9.5c.2 3 2.8 5.6 5.8 5.8.7.04 1.4-.02 1.7-.66.2-.42.2-1.36-.06-1.6-.33-.3-1.6-.9-1.86-.98-.26-.08-.45-.12-.64.12-.2.24-.72.9-.88 1.08-.16.18-.32.2-.6.06a6.6 6.6 0 0 1-3.28-3.3c-.14-.28-.12-.44.06-.6.16-.16.36-.4.54-.6.18-.2.18-.36.28-.6.1-.24 0-.44-.06-.6-.06-.2-.6-1.46-.84-2-.2-.5-.42-.44-.6-.44h-.5c-.18 0-.46.06-.7.3-.24.24-.9.86-.9 2.1" />
        </svg>
        WhatsApp
      </a>
      <a className="mab-btn mab-btn--solid" href={sectionHref(pathname, 'contact')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2 11 13" />
          <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
        </svg>
        Proposal
      </a>
    </nav>
  );
}
