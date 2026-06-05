import { notFound } from 'next/navigation';
import { CheckIcon } from '@heroicons/react/24/outline';
import { HomeIcon, SunIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { getTranslations } from 'next-intl/server';
import { PROTOTIPOS_DATA } from '@/lib/data/prototipos';
import { Metadata } from 'next';
import ProtoHeroSection from '@/components/proto/ProtoHeroSection';
import ServiceTabs from '@/components/proto/ServiceTabs';
import ProtoGallery from '@/components/proto/ProtoGallery';
import ScrollReset from '@/components/proto/ScrollReset';
import JsonLd from '@/components/seo/JsonLd';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jtarquitectura.com';

export function generateStaticParams() {
  return PROTOTIPOS_DATA.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const proto = PROTOTIPOS_DATA.find((p) => p.id === slug);
  if (!proto) return {};
  const t = await getTranslations({ locale, namespace: 'protoPage' });
  const lang = (locale === 'en' ? 'en' : 'es') as 'es' | 'en';
  const typeLabel = proto.type === 'casa' ? t('type_casa') : t('type_cabana');
  const title = `${typeLabel} ${proto.name}`;
  const description = proto.description[lang] ?? proto.description.es;
  const canonical = `${SITE_URL}${locale === 'en' ? '/en' : ''}/prototipos/${proto.id}`;
  const ogImage = `${SITE_URL}${proto.images[0].src}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: ogImage, width: 1200, height: 800, alt: proto.images[0].alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
      languages: {
        es: `${SITE_URL}/prototipos/${proto.id}`,
        en: `${SITE_URL}/en/prototipos/${proto.id}`,
      },
    },
  };
}

export default async function PrototipoPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug, locale } = await params;
  const proto = PROTOTIPOS_DATA.find((p) => p.id === slug);
  const lang  = locale as 'es' | 'en';

  if (!proto) notFound();

  const t       = await getTranslations({ locale, namespace: 'protoPage' });
  const tagline = proto.tagline[lang] ?? proto.tagline.es;
  const desc    = proto.description[lang] ?? proto.description.es;
  const images  = proto.images;
  const typeLabel = proto.type === 'casa' ? t('type_casa') : t('type_cabana');
  const wa      = `https://wa.me/5492494246878?text=${encodeURIComponent(`Hola Julián, me interesa la ${typeLabel} ${proto.name}`)}`;

  const SPECS = [
    { value: proto.specs.coveredArea,     unit: 'm²', label: t('specs.cubiertos')     },
    ...(proto.specs.semiCoveredArea
      ? [{ value: proto.specs.semiCoveredArea, unit: 'm²', label: t('specs.semicubiertos') }]
      : []),
    { value: proto.specs.bedrooms,        unit: '',   label: t('specs.habitacion')    },
    { value: proto.specs.bathrooms,       unit: '',   label: t('specs.bano')          },
  ];

  const USE_CASES = [
    { Icon: SunIcon,                label: t('uso.descanso')  },
    { Icon: HomeIcon,               label: t('uso.vivienda')  },
    { Icon: BuildingStorefrontIcon, label: t('uso.alquiler')  },
  ];

  const pageUrl = `${SITE_URL}${lang === 'en' ? '/en' : ''}/prototipos/${proto.id}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'JT Arquitectura', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: lang === 'en' ? 'Prototypes' : 'Prototipos', item: `${SITE_URL}${lang === 'en' ? '/en' : ''}/#prototipos` },
      { '@type': 'ListItem', position: 3, name: `${typeLabel} ${proto.name}`, item: pageUrl },
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${typeLabel} ${proto.name} — JT Arquitectura`,
    description: desc,
    url: pageUrl,
    image: proto.images.map((img) => `${SITE_URL}${img.src}`),
    brand: { '@type': 'Brand', name: 'JT Arquitectura' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'ARS',
      seller: { '@type': 'Organization', name: 'JT Arquitectura', url: SITE_URL },
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: lang === 'en' ? 'Covered area' : 'Superficie cubierta', value: `${proto.specs.coveredArea} m²` },
      ...(proto.specs.semiCoveredArea
        ? [{ '@type': 'PropertyValue', name: lang === 'en' ? 'Semi-covered area' : 'Superficie semicubierta', value: `${proto.specs.semiCoveredArea} m²` }]
        : []),
      { '@type': 'PropertyValue', name: lang === 'en' ? 'Bedrooms' : 'Habitaciones', value: String(proto.specs.bedrooms) },
      { '@type': 'PropertyValue', name: lang === 'en' ? 'Bathrooms' : 'Baños', value: String(proto.specs.bathrooms) },
    ],
  };

  return (
    <article className="bg-cream min-h-screen">

      <ScrollReset />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />

      {/* ── CINEMATIC HERO (split) ───────────────────────── */}
      <ProtoHeroSection
        label={typeLabel}
        name={proto.name}
        tagline={tagline}
        heroImage={images[0]}
        specs={SPECS}
      />

      {/* ── MAIN CONTENT ─────────────────────────────────── */}
      <div id="descripcion" className="container-layout py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Left: description + uso */}
          <div className="lg:col-span-7">
            <p className="text-eyebrow text-olive mb-3">{t('descripcion')}</p>
            <p className="text-body-l text-charcoal/70 leading-relaxed mb-10">{desc}</p>

            {/* Casos de uso */}
            <div className="flex flex-wrap gap-3 mb-12">
              {USE_CASES.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 border border-charcoal/12 px-4 py-2.5 text-sm text-charcoal/65">
                  <Icon className="w-4 h-4 text-olive shrink-0" strokeWidth={1.5} />
                  {label}
                </div>
              ))}
            </div>

            {/* Características */}
            <p className="text-eyebrow text-olive mb-5">{t('caracteristicas')}</p>
            <ul className="flex flex-col gap-4">
              {([0, 1, 2] as const).map((i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-charcoal/70 leading-relaxed">
                  <CheckIcon className="w-4 h-4 text-olive shrink-0 mt-0.5" strokeWidth={2.5} />
                  {t(`highlights.${i}`)}
                </li>
              ))}
            </ul>

            {/* Distribución */}
            <div className="mt-10 p-6 bg-charcoal/[0.04] border-l-2 border-olive">
              <p className="text-xs text-charcoal/45 uppercase tracking-widest font-bold mb-2">{t('distribucion')}</p>
              <p className="text-charcoal/80 text-sm leading-relaxed">{proto.specs.features[lang]}</p>
            </div>
          </div>

          {/* Right: service tabs + CTAs */}
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <p className="text-eyebrow text-olive mb-5">{t('servicio')}</p>
              <ServiceTabs wa={wa} />
            </div>
          </div>

        </div>
      </div>

      {/* ── CINEMATIC GALLERY ────────────────────────────── */}
      <ProtoGallery images={images} />

      {/* ── BOTTOM CTA ───────────────────────────────────── */}
      <div className="bg-charcoal">
        <div className="container-layout py-16 md:py-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">
            <div className="max-w-2xl">
              <p className="text-eyebrow text-olive mb-4">{t('siguiente_paso')}</p>
              <h2
                className="text-cream font-bold leading-tight"
                style={{
                  fontFamily: "'Century Gothic', Futura, sans-serif",
                  fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
                }}
              >
                {t('cta_title')}
              </h2>
            </div>

            <div className="shrink-0">
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-olive text-cream text-sm font-bold tracking-widest hover:bg-olive-deep transition-colors whitespace-nowrap"
              >
                {t('cta_wa')}
              </a>
            </div>
          </div>
        </div>
      </div>

    </article>
  );
}
