/**
 * Tipos de las tablas de Supabase. Reflejan supabase/migrations/*.sql.
 *
 * Si más adelante querés regenerarlos automáticamente:
 *   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts
 */

export type ImageRow = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  sort_order: number;
};

export type PrototipoRow = {
  id: string;
  slug: string;
  type: 'casa' | 'cabaña';
  name: string;
  tagline_es: string;
  tagline_en: string;
  description_es: string;
  description_en: string;
  covered_area: number;
  semi_covered_area: number | null;
  bedrooms: number;
  bathrooms: number;
  features_es: string;
  features_en: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PrototipoRowWithImages = PrototipoRow & {
  prototipo_images: ImageRow[];
};

export type ObraRow = {
  id: string;
  slug: string;
  name: string;
  location: string;
  address: string | null;
  lat: number;
  lng: number;
  description_es: string | null;
  description_en: string | null;
  year: number | null;
  category: 'vivienda' | 'comercial' | 'modular' | 'ampliacion';
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ObraRowWithImages = ObraRow & {
  obra_images: ImageRow[];
};

export type InversionRow = {
  id: string;
  slug: string;
  nombre: string;
  tipo: string;
  ubicacion: string;
  detalle: string;
  estado: string;
  entrega: string | null;
  pdf_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ConsultaRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: 'interest_proto' | 'interest_custom' | 'interest_general';
  zone: string | null;
  surface: string | null;
  budget: string | null;
  land: 'land_yes' | 'land_no' | 'land_process' | null;
  message: string | null;
  status: 'nuevo' | 'leido' | 'archivado';
  ip: string | null;
  created_at: string;
};
