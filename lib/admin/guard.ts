import 'server-only';

import { createClient, getAdminUser } from '@/lib/supabase/server';

export class NotAdminError extends Error {
  constructor() {
    super('No tenés permisos para hacer esto.');
    this.name = 'NotAdminError';
  }
}

/**
 * Verifica contra la base que quien ejecuta la acción sea admin y devuelve un
 * cliente con su sesión.
 *
 * Se llama al principio de TODA Server Action de escritura: las Server Actions
 * son endpoints HTTP públicos, no alcanza con que la UI esté detrás del login.
 * Aun si esto fallara, las policies de RLS rechazan la escritura.
 */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) throw new NotAdminError();

  const supabase = await createClient();
  if (!supabase) throw new NotAdminError();

  return { supabase, user };
}
