import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JT Arquitectura',
    short_name: 'JT Arq.',
    description: 'Estudio de arquitectura en Monte Hermoso. Viviendas modulares y proyectos a medida.',
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
