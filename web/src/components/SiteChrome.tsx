'use client';

import { usePathname } from 'next/navigation';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { ScrollProgress } from './ScrollProgress';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
