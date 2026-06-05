import type { Metadata } from 'next';
import ObrasClient from '@/components/map/ObrasClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jtarquitectura.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale !== 'en';

  const title = isEs
    ? 'Obras — Mapa de proyectos construidos'
    : 'Works — Map of completed projects';
  const description = isEs
    ? 'Explorá el mapa interactivo con más de 50 obras construidas por JT Arquitectura en Monte Hermoso, Balneario Sauce Grande y la costa atlántica argentina.'
    : 'Explore the interactive map featuring over 50 projects built by JT Architecture in Monte Hermoso, Balneario Sauce Grande and the Argentine Atlantic coast.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: isEs ? `${SITE_URL}/obras` : `${SITE_URL}/en/obras`,
    },
    alternates: {
      canonical: isEs ? `${SITE_URL}/obras` : `${SITE_URL}/en/obras`,
      languages: {
        es: `${SITE_URL}/obras`,
        en: `${SITE_URL}/en/obras`,
      },
    },
  };
}

export default function ObrasPage() {
  return <ObrasClient />;
}
