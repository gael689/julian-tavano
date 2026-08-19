import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Julián Tavano Arquitecto',
  description: 'Arquitecto con base en Monte Hermoso. Diseño residencial, inversiones inmobiliarias, fideicomiso y desarrollos a gran escala en toda Argentina.',
};

// Root layout just delegates to the localized layouts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
