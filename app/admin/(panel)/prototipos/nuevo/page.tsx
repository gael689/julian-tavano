import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import PrototipoForm from '@/components/admin/PrototipoForm';

export const dynamic = 'force-dynamic';

export default function NuevoPrototipoPage() {
  return (
    <>
      <Link
        href="/admin/prototipos"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition hover:text-olive-deep"
      >
        <ArrowLeft size={15} />
        Modelos
      </Link>

      <h1
        className="mb-6 text-[30px] font-bold leading-tight text-charcoal md:text-[34px]"
        style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
      >
        Nuevo modelo
      </h1>

      <PrototipoForm row={null} />
    </>
  );
}
