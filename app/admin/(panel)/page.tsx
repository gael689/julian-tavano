import { ArrowRight, Home, Inbox, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

import { Callout } from '@/components/admin/ui';
import {
  listConsultas,
  listInversiones,
  listObras,
  listPrototipos,
} from '@/lib/admin/queries';

export const dynamic = 'force-dynamic';

type SectionCard = {
  href: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  total: number;
  /** Aviso destacado — lo que requiere atención de un vistazo. */
  alert?: string;
};

export default async function AdminHome() {
  const [prototipos, obras, inversiones, consultas] = await Promise.all([
    listPrototipos(),
    listObras(),
    listInversiones(),
    listConsultas(),
  ]);

  const sinPublicar = (n: number) => (n > 0 ? `${n} sin publicar` : undefined);
  const nuevas = consultas.filter((c) => c.status === 'nuevo').length;

  const sections: SectionCard[] = [
    {
      href: '/admin/consultas',
      title: 'Consultas',
      description: 'Mensajes que llegan por el formulario de contacto del sitio.',
      Icon: Inbox,
      total: consultas.length,
      alert: nuevas > 0 ? `${nuevas} sin leer` : undefined,
    },
    {
      href: '/admin/prototipos',
      title: 'Modelos de casas',
      description: 'Cabañas y casas del catálogo, con su galería y ficha técnica.',
      Icon: Home,
      total: prototipos.length,
      alert: sinPublicar(prototipos.filter((p) => !p.published).length),
    },
    {
      href: '/admin/obras',
      title: 'Obras del mapa',
      description: 'Los puntos del mapa interactivo, con ubicación e imágenes.',
      Icon: MapPin,
      total: obras.length,
      alert: sinPublicar(obras.filter((o) => !o.published).length),
    },
    {
      href: '/admin/inversiones',
      title: 'Inversiones',
      description: 'Fideicomisos y proyectos de inversión, con su PDF adjunto.',
      Icon: TrendingUp,
      total: inversiones.length,
      alert: sinPublicar(inversiones.filter((i) => !i.published).length),
    },
  ];

  const vacio = prototipos.length === 0 && obras.length === 0 && inversiones.length === 0;

  return (
    <>
      <header className="mb-10 md:mb-12">
        <h1
          className="text-[32px] font-bold leading-tight text-charcoal md:text-[40px]"
          style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
        >
          Hola, Julián
        </h1>
        <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-charcoal/60">
          Desde acá administrás todo el contenido del sitio. Los cambios se publican solos.
        </p>
      </header>

      {vacio && (
        <div className="mb-10">
          <Callout tone="warn" title="La base está vacía">
            Todavía no corriste el archivo{' '}
            <code className="font-mono text-xs">supabase/seed.sql</code>, que carga los modelos, las
            44 obras y el fideicomiso que ya están en el sitio. Hasta que lo hagas, el sitio público
            sigue mostrando los datos actuales.
          </Callout>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {sections.map(({ href, title, description, Icon, total, alert }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                       transition hover:-translate-y-0.5 hover:border-olive/40
                       hover:shadow-[0_8px_24px_rgba(58,74,42,0.12)] md:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-olive-deep/8 text-olive-deep">
                <Icon size={22} />
              </span>
              <span className="text-[42px] font-bold leading-none tabular-nums text-olive-deep md:text-[48px]">
                {total}
              </span>
            </div>

            <h2
              className="text-[20px] font-bold text-charcoal md:text-[22px]"
              style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
            >
              {title}
            </h2>
            <p className="mt-2 text-[15px] leading-relaxed text-charcoal/55">{description}</p>

            <div className="mt-5 flex items-center justify-between gap-3">
              {alert ? (
                <span className="rounded-full bg-wood/15 px-3 py-1 text-[13px] font-bold text-wood">
                  {alert}
                </span>
              ) : (
                <span />
              )}
              <span className="flex items-center gap-1.5 text-[14px] font-semibold text-charcoal/45 transition group-hover:text-olive-deep">
                Abrir
                <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
