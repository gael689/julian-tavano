'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { savePrototipo } from '@/app/admin/_actions/content';
import { slugify } from '@/lib/admin/slug';
import type { PrototipoRowWithImages } from '@/lib/supabase/types';

import DistribucionField from './DistribucionField';
import ImageManager, { type ManagedImage } from './ImageManager';
import { Button, Callout, Card, Field, Input, SectionTitle, Select, Textarea } from './ui';

type FormState = {
  name: string;
  slug: string;
  type: 'casa' | 'cabaña';
  tagline_es: string;
  tagline_en: string;
  description_es: string;
  description_en: string;
  covered_area: string;
  semi_covered_area: string;
  bedrooms: string;
  bathrooms: string;
  features_es: string;
  features_en: string;
  published: boolean;
  sort_order: string;
};

function initialState(row: PrototipoRowWithImages | null): FormState {
  return {
    name: row?.name ?? '',
    slug: row?.slug ?? '',
    type: row?.type ?? 'cabaña',
    tagline_es: row?.tagline_es ?? '',
    tagline_en: row?.tagline_en ?? '',
    description_es: row?.description_es ?? '',
    description_en: row?.description_en ?? '',
    covered_area: row ? String(row.covered_area) : '',
    semi_covered_area: row?.semi_covered_area != null ? String(row.semi_covered_area) : '',
    bedrooms: row ? String(row.bedrooms) : '1',
    bathrooms: row ? String(row.bathrooms) : '1',
    features_es: row?.features_es ?? '',
    features_en: row?.features_en ?? '',
    published: row?.published ?? true,
    sort_order: row ? String(row.sort_order) : '0',
  };
}

