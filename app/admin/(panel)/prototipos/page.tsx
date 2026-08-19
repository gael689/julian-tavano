import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Badge, Button, EmptyState } from '@/components/admin/ui';
import { listPrototipos } from '@/lib/admin/queries';

export const dynamic = 'force-dynamic';

export default async function PrototiposPage() {
  const prototipos = await listPrototipos();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            Modelos de casas
          </h1>
          <p className="mt-2.5 text-[16px] leading-relaxed text-charcoal/60">
            Cada modelo tiene su página propia en <code className="font-mono text-xs">/modelos/…</code>
          </p>
        </div>

        <Link href="/admin/prototipos/nuevo">
          <Button>
            <Plus size={16} />
            Nuevo modelo
          </Button>
        </Link>
      </div>

      {prototipos.length === 0 ? (
        <EmptyState title="Todavía no hay modelos cargados">
          Creá el primero, o corré <code className="font-mono text-xs">supabase/seed.sql</code> para
          importar los seis que ya están en el sitio.
        </EmptyState>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prototipos.map((proto) => {
            const cover = [...proto.prototipo_images].sort(
              (a, b) => a.sort_order - b.sort_order
            )[0];

            return (
              <li key={proto.id}>
                <Link
                  href={`/admin/prototipos/${proto.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition hover:-translate-y-0.5 hover:border-olive/40 hover:shadow-[0_8px_24px_rgba(58,74,42,0.12)]"
                >
                  <div className="aspect-[4/3] bg-charcoal/5">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.src}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[14px] text-charcoal/30">
                        Sin imágenes
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge>{proto.type}</Badge>
                      {!proto.published && <Badge tone="muted">Sin publicar</Badge>}
                    </div>
                    <h2
                      className="text-[19px] font-bold text-charcoal"
                      style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
                    >
                      {proto.name}
                    </h2>
                    <p className="mt-1.5 text-[14px] text-charcoal/55">
                      {proto.covered_area} m² · {proto.bedrooms} hab · {proto.bathrooms} baño
                      {proto.bathrooms === 1 ? '' : 's'} · {proto.prototipo_images.length} img
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
