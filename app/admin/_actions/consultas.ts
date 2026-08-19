'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/admin/guard';

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function setConsultaStatus(
  id: string,
  status: 'nuevo' | 'leido' | 'archivado'
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();

    const { error } = await supabase.from('consultas').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);

    revalidatePath('/admin/consultas');
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error ?? '');
    console.error('[admin action]', message);
    return { ok: false, error: 'No se pudo actualizar la consulta.' };
  }
}
