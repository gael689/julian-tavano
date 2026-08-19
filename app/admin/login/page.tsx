import Image from 'next/image';
import Link from 'next/link';

import { Callout } from '@/components/admin/ui';
import { isSupabaseConfigured } from '@/lib/supabase/config';

import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* ── Panel visual — sólo en pantallas grandes ── */}
      <aside className="relative hidden overflow-hidden bg-charcoal lg:block">
        <Image
          src="/prototipos/cabana-coihue/imagenes/01_hero.jpg"
          alt=""
          fill
          priority
          quality={85}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal/70 to-charcoal/25" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          <Image
            src="/logo.png"
            alt="Julián Tavano Arquitecto"
            width={56}
            height={56}
            className="opacity-95"
          />

          <div>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-olive-soft">
              Panel de administración
            </p>
            <p
              className="max-w-md text-3xl font-bold leading-[1.15] text-cream xl:text-4xl"
              style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
            >
              Todo el contenido del sitio, en un solo lugar.
            </p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/55">
              Modelos, obras del mapa, inversiones y las consultas que llegan por el formulario de
              contacto.
            </p>
          </div>

          <p className="text-xs text-cream/35">Julián Tavano · Arquitecto · Monte Hermoso</p>
        </div>
      </aside>

      {/* ── Formulario ── */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          {/* Cabecera propia para mobile, donde no se ve el panel visual */}
          <div className="mb-10 lg:mb-12">
            <Image
              src="/logo.png"
              alt="Julián Tavano Arquitecto"
              width={52}
              height={52}
              className="mb-6 lg:hidden"
            />
            <h1
              className="text-[28px] font-bold leading-tight text-charcoal sm:text-[32px]"
              style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
            >
              Hola, Julián
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-charcoal/55">
              Ingresá con tu mail y contraseña para administrar el sitio.
            </p>
          </div>

          {isSupabaseConfigured ? (
            <LoginForm next={next ?? ''} />
          ) : (
            <Callout tone="warn" title="Falta conectar la base de datos">
              Cargá <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> y{' '}
              <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en{' '}
              <code className="font-mono text-xs">.env.local</code> y reiniciá el servidor. Los pasos
              completos están en <code className="font-mono text-xs">SUPABASE-SETUP.md</code>.
            </Callout>
          )}

          <p className="mt-10 text-center text-[13px] text-charcoal/40">
            <Link href="/" className="transition hover:text-olive-deep">
              ← Volver al sitio
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
