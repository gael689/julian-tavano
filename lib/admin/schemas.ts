import { z } from 'zod';

/**
 * Validación de todo lo que entra por Server Actions.
 *
 * Las Server Actions son endpoints HTTP: nada de lo que llega se considera
 * confiable, aunque el formulario ya lo haya validado en el navegador.
 */

const text = (max: number) => z.string().trim().max(max);
const requiredText = (max: number) => text(max).min(1, 'Este campo es obligatorio');

export const imageSchema = z.object({
  src: z.string().trim().min(1).max(2000),
  alt: text(300).default(''),
  caption: text(160).nullish().transform((v) => v || null),
});

export type ImageInput = z.infer<typeof imageSchema>;

// ── Prototipos ──────────────────────────────────────────────────────────────
export const prototipoSchema = z.object({
  id: z.uuid().optional(),
  slug: text(80)
    .regex(/^[a-z0-9-]*$/, 'Sólo minúsculas, números y guiones')
    .optional(),
  name: requiredText(120),
  type: z.enum(['casa', 'cabaña']),
  tagline_es: text(160).default(''),
  tagline_en: text(160).default(''),
  description_es: text(2000).default(''),
  description_en: text(2000).default(''),
  covered_area: z.coerce.number().min(0).max(100000),
  semi_covered_area: z.coerce
    .number()
    .min(0)
    .max(100000)
    .nullish()
    .transform((v) => (v === null || v === undefined || Number.isNaN(v) ? null : v)),
  bedrooms: z.coerce.number().int().min(0).max(50),
  bathrooms: z.coerce.number().int().min(0).max(50),
  features_es: text(600).default(''),
  features_en: text(600).default(''),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  images: z.array(imageSchema).max(40).default([]),
});

export type PrototipoInput = z.input<typeof prototipoSchema>;

// ── Obras ───────────────────────────────────────────────────────────────────
export const obraSchema = z.object({
  id: z.uuid().optional(),
  slug: text(80).regex(/^[a-z0-9-]*$/, 'Sólo minúsculas, números y guiones').optional(),
  name: requiredText(120),
  location: text(160).default(''),
  address: text(300).nullish().transform((v) => v || null),
  lat: z.coerce.number().min(-90, 'Latitud fuera de rango').max(90, 'Latitud fuera de rango'),
  lng: z.coerce.number().min(-180, 'Longitud fuera de rango').max(180, 'Longitud fuera de rango'),
  category: z.enum(['vivienda', 'comercial', 'modular', 'ampliacion']).default('vivienda'),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2200)
    .nullish()
    .transform((v) => (v === null || v === undefined || Number.isNaN(v) ? null : v)),
  description_es: text(2000).nullish().transform((v) => v || null),
  description_en: text(2000).nullish().transform((v) => v || null),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
  images: z.array(imageSchema).max(40).default([]),
});

export type ObraInput = z.input<typeof obraSchema>;

// ── Inversiones ─────────────────────────────────────────────────────────────
export const inversionSchema = z.object({
  id: z.uuid().optional(),
  slug: text(80).regex(/^[a-z0-9-]*$/, 'Sólo minúsculas, números y guiones').optional(),
  nombre: requiredText(120),
  tipo: text(60).default('Fideicomiso'),
  ubicacion: text(160).default(''),
  detalle: text(400).default(''),
  estado: text(60).default('En desarrollo'),
  entrega: text(60).nullish().transform((v) => v || null),
  pdf_url: z.string().trim().max(2000).nullish().transform((v) => v || null),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export type InversionInput = z.input<typeof inversionSchema>;