export default function PrototipoForm({ row }: { row: PrototipoRowWithImages | null }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => initialState(row));
  const [images, setImages] = useState<ManagedImage[]>(() =>
    [...(row?.prototipo_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ src: img.src, alt: img.alt, caption: img.caption ?? '' }))
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Slug estable: una vez publicado no conviene cambiarlo (rompe el link).
  const effectiveSlug = form.slug.trim() || slugify(form.name);
  const folder = effectiveSlug || 'sin-slug';

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await savePrototipo({
        ...(row ? { id: row.id } : {}),
        slug: effectiveSlug,
        name: form.name,
        type: form.type,
        tagline_es: form.tagline_es,
        tagline_en: form.tagline_en,
        description_es: form.description_es,
        description_en: form.description_en,
        covered_area: form.covered_area || 0,
        semi_covered_area: form.semi_covered_area === '' ? null : form.semi_covered_area,
        bedrooms: form.bedrooms || 0,
        bathrooms: form.bathrooms || 0,
        features_es: form.features_es,
        features_en: form.features_en,
        published: form.published,
        sort_order: form.sort_order || 0,
        images: images.map((img) => ({
          src: img.src,
          alt: img.alt,
          caption: img.caption || null,
        })),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push('/admin/prototipos');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <SectionTitle hint="Lo básico del modelo. El nombre es el que aparece en el catálogo.">
          Datos generales
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <Input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Coihue"
              required
              maxLength={120}
            />
          </Field>

          <Field label="Tipo">
            <Select
              value={form.type}
              onChange={(e) => set('type', e.target.value as 'casa' | 'cabaña')}
            >
              <option value="cabaña">Cabaña</option>
              <option value="casa">Casa</option>
            </Select>
          </Field>

          <Field
            label="Identificador de URL"
            hint={
              <>
                La página va a ser <code className="font-mono">/modelos/{folder}</code>. Se genera
                solo desde el nombre; cambialo únicamente si sabés lo que hacés, porque los links
                viejos dejan de funcionar.
              </>
            }
            className="sm:col-span-2"
          >
            <Input
              value={form.slug}
              onChange={(e) => set('slug', slugify(e.target.value))}
              placeholder={slugify(form.name) || 'cabana-coihue'}
              maxLength={80}
            />
          </Field>

          <Field label="Frase corta (español)" hint="Se muestra debajo del nombre en la ficha.">
            <Input
              value={form.tagline_es}
              onChange={(e) => set('tagline_es', e.target.value)}
              placeholder="Amplia. Cálida. Funcional."
              maxLength={160}
            />
          </Field>

          <Field label="Frase corta (inglés)" hint="Si lo dejás vacío se usa la versión en español.">
            <Input
              value={form.tagline_en}
              onChange={(e) => set('tagline_en', e.target.value)}
              placeholder="Spacious. Warm. Functional."
              maxLength={160}
            />
          </Field>

          <Field label="Descripción (español)" className="sm:col-span-2">
            <Textarea
              value={form.description_es}
              onChange={(e) => set('description_es', e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </Field>

          <Field
            label="Descripción (inglés)"
            hint="Si lo dejás vacío se usa la versión en español."
            className="sm:col-span-2"
          >
            <Textarea
              value={form.description_en}
              onChange={(e) => set('description_en', e.target.value)}
              rows={4}
              maxLength={2000}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle hint="Los números que se muestran en la ficha técnica.">
          Ficha técnica
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Superficie cubierta (m²)">
            <Input
              type="number"
              min={0}
              step="0.5"
              value={form.covered_area}
              onChange={(e) => set('covered_area', e.target.value)}
              required
            />
          </Field>

          <Field label="Semicubierta (m²)" hint="Opcional. Dejalo vacío si no tiene.">
            <Input
              type="number"
              min={0}
              step="0.5"
              value={form.semi_covered_area}
              onChange={(e) => set('semi_covered_area', e.target.value)}
            />
          </Field>

          <Field label="Habitaciones">
            <Input
              type="number"
              min={0}
              value={form.bedrooms}
              onChange={(e) => set('bedrooms', e.target.value)}
              required
            />
          </Field>

          <Field label="Baños">
            <Input
              type="number"
              min={0}
              value={form.bathrooms}
              onChange={(e) => set('bathrooms', e.target.value)}
              required
            />
          </Field>

          <div className="sm:col-span-2 lg:col-span-4">
            <Callout tone="info" title="Qué es la distribución">
              Es una frase que describe <strong>cómo están organizados los ambientes</strong> — qué
              está integrado con qué, y qué espacios extra tiene. Aparece en un recuadro destacado
              al final de la ficha del modelo, debajo de las características.
              <br />
              <br />
              No es una lista con viñetas: se muestra todo seguido en un renglón. El punto{' '}
              <code className="font-mono">·</code> es sólo para separar ideas visualmente — usá el
              botón <strong>&quot;Insertar separador&quot;</strong> para agregarlo sin buscarlo en el
              teclado.
            </Callout>
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <DistribucionField
              label="Distribución (español)"
              value={form.features_es}
              onChange={(v) => set('features_es', v)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <DistribucionField
              label="Distribución (inglés)"
              value={form.features_en}
              onChange={(v) => set('features_en', v)}
              hint="Si lo dejás vacío se usa la versión en español."
              showPreview={false}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Galería</SectionTitle>
        <ImageManager
          bucket="prototipos"
          folder={folder}
          images={images}
          onChange={setImages}
        />
      </Card>

      <Card>
        <SectionTitle>Publicación</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set('published', e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#3A4A2A]"
            />
            <span>
              <span className="block text-sm font-semibold text-charcoal">Visible en el sitio</span>
              <span className="block text-xs text-charcoal/50">
                Destildalo para trabajarlo sin que se vea todavía.
              </span>
            </span>
          </label>

          <Field label="Orden" hint="Más chico aparece primero en el catálogo.">
            <Input
              type="number"
              min={0}
              value={form.sort_order}
              onChange={(e) => set('sort_order', e.target.value)}
            />
          </Field>
        </div>
      </Card>

      {error && <Callout tone="error">{error}</Callout>}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 size={15} className="animate-spin" />}
          {row ? 'Guardar cambios' : 'Crear modelo'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/admin/prototipos')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
