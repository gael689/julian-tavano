import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import InversionForm from '@/components/admin/InversionForm';

export const dynamic = 'force-dynamic';

export default function NuevaInversionPage() {
  return (
    <>
      <Link
        href="/admin/inversiones"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-olive-deep"
      >
        <ArrowLeft size={15} />
        Inversiones
      </Link>

      <h1
        className="mb-6 text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
        style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
      >
        Nuevo proyecto de inversión
      </h1>

      <InversionForm row={null} />
    </>
  );
}
