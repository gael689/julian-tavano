import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Julián Tavano Arquitecto',
    short_name: 'Julián Tavano',
    description: 'Arquitecto con base en Monte Hermoso. Diseño residencial, inversiones inmobiliarias y desarrollos a gran escala en Argentina.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F0E8',
    theme_color: '#3A4A2A',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
