'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import type { ActionResult } from '@/app/admin/_actions/content';

import { Button } from './ui';

/**
 * Borrado en dos pasos: el primer clic pide confirmación explícita escrita,
 * porque la acción no se puede deshacer.
 */
export default function DeleteButton({
  id,
  label,
  action,
  redirectTo,
}: {
  id: string;
  /** Nombre del elemento, para que se vea qué se está por borrar. */
  label: string;
  action: (id: string) => Promise<ActionResult>;
  redirectTo?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  if (!confirming) {
    return (
      <div className="flex flex-col items-end gap-1">
        <Button type="button" variant="ghost" onClick={() => setConfirming(true)}>
          <Trash2 size={15} />
          Eliminar
        </Button>
        {error && <span className="text-xs font-medium text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <span className="text-sm text-charcoal/70">
        ¿Eliminar <strong className="font-semibold">{label}</strong>? No se puede deshacer.
      </span>
      <Button type="button" variant="secondary" onClick={() => setConfirming(false)}>
        Cancelar
      </Button>
      <Button type="button" variant="danger" onClick={handleDelete} disabled={pending}>
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        Sí, eliminar
      </Button>
    </div>
  );
}
