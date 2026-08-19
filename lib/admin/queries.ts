import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type {
  ConsultaRow,
  InversionRow,
  ObraRowWithImages,
  PrototipoRowWithImages,
} from '@/lib/supabase/types';

/**
 * Lecturas del panel. A diferencia de `lib/repo`, usan la sesión del admin y
 * traen también lo despublicado. No tienen fallback estático: si algo falla,
 * el panel muestra el error en vez de datos que no se pueden editar.
 */

const PROTOTIPO_SELECT = '*, prototipo_images(id, src, alt, caption, sort_order)';
const OBRA_SELECT = '*, obra_images(id, src, alt, caption, sort_order)';

export async function listPrototipos(): Promise<PrototipoRowWithImages[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('prototipos')
    .select(PROTOTIPO_SELECT)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as PrototipoRowWithImages[];
}

export async function findPrototipo(id: string): Promise<PrototipoRowWithImages | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('prototipos')
    .select(PROTOTIPO_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as unknown as PrototipoRowWithImages) ?? null;
}

export async function listObras(): Promise<ObraRowWithImages[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('obras')
    .select(OBRA_SELECT)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ObraRowWithImages[];
}

export async function findObra(id: string): Promise<ObraRowWithImages | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('obras')
    .select(OBRA_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as unknown as ObraRowWithImages) ?? null;
}

export async function listInversiones(): Promise<InversionRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('inversiones')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as InversionRow[];
}

export async function findInversion(id: string): Promise<InversionRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('inversiones')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as InversionRow) ?? null;
}

export async function listConsultas(): Promise<ConsultaRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('consultas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ConsultaRow[];
}
