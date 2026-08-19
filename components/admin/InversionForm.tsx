'use client';

import { FileText, Loader2, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';

import { saveInversion } from '@/app/admin/_actions/content';
import { slugify } from '@/lib/admin/slug';
import { uploadPdf } from '@/lib/admin/upload';
import type { InversionRow } from '@/lib/supabase/types';

import { Button, Callout, Card, Field, Input, SectionTitle, Textarea } from './ui';

export default function InversionForm({ row }: { row: InversionRow | null }) {
  const router = useRouter();

  const [nombre, setNombre] = useState(row?.nombre ?? '');
  const [slug, setSlug] = useState(row?.slug ?? '');
  const [tipo, setTipo] = useState(row?.tipo ?? 'Fideicomiso');
  const [ubicacion, setUbicacion] = useState(row?.ubicacion ?? 'Monte Hermoso');
  const [detalle, setDetalle] = useState(row?.detalle ?? '');
  const [estado, setEstado] = useState(row?.estado ?? 'En desarrollo');
  const [entrega, setEntrega] = useState(row?.entrega ?? '');
  const [pdfUrl, setPdfUrl] = useState(row?.pdf_url ?? '');
  const [published, setPublished] = useState(row?.published ?? true);
  const [sortOrder, setSortOrder] = useState(row ? String(row.sort_order) : '0');

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const effectiveSlug = slug.trim() || slugify(nombre);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await saveInversion({
        ...(row ? { id: row.id } : {}),
        slug: effectiveSlug,
        nombre,
        tipo,
        ubicacion,
        detalle,
        estado,
        entrega: entrega || null,
        pdf_url: pdfUrl || null,
        published,
        sort_order: sortOrder || 0,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push('/admin/inversiones');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <SectionTitle hint="Así se arma la tarjeta que se ve en la sección Inversiones del sitio.">
          Datos del proyecto
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <Input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Los Aromos"
              required
              maxLength={120}
            />
          </Field>

          <Field label="Tipo" hint="Ej: Fideicomiso, Desarrollo, Pozo.">
            <Input value={tipo} onChange={(e) => setTipo(e.target.value)} maxLength={60} />
          </Field>

          <Field label="Ubicación">
            <Input
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              maxLength={160}
            />
          </Field>

          <Field label="Estado" hint="Ej: En desarrollo, En obra, Finalizado.">
            <Input value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={60} />
          </Field>

          <Field label="Entrega" hint="Opcional. Ej: Dic. 2026.">
            <Input
              value={entrega}
              onChange={(e) => setEntrega(e.target.value)}
              placeholder="Dic. 2026"
              maxLength={60}
            />
          </Field>

          <Field
            label="Identificador de URL"
            hint="Se genera solo desde el nombre. Tiene que ser único."
          >
            <Input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder={slugify(nombre) || 'los-aromos'}
              maxLength={80}
            />
          </Field>

          <Field
            label="Detalle"
            hint="Una línea con lo principal. Separá con ' · ' — ej: 6 duplex · 70 m² c/u · a 150 m de la playa"
            className="sm:col-span-2"
          >
            <Textarea
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              rows={2}
              maxLength={400}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle hint="El PDF que se descarga desde el botón de la tarjeta. Hasta 25 MB.">
          Vista previa en PDF
        </SectionTitle>
        <PdfField folder={effectiveSlug || 'sin-slug'} value={pdfUrl} onChange={setPdfUrl} />
      </Card>

      <Card>
        <SectionTitle>Publicación</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#3A4A2A]"
            />
            <span>
              <span className="block text-sm font-semibold text-charcoal">Visible en el sitio</span>
              <span className="block text-xs text-charcoal/50">
                Si no hay ningún proyecto publicado, la sección no se muestra.
              </span>
            </span>
          </label>

          <Field label="Orden" hint="Más chico aparece primero.">
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </Field>
        </div>
      </Card>

      {error && <Callout tone="error">{error}</Callout>}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 size={15} className="animate-spin" />}
          {row ? 'Guardar cambios' : 'Crear proyecto'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/admin/inversiones')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function PdfField({
  folder,
  value,
  onChange,
}: {
  folder: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);

    const result = await uploadPdf(folder, file);
    setUploading(false);

    if (result.ok) onChange(result.url);
    else setError(result.error);
  }

  if (value) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-charcoal/12 bg-white px-4 py-3">
          <FileText size={18} className="shrink-0 text-olive-deep" />
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-0 flex-1 truncate text-sm text-charcoal underline-offset-2 hover:underline"
          >
            {value.split('/').pop()}
          </a>
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Quitar PDF"
            className="shrink-0 rounded-lg p-1.5 text-red-600 transition hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
        <p className="text-xs text-charcoal/45">
          Para reemplazarlo, quitá el actual y subí uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        id={inputId}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <label
        htmlFor={inputId}
        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-charcoal/15 bg-white px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:border-olive/40 hover:bg-olive/5"
      >
        {uploading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Subiendo…
          </>
        ) : (
          <>
            <Upload size={15} />
            Subir PDF
          </>
        )}
      </label>

      {error && <Callout tone="error">{error}</Callout>}
    </div>
  );
}
