export type Inversion = {
  id: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  detalle: string;
  estado: string;
  entrega?: string;
  pdf?: string;
};

/** Fallback usado mientras no haya credenciales de Supabase. */
export const INVERSIONES: Inversion[] = [
  {
    id: 'los-aromos',
    nombre: 'Los Aromos',
    tipo: 'Fideicomiso',
    ubicacion: 'Monte Hermoso',
    detalle: '6 duplex · 70 m² c/u · a 150 m de la playa',
    estado: 'En desarrollo',
    entrega: 'Dic. 2026',
    pdf: '/inversiones/fideicomiso-los-aromos-2026.pdf',
  },
];
