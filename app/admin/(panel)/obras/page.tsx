import { MapPin, Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge, Button, Callout, EmptyState } from '@/components/admin/ui';
import { listObras } from '@/lib/admin/queries';
import { formatLatLng } from '@/lib/admin/coords';

export const dynamic = 'force-dynamic';

export default async function ObrasPage() {
  const obras = await listObras();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            Obras del mapa
          </h1>
          <p className="mt-2.5 text-[16px] leading-relaxed text-charcoal/60">
            {obras.length} {obras.length === 1 ? 'obra cargada' : 'obras cargadas'} · se ven en{' '}
            <code className="font-mono text-xs">/obras</code>
          </p>
        </div>

        <Link href="/admin/obras/nueva">
          <Button>
            <Plus size={16} />
            Nueva obra
          </Button>
        </Link>
      </div>

      {obras.length === 0 ? (
        <EmptyState title="Todavía no hay obras cargadas">
          Cargá la primera, o corré <code className="font-mono text-xs">supabase/seed.sql</code> para
          importar las 44 que ya están en el mapa.
        </EmptyState>
      ) : (
        <>
          <div className="mb-4">
            <Callout tone="info">
              Al agregar una obra podés buscarla por dirección, pegar las coordenadas de Google Maps
              o marcarla directamente sobre el mapa.
            </Callout>
          </div>

          <ul className="divide-y divide-charcoal/8 overflow-hidden rounded-2xl border border-charcoal/10 bg-white">
            {obras.map((obra) => {
              const cover = [...obra.obra_images].sort((a, b) => a.sort_order - b.sort_order)[0];

              return (
                <li key={obra.id}>
                  <Link
                    href={`/admin/obras/${obra.id}`}
                    className="flex items-center gap-4 px-5 py-4 transition hover:bg-olive/5"
                  >
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.src}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-xl bg-charcoal/5 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-charcoal/5">
                        <MapPin size={20} className="text-charcoal/25" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="truncate text-[17px] font-bold text-charcoal"
                          style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
                        >
                          {obra.name}
                        </span>
                        {!obra.published && <Badge tone="muted">Sin publicar</Badge>}
                      </div>
                      <p className="truncate text-[14px] text-charcoal/55">
                        {obra.location}
                        {obra.year ? ` · ${obra.year}` : ''} · {obra.obra_images.length} img
                      </p>
                    </div>

                    <span className="hidden shrink-0 font-mono text-[13px] text-charcoal/35 md:block">
                      {formatLatLng({ lat: obra.lat, lng: obra.lng })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
