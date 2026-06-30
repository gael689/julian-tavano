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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://juliantavano.com.ar';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';

  const title = isEs
    ? { absolute: 'Julián Tavano | Arquitecto · Diseño, Inversión y Desarrollo en Argentina' }
    : { absolute: 'Julián Tavano | Architect · Design, Investment & Development in Argentina' };
  const description = isEs
    ? 'Arquitecto con base en Monte Hermoso. Proyectos residenciales a medida, viviendas modulares, inversiones en fideicomiso y desarrollos inmobiliarios de gran escala en toda Argentina.'
    : 'Architect based in Monte Hermoso. Custom residential design, modular homes, trust fund investments and large-scale real estate developments across Argentina.';
  const titleStr = isEs
    ? 'Julián Tavano | Arquitecto · Diseño, Inversión y Desarrollo en Argentina'
    : 'Julián Tavano | Architect · Design, Investment & Development in Argentina';

  return {
    title,
    description,
    keywords: isEs
      ? ['Julián Tavano', 'arquitecto Argentina', 'fideicomiso inmobiliario', 'desarrollo inmobiliario', 'inversión en construcción', 'arquitecto Monte Hermoso', 'diseño arquitectónico a medida', 'viviendas modulares Argentina', 'proyectos residenciales Argentina', 'casas prefabricadas']
      : ['Julian Tavano', 'architect Argentina', 'real estate investment', 'real estate development', 'trust fund construction', 'architect Monte Hermoso', 'custom architectural design', 'modular homes Argentina'],
    openGraph: {
      title: titleStr,
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
              text: 'Las viviendas modulares de Julián Tavano se construyen en un galpón y se entregan listas para habitar en aproximadamente 3 meses, sin conflictos de obra en el terreno.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Se pueden trasladar las viviendas prefabricadas a cualquier lugar de Argentina?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sí. Julián Tavano trabaja en toda Argentina. Las viviendas modulares están diseñadas para ser transportadas y asentadas en cualquier terreno del país.',
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
              text: 'Sí. Además de los modelos de casas, Julián Tavano desarrolla proyectos arquitectónicos a medida, inversiones en fideicomiso y desarrollos inmobiliarios de mayor escala.',
            },
          },
          {
            '@type': 'Question',
            name: '¿Dónde trabaja Julián Tavano y qué escala de proyectos maneja?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Julián Tavano tiene base en Monte Hermoso, Buenos Aires, y opera en todo el país. Su trabajo abarca desde viviendas individuales hasta inversiones en fideicomiso, desarrollos inmobiliarios y proyectos de gran escala con más de 50 obras ejecutadas.',
            },
          },
        ]
      : [
          {
            '@type': 'Question',
            name: 'How long does it take to build a modular home?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Julián Tavano\'s modular homes are built off-site in a workshop and delivered move-in ready in approximately 3 months, with zero on-site disruption.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can the prefabricated homes be shipped anywhere in Argentina?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. Julián Tavano works across Argentina. The modular homes are designed to be transported and installed on any plot of land in the country.',
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
              text: 'Yes. Beyond house models, Julián Tavano develops fully custom architectural projects, real estate investments through trust funds, and large-scale developments.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where does Julián Tavano work and what scale of projects does he handle?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Julián Tavano is based in Monte Hermoso, Buenos Aires, and operates across Argentina. His work ranges from individual homes to trust fund investments, real estate developments and large-scale projects, with over 50 completed works.',
            },
          },
        ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isEs ? 'Modelos de Casas — Julián Tavano' : 'House Models — Julián Tavano',
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
