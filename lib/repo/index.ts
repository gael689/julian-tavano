import 'server-only';

import { INVERSIONES, type Inversion } from '@/lib/data/inversiones';
import { OBRAS, type Obra } from '@/lib/data/obras';
import { PROTOTIPOS_DATA, type Prototipo } from '@/lib/data/prototipos';
import { createPublicClient } from '@/lib/supabase/server';
import type {
  InversionRow,
  ObraRowWithImages,
  PrototipoRowWithImages,
} from '@/lib/supabase/types';

import { rowToInversion, rowToObra, rowToPrototipo } from './mappers';

/**
 * Lectura pública del contenido del sitio.
 *
 * Si hay credenciales de Supabase, lee de la base. Si no —o si la consulta
 * falla— devuelve los datos estáticos de `lib/data/*`, así el sitio nunca se
 * cae por un problema de conexión.
 */

const PROTOTIPO_SELECT =
  '*, prototipo_images(id, src, alt, caption, sort_order)';
const OBRA_SELECT = '*, obra_images(id, src, alt, caption, sort_order)';

function warn(scope: string, error: unknown) {
  console.error(`[repo:${scope}] usando datos estáticos —`, error);
}

export async function getPrototipos(): Promise<Prototipo[]> {
  const supabase = createPublicClient();
  if (!supabase) return PROTOTIPOS_DATA;

  const { data, error } = await supabase
    .from('prototipos')
    .select(PROTOTIPO_SELECT)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !data?.length) {
    if (error) warn('prototipos', error.message);
    return error ? PROTOTIPOS_DATA : [];
  }

  return (data as unknown as PrototipoRowWithImages[]).map(rowToPrototipo);
}

export async function getPrototipo(slug: string): Promise<Prototipo | null> {
  const supabase = createPublicClient();
  if (!supabase) return PROTOTIPOS_DATA.find((p) => p.id === slug) ?? null;

  const { data, error } = await supabase
    .from('prototipos')
    .select(PROTOTIPO_SELECT)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    warn('prototipo', error.message);
    return PROTOTIPOS_DATA.find((p) => p.id === slug) ?? null;
  }
  if (!data) return null;

  return rowToPrototipo(data as unknown as PrototipoRowWithImages);
}

export async function getObras(): Promise<Obra[]> {
  const supabase = createPublicClient();
  if (!supabase) return OBRAS;

  const { data, error } = await supabase
    .from('obras')
    .select(OBRA_SELECT)
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error || !data?.length) {
    if (error) warn('obras', error.message);
    return error ? OBRAS : [];
  }

  return (data as unknown as ObraRowWithImages[]).map(rowToObra);
}

export async function getInversiones(): Promise<Inversion[]> {
  const supabase = createPublicClient();
  if (!supabase) return INVERSIONES;

  const { data, error } = await supabase
    .from('inversiones')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    warn('inversiones', error.message);
    return INVERSIONES;
  }

  return (data as InversionRow[]).map(rowToInversion);
}
