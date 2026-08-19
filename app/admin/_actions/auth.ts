'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export type AuthState = { error: string | null };

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Supabase todavía no está configurado en este entorno.' };
  }

  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const next = String(formData.get('next') ?? '');

  if (!email || !password) {
    return { error: 'Completá email y contraseña.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    // Mensaje genérico a propósito: no revelar si el mail existe.
    return { error: 'Email o contraseña incorrectos.' };
  }

  // Estar autenticado no alcanza: hay que estar en la allowlist de admins.
  const { data: adminRow } = await supabase
    .from('admins')
    .select('user_id')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return { error: 'Esta cuenta no tiene acceso al panel.' };
  }

  // Sólo rutas internas del panel, para que no sirva como redirect abierto.
  const target = next.startsWith('/admin') && !next.startsWith('/admin/login') ? next : '/admin';
  redirect(target);
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/admin/login');
}
