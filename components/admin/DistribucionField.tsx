'use client';

import { useRef } from 'react';

import { Textarea } from './ui';

const SEPARATOR = ' · ';

const EXAMPLES = [
  'Estar-comedor y cocina integrados · Parrilla en semicubierto',
  'Cocina, comedor y dormitorio integrados · Espacio exterior para disfrutar el entorno',
  'Cocina y comedor integrados · Estar integrado · Gran deck de expansión',
];

/**
 * El texto se muestra en el sitio como un párrafo dentro de un recuadro, no
 * como lista: el " · " es sólo una convención tipográfica para separar
 * ideas. La vista previa replica el recuadro real para que no haya sorpresas.
 */
export default function DistribucionField({
  label,
  value,
  onChange,
  hint,
  showPreview = true,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  showPreview?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function insertSeparator() {
    const el = ref.current;
    if (!el) return;

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + SEPARATOR + value.slice(end);

    onChange(next);

    // Devolver el cursor justo después del separador recién insertado.
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + SEPARATOR.length;
      el.setSelectionRange(pos, pos);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-olive-deep">
          {label}
        </span>
        <button
          type="button"
          onClick={insertSeparator}
          className="rounded-lg border border-charcoal/15 bg-white px-2.5 py-1 text-[13px] font-semibold
                     text-charcoal/65 transition hover:border-olive/40 hover:bg-olive/5 hover:text-olive-deep
                     focus:outline-none focus:ring-2 focus:ring-olive/25"
        >
          Insertar separador ·
        </button>
      </div>

      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        maxLength={600}
        placeholder={EXAMPLES[0]}
      />

      {hint && <span className="text-[13px] leading-relaxed text-charcoal/50">{hint}</span>}

      {showPreview && (
        <div className="mt-1">
          <p className="mb-2 text-[13px] font-semibold text-charcoal/45">
            Así se va a ver en la página del modelo:
          </p>
          <div className="border-l-2 border-olive bg-charcoal/[0.04] p-5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-charcoal/45">
              Distribución
            </p>
            <p className="text-[14px] leading-relaxed text-charcoal/80">
              {value.trim() || (
                <span className="text-charcoal/30">
                  Escribí arriba para ver cómo queda…
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export { EXAMPLES };
