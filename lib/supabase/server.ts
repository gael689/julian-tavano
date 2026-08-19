import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 *
 * Usa siempre la clave pública: las escrituras quedan sujetas a RLS y a la
 * allowlist de `public.admins`. No hay service-role key en la app.
 *
 * Devuelve `null` si todavía no están cargadas las credenciales, para que los
 * repositorios puedan caer al fallback estático.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component: la cookie la refresca el middleware.
        }
      },
    },
  });
}

/**
 * Cliente para lectura pública (sin sesión). Evita leer cookies, así las
 * páginas del sitio pueden seguir siendo cacheadas/estáticas.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

/** Usuario logueado, o `null`. */
export async function getSessionUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

/**
 * Verifica contra la base que el usuario esté en la allowlist de admins.
 * No confía en nada del cliente: si la fila no existe, no es admin.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  return adminRow ? userData.user : null;
}
