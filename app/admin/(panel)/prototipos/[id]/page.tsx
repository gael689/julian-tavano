import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { deletePrototipo } from '@/app/admin/_actions/content';
import DeleteButton from '@/components/admin/DeleteButton';
import PrototipoForm from '@/components/admin/PrototipoForm';
import { findPrototipo } from '@/lib/admin/queries';

export const dynamic = 'force-dynamic';

export default async function EditarPrototipoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await findPrototipo(id);
  if (!row) notFound();

  return (
    <>
      <Link
        href="/admin/prototipos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-olive-deep"
      >
        <ArrowLeft size={15} />
        Modelos
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            {row.name}
          </h1>
          <a
            href={`/modelos/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-charcoal/50 transition hover:text-olive-deep"
          >
            /modelos/{row.slug} ↗
          </a>
        </div>

        <DeleteButton
          id={row.id}
          label={row.name}
          action={deletePrototipo}
          redirectTo="/admin/prototipos"
        />
      </div>

      <PrototipoForm row={row} />
    </>
  );
}
