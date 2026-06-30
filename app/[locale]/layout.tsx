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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://juliantavano.com.ar';

const COPY = {
  es: {
    title: 'Julián Tavano | Arquitecto · Argentina',
    description:
      'Arquitecto en Monte Hermoso. Diseño residencial, viviendas modulares, inversiones en fideicomiso y desarrollos inmobiliarios en Argentina.',
    ogLocale: 'es_AR',
    ogAlt: 'Julián Tavano Arquitecto — Proyectos en toda Argentina',
  },
  en: {
    title: 'Julián Tavano | Architect · Argentina',
    description:
      'Architect in Monte Hermoso. Residential design, modular homes, trust fund investments and real estate developments across Argentina.',
    ogLocale: 'en_US',
    ogAlt: 'Julián Tavano Architect — Projects across Argentina',
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
      template: `%s | Julián Tavano`,
    },
    description: c.description,
    openGraph: {
      type: 'website',
      locale: c.ogLocale,
      alternateLocale: lang === 'es' ? ['en_US'] : ['es_AR'],
      siteName: 'Julián Tavano Arquitecto',
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
    icons: {
      icon: [{ url: '/logo.png', type: 'image/png' }],
      apple: '/logo.png',
      shortcut: '/logo.png',
    },
    other: {
      'geo.region': 'AR-B',
      'geo.placename': 'Monte Hermoso, Buenos Aires, Argentina',
      'geo.position': '-38.9833;-61.3000',
      'ICBM': '-38.9833, -61.3000',
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
  name: 'Julián Tavano Arquitecto',
  alternateName: ['Julián Tavano', 'JT Arquitectura'],
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/about-image.png`,
  description:
    'Arquitecto con base en Monte Hermoso. Proyectos residenciales a medida, viviendas modulares prefabricadas, inversiones en fideicomiso y desarrollos inmobiliarios de gran escala en toda Argentina.',
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
    { '@type': 'City', name: 'Buenos Aires' },
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
    'Diseño arquitectónico a medida',
    'Viviendas modulares prefabricadas',
    'Inversión inmobiliaria en fideicomiso',
    'Desarrollo inmobiliario',
    'Proyectos de gran escala',
  ],
  priceRange: '$$$',
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
