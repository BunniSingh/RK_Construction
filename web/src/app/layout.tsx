import './globals.css';
import { SiteChrome } from '@/components/SiteChrome';
import { getSiteSettings } from '@/lib/queries';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'R.K. Constructions',
  description: 'Industrial and infrastructure construction, Raigarh, Chhattisgarh.',
};

const THEME_INIT = `
try {
  var saved = localStorage.getItem('rkc-theme');
  if (saved === 'light' || saved === 'dark') {
    document.documentElement.setAttribute('data-theme', saved);
  }
} catch (e) {}
`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <SiteChrome settings={settings}>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
