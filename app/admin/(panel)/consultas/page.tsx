import { Mail, Phone } from 'lucide-react';

import ConsultaStatusButtons from '@/components/admin/ConsultaStatusButtons';
import { Badge, EmptyState } from '@/components/admin/ui';
import { listConsultas } from '@/lib/admin/queries';
import { INTEREST_LABEL, LAND_LABEL } from '@/lib/contact/labels';

export const dynamic = 'force-dynamic';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function ConsultasPage() {
  const consultas = await listConsultas();

  return (
    <>
      <div className="mb-6">
        <h1
          className="text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
          style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
        >
          Consultas
        </h1>
        <p className="mt-2.5 text-[16px] leading-relaxed text-charcoal/60">
          Consultas recibidas por el formulario de contacto de la home.
        </p>
      </div>

      {consultas.length === 0 ? (
        <EmptyState title="Todavía no llegó ninguna consulta">
          Se van a listar acá apenas alguien complete el formulario de contacto.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-4">
          {consultas.map((c) => (
            <li
              key={c.id}
              className={`rounded-2xl border bg-white p-5 md:p-6 ${
                c.status === 'nuevo' ? 'border-olive/35 shadow-[0_2px_10px_rgba(58,74,42,0.07)]' : 'border-charcoal/10'
              }`}
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge tone={c.status === 'nuevo' ? 'success' : 'muted'}>
                      {INTEREST_LABEL[c.interest] ?? c.interest}
                    </Badge>
                    <span className="text-[12px] font-semibold uppercase tracking-wider text-charcoal/45">
                      {formatDate(c.created_at)}
                    </span>
                  </div>
                  <span
                    className="block text-[20px] font-bold text-charcoal"
                    style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
                  >
                    {c.name}
                  </span>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[14px] text-charcoal/60">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 hover:text-olive-deep">
                      <Mail size={15} /> {c.email}
                    </a>
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 hover:text-olive-deep">
                        <Phone size={15} /> {c.phone}
                      </a>
                    )}
                  </div>
                </div>

                <ConsultaStatusButtons id={c.id} status={c.status} />
              </div>

              <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-[14px] text-charcoal/60 sm:grid-cols-4">
                {c.zone && <p><strong className="text-charcoal/80">Zona:</strong> {c.zone}</p>}
                {c.surface && <p><strong className="text-charcoal/80">Superficie:</strong> {c.surface}</p>}
                {c.budget && <p><strong className="text-charcoal/80">Presupuesto:</strong> {c.budget}</p>}
                {c.land && (
                  <p><strong className="text-charcoal/80">Terreno:</strong> {LAND_LABEL[c.land] ?? c.land}</p>
                )}
              </div>

              {c.message && (
                <p className="mt-4 whitespace-pre-line rounded-xl bg-charcoal/[0.035] p-4 text-[15px] leading-relaxed text-charcoal/75">
                  {c.message}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
