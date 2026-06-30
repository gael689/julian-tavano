import { MetadataRoute } from 'next';
import { PROTOTIPOS_DATA } from '@/lib/data/prototipos';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://juliantavano.com.ar';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface RouteConfig {
  es: string;
  en: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: RouteConfig[] = [
    { es: '/',       en: '/en',       priority: 1.0, changeFrequency: 'monthly'  },
    { es: '/obras',  en: '/en/obras', priority: 0.8, changeFrequency: 'monthly'  },
  ];

  const protoRoutes: RouteConfig[] = PROTOTIPOS_DATA.map((p) => ({
    es: `/modelos/${p.id}`,
    en: `/en/modelos/${p.id}`,
    priority: 0.9,
    changeFrequency: 'monthly',
  }));

  const now = new Date();

  return [...staticRoutes, ...protoRoutes].flatMap(({ es, en, priority, changeFrequency }) => [
    {
      url: `${SITE_URL}${es}`,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          es: `${SITE_URL}${es}`,
          en: `${SITE_URL}${en}`,
        },
      },
    },
    {
      url: `${SITE_URL}${en}`,
      lastModified: now,
      changeFrequency,
      priority: +(priority - 0.05).toFixed(2),
      alternates: {
        languages: {
          es: `${SITE_URL}${es}`,
          en: `${SITE_URL}${en}`,
        },
      },
    },
  ]);
}
