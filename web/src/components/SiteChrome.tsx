'use client';

import { usePathname } from 'next/navigation';
import type { SiteSettings } from '@/lib/types';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { MobileActionBar } from './MobileActionBar';
import { ScrollProgress } from './ScrollProgress';

export function SiteChrome({ children, settings }: { children: React.ReactNode; settings: SiteSettings | null }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Nav />
      <div key={pathname} className="page-fade">
        {children}
      </div>
      <Footer settings={settings} />
      <MobileActionBar settings={settings} />
    </>
  );
}
