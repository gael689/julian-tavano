import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JT Arquitectura',
  description: 'Viviendas modulares en armonía con la naturaleza',
};

// Root layout just delegates to the localized layouts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
