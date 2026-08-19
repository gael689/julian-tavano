import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { deleteInversion } from '@/app/admin/_actions/content';
import DeleteButton from '@/components/admin/DeleteButton';
import InversionForm from '@/components/admin/InversionForm';
import { findInversion } from '@/lib/admin/queries';

export const dynamic = 'force-dynamic';

export default async function EditarInversionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await findInversion(id);
  if (!row) notFound();

  return (
    <>
      <Link
        href="/admin/inversiones"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-olive-deep"
      >
        <ArrowLeft size={15} />
        Inversiones
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            {row.nombre}
          </h1>
          <p className="text-sm text-charcoal/50">
            {row.tipo} · {row.ubicacion}
          </p>
        </div>

        <DeleteButton
          id={row.id}
          label={row.nombre}
          action={deleteInversion}
          redirectTo="/admin/inversiones"
        />
      </div>

      <InversionForm row={row} />
    </>
  );
}
