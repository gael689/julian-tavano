import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge, Button, EmptyState } from '@/components/admin/ui';
import { listInversiones } from '@/lib/admin/queries';

export const dynamic = 'force-dynamic';

export default async function InversionesPage() {
  const inversiones = await listInversiones();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            Inversiones
          </h1>
          <p className="mt-2.5 text-[16px] leading-relaxed text-charcoal/60">
            Fideicomisos y proyectos de inversión de la home.
          </p>
        </div>

        <Link href="/admin/inversiones/nueva">
          <Button>
            <Plus size={16} />
            Nuevo proyecto
          </Button>
        </Link>
      </div>

      {inversiones.length === 0 ? (
        <EmptyState title="No hay proyectos de inversión cargados">
          Si no hay ninguno publicado, la sección no aparece en el sitio.
        </EmptyState>
      ) : (
        <ul className="divide-y divide-charcoal/8 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
          {inversiones.map((inv) => (
            <li key={inv.id}>
              <Link
                href={`/admin/inversiones/${inv.id}`}
                className="flex items-center gap-4 px-5 py-5 transition hover:bg-olive/5"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Badge>{inv.tipo}</Badge>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/45">
                      {[inv.estado, inv.entrega].filter(Boolean).join(' · ')}
                    </span>
                    {!inv.published && <Badge tone="muted">Sin publicar</Badge>}
                  </div>
                  <span
                    className="block truncate text-[17px] font-bold text-charcoal"
                    style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
                  >
                    {inv.nombre}
                  </span>
                  <p className="truncate text-[14px] text-charcoal/55">
                    {inv.ubicacion}
                    {inv.detalle ? ` · ${inv.detalle}` : ''}
                  </p>
                </div>

                {inv.pdf_url && (
                  <FileText size={19} className="shrink-0 text-olive-deep" aria-label="Tiene PDF" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
