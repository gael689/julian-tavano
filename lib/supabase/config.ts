/**
 * Configuración de Supabase.
 *
 * Mientras no existan las variables de entorno el sitio sigue funcionando:
 * los repositorios (`lib/repo/*`) caen automáticamente a los datos estáticos
 * de `lib/data/*`. Al cargar las credenciales, todo pasa a leerse de la base
 * sin tocar una línea de código.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

/** Soporta el nombre nuevo (`publishable`) y el clásico (`anon`). */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  '';

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

/** Buckets de Storage creados por la migración inicial. */
export const BUCKETS = {
  prototipos: 'prototipos',
  obras: 'obras',
  inversiones: 'inversiones',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];
