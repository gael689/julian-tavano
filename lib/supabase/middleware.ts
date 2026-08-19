import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './config';

/**
 * Refresca el token de sesión y devuelve el usuario.
 *
 * Las cookies actualizadas se escriben sobre `response`, que el middleware
 * devuelve tal cual — si se crea una respuesta nueva después de esto, la
 * sesión se pierde.
 */
export async function refreshSession(request: NextRequest, response: NextResponse) {
  if (!isSupabaseConfigured) return null;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() valida el JWT contra Supabase — no confiar en getSession() acá.
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}
