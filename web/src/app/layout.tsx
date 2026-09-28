import './globals.css';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
