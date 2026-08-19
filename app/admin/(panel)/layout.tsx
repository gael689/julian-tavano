import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Callout } from '@/components/admin/ui';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getAdminUser } from '@/lib/supabase/server';

import { signOut } from '../_actions/auth';
import AdminNav from './AdminNav';

// El guard depende de cookies: nunca cachear estas páginas.
export const dynamic = 'force-dynamic';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-16">
        <Callout tone="warn" title="Falta conectar Supabase">
          El panel está listo, pero todavía no tiene credenciales. Seguí los pasos de{' '}
          <code className="font-mono text-xs">SUPABASE-SETUP.md</code> y volvé a entrar. Mientras
          tanto el sitio público sigue funcionando con los datos actuales.
        </Callout>
      </main>
    );
  }

  // Segunda barrera: el middleware sólo verifica que haya sesión; acá se
  // confirma contra la base que además esté en la allowlist de admins.
  const user = await getAdminUser();
  if (!user) redirect('/admin/login');

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 md:px-8">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 text-[17px] font-bold text-charcoal transition hover:text-olive-deep"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            <Image src="/logo.png" alt="" width={30} height={30} />
            Julián Tavano
          </Link>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm font-semibold text-charcoal/55 transition hover:text-olive-deep sm:block"
            >
              Ver sitio ↗
            </a>
            <span className="hidden max-w-[200px] truncate text-sm text-charcoal/40 lg:block">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-charcoal/65 transition hover:bg-charcoal/5 hover:text-charcoal"
              >
                Salir
              </button>
            </form>
          </div>

          <div className="order-last w-full">
            <AdminNav />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">{children}</main>
    </div>
  );
}
