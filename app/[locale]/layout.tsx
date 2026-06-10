import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/routing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider';
import JsonLd from '@/components/seo/JsonLd';
import { Montserrat } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jtarquitectura.com';

const COPY = {
  es: {
    title: 'JT Arquitectura | Julián Tavano — Monte Hermoso',
    description:
      'Estudio de arquitectura en Monte Hermoso, Argentina. Viviendas modulares prefabricadas y proyectos a medida. Más de 50 obras construidas en la costa atlántica.',
    ogLocale: 'es_AR',
    ogAlt: 'JT Arquitectura — Viviendas en armonía con la naturaleza',
  },
  en: {
    title: 'JT Architecture | Julián Tavano — Monte Hermoso',
    description:
      'Architecture studio in Monte Hermoso, Argentina. Prefabricated modular homes and custom architectural design. Over 50 completed works on the Atlantic coast.',
    ogLocale: 'en_US',
    ogAlt: 'JT Architecture — Homes in harmony with nature',
  },
} as const;

export function generateStaticParams() {
  return routing.locales.map((locale: string) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const c = COPY[lang];
  const canonical = lang === 'es' ? SITE_URL : `${SITE_URL}/en`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: c.title,
      template: `%s | JT Arquitectura`,
    },
    description: c.description,
    openGraph: {
      type: 'website',
      locale: c.ogLocale,
      alternateLocale: lang === 'es' ? ['en_US'] : ['es_AR'],
      siteName: 'JT Arquitectura',
      title: c.title,
      description: c.description,
      url: canonical,
      images: [
        {
          url: '/about-image.png',
          width: 1200,
          height: 630,
          alt: c.ogAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.description,
      images: ['/about-image.png'],
    },
    alternates: {
      canonical,
      languages: {
        es: SITE_URL,
        en: `${SITE_URL}/en`,
        'x-default': SITE_URL,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#3A4A2A',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE_URL}/#organization`,
  name: 'JT Arquitectura',
  alternateName: 'Julián Tavano Arquitectura',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/about-image.png`,
  description:
    'Estudio de arquitectura especializado en viviendas modulares prefabricadas y proyectos a medida. Más de 50 obras construidas en Monte Hermoso y la costa atlántica argentina.',
  founder: {
    '@type': 'Person',
    name: 'Julián Tavano',
    jobTitle: 'Arquitecto',
    url: SITE_URL,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Monte Hermoso',
    addressRegion: 'Buenos Aires',
    addressCountry: 'AR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -38.9833,
    longitude: -61.3,
  },
  areaServed: [
    { '@type': 'Country', name: 'Argentina' },
    { '@type': 'City', name: 'Monte Hermoso' },
    { '@type': 'Place', name: 'Costa Atlántica Argentina' },
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+54-9-2494-246878',
    availableLanguage: ['Spanish', 'English'],
  },
  sameAs: [],
  serviceType: [
    'Arquitectura residencial',
    'Viviendas modulares prefabricadas',
    'Diseño arquitectónico a medida',
    'Construcción en galpón',
  ],
  priceRange: '$$',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${montserrat.variable} font-body font-[200] antialiased`}>
        <JsonLd data={organizationSchema} />
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <Navigation />
            <main>{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
