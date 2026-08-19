'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { saveObra } from '@/app/admin/_actions/content';
import type { LatLng } from '@/lib/admin/coords';
import { slugify } from '@/lib/admin/slug';
import type { ObraRowWithImages } from '@/lib/supabase/types';

import ImageManager, { type ManagedImage } from './ImageManager';
import LocationPicker from './LocationPicker';
import { Button, Callout, Card, Field, Input, SectionTitle, Select, Textarea } from './ui';

/** Centro de Monte Hermoso — punto de partida para una obra nueva. */
const DEFAULT_LOCATION: LatLng = { lat: -38.9846, lng: -61.2949 };

const CATEGORIAS = [
  { value: 'vivienda', label: 'Vivienda' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'modular', label: 'Modular' },
  { value: 'ampliacion', label: 'Ampliación' },
] as const;

type Categoria = (typeof CATEGORIAS)[number]['value'];

export default function ObraForm({ row }: { row: ObraRowWithImages | null }) {
  const router = useRouter();

  const [name, setName] = useState(row?.name ?? '');
  const [slug, setSlug] = useState(row?.slug ?? '');
  const [location, setLocation] = useState(row?.location ?? 'Monte Hermoso');
  const [address, setAddress] = useState(row?.address ?? '');
  const [coords, setCoords] = useState<LatLng>(
    row ? { lat: row.lat, lng: row.lng } : DEFAULT_LOCATION
  );
  const [category, setCategory] = useState<Categoria>(row?.category ?? 'vivienda');
  const [year, setYear] = useState(row?.year != null ? String(row.year) : '');
  const [descriptionEs, setDescriptionEs] = useState(row?.description_es ?? '');
  const [descriptionEn, setDescriptionEn] = useState(row?.description_en ?? '');
  const [published, setPublished] = useState(row?.published ?? true);
  const [sortOrder, setSortOrder] = useState(row ? String(row.sort_order) : '0');

  const [images, setImages] = useState<ManagedImage[]>(() =>
    [...(row?.obra_images ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => ({ src: img.src, alt: img.alt, caption: img.caption ?? '' }))
  );

  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const effectiveSlug = slug.trim() || slugify(name);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await saveObra({
        ...(row ? { id: row.id } : {}),
        slug: effectiveSlug,
        name,
        location,
        address: address || null,
        lat: coords.lat,
        lng: coords.lng,
        category,
        year: year === '' ? null : year,
        description_es: descriptionEs || null,
        description_en: descriptionEn || null,
        published,
        sort_order: sortOrder || 0,
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

      router.push('/admin/obras');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <SectionTitle hint="El nombre y la zona son lo que se ve en la tarjeta del mapa.">
          Datos de la obra
        </SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Casa Cristina"
              required
              maxLength={120}
            />
          </Field>

          <Field label="Zona" hint="Ej: Monte Hermoso, Balneario Sauce Grande.">
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={160}
            />
          </Field>

          <Field label="Categoría">
            <Select value={category} onChange={(e) => setCategory(e.target.value as Categoria)}>
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Año" hint="Opcional.">
            <Input
              type="number"
              min={1900}
              max={2200}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
            />
          </Field>

          <Field
            label="Identificador de URL"
            hint="Se genera solo desde el nombre. Tiene que ser único."
            className="sm:col-span-2"
          >
            <Input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder={slugify(name) || 'casa-cristina'}
              maxLength={80}
            />
          </Field>

          <Field label="Descripción (español)" hint="Opcional." className="sm:col-span-2">
            <Textarea
              value={descriptionEs}
              onChange={(e) => setDescriptionEs(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </Field>

          <Field
            label="Descripción (inglés)"
            hint="Si lo dejás vacío se usa la versión en español."
            className="sm:col-span-2"
          >
            <Textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <SectionTitle hint="Podés buscarla por dirección, pegar las coordenadas o marcarla a mano en el mapa. Las tres formas terminan en el mismo punto.">
          Ubicación en el mapa
        </SectionTitle>
        <LocationPicker
          value={coords}
          onChange={setCoords}
          address={address}
          onAddressChange={setAddress}
        />
      </Card>

      <Card>
        <SectionTitle>Imágenes</SectionTitle>
        <ImageManager
          variant="obra"
          bucket="obras"
          folder={effectiveSlug || 'sin-slug'}
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
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#3A4A2A]"
            />
            <span>
              <span className="block text-sm font-semibold text-charcoal">Visible en el mapa</span>
              <span className="block text-xs text-charcoal/50">
                Destildalo para que no aparezca todavía.
              </span>
            </span>
          </label>

          <Field label="Orden" hint="Más chico aparece primero en la lista.">
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
          {row ? 'Guardar cambios' : 'Crear obra'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push('/admin/obras')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
