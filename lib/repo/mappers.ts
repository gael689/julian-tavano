import type { Inversion } from '@/lib/data/inversiones';
import type { Obra } from '@/lib/data/obras';
import type { Prototipo } from '@/lib/data/prototipos';
import type {
  ImageRow,
  InversionRow,
  ObraRowWithImages,
  PrototipoRowWithImages,
} from '@/lib/supabase/types';

/** Las imágenes vienen del join sin garantía de orden. */
function sortImages(images: ImageRow[] | null | undefined) {
  return [...(images ?? [])].sort((a, b) => a.sort_order - b.sort_order);
}

export function rowToPrototipo(row: PrototipoRowWithImages): Prototipo {
  return {
    id: row.slug,
    type: row.type,
    name: row.name,
    tagline: { es: row.tagline_es, en: row.tagline_en || row.tagline_es },
    specs: {
      coveredArea: Number(row.covered_area),
      ...(row.semi_covered_area != null
        ? { semiCoveredArea: Number(row.semi_covered_area) }
        : {}),
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      features: { es: row.features_es, en: row.features_en || row.features_es },
    },
    description: {
      es: row.description_es,
      en: row.description_en || row.description_es,
    },
    images: sortImages(row.prototipo_images).map((img) => ({
      src: img.src,
      alt: img.alt,
      ...(img.caption ? { caption: img.caption } : {}),
    })),
  };
}

export function rowToObra(row: ObraRowWithImages): Obra {
  return {
    id: row.slug,
    name: row.name,
    location: row.location,
    coordinates: [row.lng, row.lat], // el front espera [lng, lat]
    category: row.category,
    ...(row.year != null ? { year: row.year } : {}),
    ...(row.description_es
      ? {
          description: {
            es: row.description_es,
            en: row.description_en || row.description_es,
          },
        }
      : {}),
    images: sortImages(row.obra_images).map((img) => ({
      src: img.src,
      alt: img.alt,
      ...(img.caption ? { caption: img.caption } : {}),
    })),
  };
}

export function rowToInversion(row: InversionRow): Inversion {
  return {
    id: row.slug,
    nombre: row.nombre,
    tipo: row.tipo,
    ubicacion: row.ubicacion,
    detalle: row.detalle,
    estado: row.estado,
    ...(row.entrega ? { entrega: row.entrega } : {}),
    ...(row.pdf_url ? { pdf: row.pdf_url } : {}),
  };
}
