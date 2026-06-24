import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import LetterboxIntro from '@/components/ui/LetterboxIntro';
import StickyFadeWrapper from '@/components/ui/StickyFadeWrapper';
import DarkenOnScrollOut from '@/components/ui/DarkenOnScrollOut';
import Prototipos from '@/components/sections/Prototipos';
import ObrasTeaser from '@/components/sections/ObrasTeaser';
import CustomProjects from '@/components/sections/CustomProjects';
import Inversion from '@/components/sections/Inversion';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import JsonLd from '@/components/seo/JsonLd';
import { PROTOTIPOS_DATA } from '@/lib/data/prototipos';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jtarquitectura.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';

  const title = isEs
    ? 'Inicio — Viviendas modulares y proyectos a medida'
    : 'Home — Modular homes and custom architectural design';
  const description = isEs
    ? 'Descubrí los modelos de casas de JT Arquitectura: cabañas y casas prefabricadas listas en 3 meses. También proyectos a medida en Monte Hermoso y toda Argentina.'
    : 'Explore JT Architecture\'s house models: prefabricated cabins and houses ready in 3 months. Custom design projects across Argentina.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: isEs ? SITE_URL : `${SITE_URL}/en`,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEs = locale !== 'en';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: isEs
      ? [
          {
            '@type': 'Question',
            name: '¿Cuánto tiempo demora la construcción de una vivienda modular?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Las viviendas modulares de JT Arquitectura se construyen en un galpón y se entregan listas para habitar en aproximadamente 3 meses, sin conflictos de obra en el terreno.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Se pueden trasladar las viviendas prefabricadas a cualquier lugar de Argentina?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. JT Arquitectura realiza el traslado a todo Argentina. Las viviendas modulares están diseñadas para ser transportadas y asentadas en cualquier terreno.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué incluye la construcción completa?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La construcción completa incluye materiales de primera calidad, instalaciones completas de agua, cloaca, electricidad y artefactos, entrega lista para habitar y traslado al destino.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Es posible hacer un proyecto arquitectónico a medida?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. Además de los modelos de casas, JT Arquitectura ofrece diseño arquitectónico a medida respetando las condiciones del terreno, el entorno y los requerimientos del cliente.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Dónde está ubicado el estudio de JT Arquitectura?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'El estudio está basado en Monte Hermoso, provincia de Buenos Aires, Argentina, con más de 50 obras ejecutadas en la costa atlántica y otras zonas del país.',
            },
          },
        ]
      : [
          {
            '@type': 'Question',
            name: 'How long does it take to build a modular home?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'JT Architecture modular homes are built off-site in a workshop and delivered move-in ready in approximately 3 months, with zero on-site disruption.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can the prefabricated homes be shipped anywhere in Argentina?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. JT Architecture ships to any location across Argentina. The modular homes are designed to be transported and installed on any plot of land.',
            },
          },
          {
            '@type': 'Question',
            name: 'What does the full construction service include?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The full construction service includes premium quality materials, complete utilities (water, sewage, electricity and fixtures), a move-in ready delivery, and shipping to the destination.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is it possible to commission a custom architectural project?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. In addition to house models, JT Architecture offers custom architectural design tailored to the land, surroundings, and client requirements.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where is JT Architecture studio located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The studio is based in Monte Hermoso, Buenos Aires Province, Argentina, with over 50 completed works along the Atlantic coast and other regions of the country.',
            },
          },
        ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isEs ? 'Modelos de Casas — JT Arquitectura' : 'House Models — JT Architecture',
    itemListElement: PROTOTIPOS_DATA.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.type === 'casa' ? (isEs ? 'Casa' : 'House') : (isEs ? 'Cabaña' : 'Cabin')} ${p.name}`,
      url: `${SITE_URL}${isEs ? '' : '/en'}/modelos/${p.id}`,
      description: isEs ? p.description.es : p.description.en,
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={itemListSchema} />
      <LetterboxIntro />
      <StickyFadeWrapper>
        <Hero />
      </StickyFadeWrapper>
      <DarkenOnScrollOut startAt={0.68}>
        <Prototipos />
      </DarkenOnScrollOut>
      <ObrasTeaser />
      <DarkenOnScrollOut variant="lighten">
        <CustomProjects />
      </DarkenOnScrollOut>
      <Inversion />
      <DarkenOnScrollOut startAt={0.35}>
        <About />
      </DarkenOnScrollOut>
      <Contact />
    </>
  );
}
