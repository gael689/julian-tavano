'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { setConsultaStatus } from '@/app/admin/_actions/consultas';
import type { ConsultaRow } from '@/lib/supabase/types';

import { Button } from './ui';

const OPTIONS: { value: ConsultaRow['status']; label: string }[] = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'leido', label: 'Leído' },
  { value: 'archivado', label: 'Archivado' },
];

export default function ConsultaStatusButtons({
  id,
  status,
}: {
  id: string;
  status: ConsultaRow['status'];
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick(next: ConsultaRow['status']) {
    if (next === status) return;
    startTransition(async () => {
      await setConsultaStatus(id, next);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {pending && <Loader2 size={14} className="animate-spin text-charcoal/40" />}
      {OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          type="button"
          variant={opt.value === status ? 'primary' : 'secondary'}
          disabled={pending}
          onClick={() => handleClick(opt.value)}
          className="px-2.5 py-1 text-xs"
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}
