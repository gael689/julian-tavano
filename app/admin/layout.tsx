import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Panel · Julián Tavano',
  robots: { index: false, follow: false, nocache: true },
};

/**
 * El panel vive fuera de `[locale]`: es sólo en español y no necesita
 * el smooth-scroll ni el resto del chrome del sitio público.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-body bg-[#F7F5F0] text-charcoal antialiased`}>
        {children}
      </body>
    </html>
  );
}
