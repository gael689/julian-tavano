'use client';

import { createBrowserClient } from '@supabase/ssr';

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

/**
 * Cliente de navegador. Se usa sólo para el login y para subir archivos a
 * Storage desde el panel (así los archivos grandes no pasan por el server).
 * Todas las escrituras a tablas van por Server Actions.
 */
export function createClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase no está configurado. Cargá NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local'
    );
  }
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
