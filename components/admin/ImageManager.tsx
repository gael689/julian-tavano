'use client';

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { useId, useRef, useState } from 'react';

import { ACCEPTED_IMAGE_TYPES, uploadImage } from '@/lib/admin/upload';
import type { BucketName } from '@/lib/supabase/config';

import { Callout, Input } from './ui';

export type ManagedImage = { src: string; alt: string; caption: string };

/** Cantidad que usan la mayoría de los modelos actuales y con la que la grilla cierra pareja. */
const RECOMMENDED = 7;

type Variant = 'prototipo' | 'obra';

/**
 * Describe cómo va a quedar la galería con la cantidad actual de imágenes.
 * Refleja ProtoGallery: la primera va a lo ancho y el resto en dos columnas,
 * así que un total impar cierra la grilla sin sobrantes.
 */
function galleryStatus(
  count: number,
  variant: Variant
): { tone: 'info' | 'warn' | 'error'; title: string; body: string } | null {
  if (count === 0) return null;

  // En obras sólo se muestra la primera imagen (ver components/map/ObrasClient).
  if (variant === 'obra') {
    if (count === 1) return null;
    return {
      tone: 'info',
      title: `${count} imágenes cargadas — se muestra sólo la primera`,
      body: 'Las demás quedan guardadas por si más adelante se agrega una galería, pero hoy no se ven en el sitio.',
    };
  }

  if (count === 1) {
    return {
      tone: 'error',
      title: 'Con una sola imagen la galería no aparece',
      body: `La página del modelo necesita al menos 2 imágenes para mostrar la galería. Lo ideal son ${RECOMMENDED}.`,
    };
  }

  // La primera es el encabezado; las que siguen van de a dos por fila.
  const restoEsPar = (count - 1) % 2 === 0;

  if (restoEsPar) {
    return {
      tone: 'info',
      title: `${count} imágenes — la grilla cierra pareja`,
      body: `1 grande arriba + ${count - 1} en dos columnas, sin sobrantes.`,
    };
  }

  return {
    tone: 'warn',
    title: `${count} imágenes — la última queda sola`,
    body: `1 grande arriba + ${count - 2} en dos columnas + la última a lo ancho. Se ve bien igual; si preferís el bloque cerrado, sumá o sacá una (con ${RECOMMENDED} queda perfecto).`,
  };
}

/**
 * Galería editable. Sube directo a Cloudinary desde el navegador (así los
 * archivos grandes no pasan por el server) y devuelve las URLs al formulario,
 * que las guarda junto con el resto en una sola Server Action.
 */
export default function ImageManager({
  bucket,
  folder,
  images,
  onChange,
  variant = 'prototipo',
}: {
  bucket: BucketName;
  folder: string;
  images: ManagedImage[];
  onChange: (next: ManagedImage[]) => void;
  /** Cambia las recomendaciones: en obras sólo se muestra la primera imagen. */
  variant?: Variant;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    setErrors([]);
    setUploading(files.length);

    const uploaded: ManagedImage[] = [];
    const failed: string[] = [];

    for (const file of files) {
      const result = await uploadImage(bucket, folder, file);
      if (result.ok) {
        uploaded.push({ src: result.url, alt: '', caption: '' });
      } else {
        failed.push(result.error);
      }
      setUploading((n) => n - 1);
    }

    if (uploaded.length) onChange([...images, ...uploaded]);
    if (failed.length) setErrors(failed);
    if (inputRef.current) inputRef.current.value = '';
  }

  function update(index: number, patch: Partial<ManagedImage>) {
    onChange(images.map((img, i) => (i === index ? { ...img, ...patch } : img)));
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  /** Lleva una imagen al primer lugar sin tener que subirla de a un paso. */
  function makeCover(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    onChange([picked, ...next]);
  }

  const status = galleryStatus(images.length, variant);

  return (
    <div className="flex flex-col gap-4">
      {variant === 'prototipo' ? (
        <Callout tone="info" title="Cómo se arma la galería">
          <strong>La primera imagen de la lista es la principal.</strong> Es la que se ve en el
          catálogo, la que encabeza la galería a lo ancho, y la que aparece al compartir el link por
          WhatsApp. Para cambiarla, usá el botón <strong>&quot;Hacer principal&quot;</strong> de
          cualquier imagen.
          <br />
          <br />
          Recomendado: <strong>{RECOMMENDED} imágenes</strong> (mínimo 2, si no la galería no
          aparece). Un orden que funciona bien: exterior, ambiente integrado, cocina, dormitorios,
          baño y planta.
        </Callout>
      ) : (
        <Callout tone="info" title="Cuál se muestra">
          <strong>Sólo se muestra la primera imagen de la lista.</strong> Es la que aparece en la
          tarjeta del mapa y en el panel lateral. Para cambiarla, usá el botón{' '}
          <strong>&quot;Hacer principal&quot;</strong> de cualquier imagen.
          <br />
          <br />
          Con <strong>1 imagen buena alcanza</strong>. Podés subir más para tenerlas guardadas, pero
          hoy no se ven en el sitio.
        </Callout>
      )}

      {/* Zona de carga */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-2xl border-2 border-dashed p-7 text-center transition ${
          dragOver ? 'border-olive bg-olive/5' : 'border-charcoal/15 bg-white/60'
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(',')}
          multiple
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-olive-deep px-5 py-3 text-[15px] font-semibold text-cream transition hover:bg-olive"
        >
          {uploading > 0 ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Subiendo {uploading}…
            </>
          ) : (
            <>
              <ImagePlus size={17} />
              Agregar imágenes
            </>
          )}
        </label>
        <p className="mt-3 text-[14px] leading-relaxed text-charcoal/50">
          Arrastrá los archivos acá o hacé clic. JPG, PNG o WebP, hasta 10 MB cada uno.
          <br />
          Se achican solas a 2000 px para que el sitio cargue rápido.
        </p>
      </div>

      {status && (
        <Callout tone={status.tone} title={status.title}>
          {status.body}
        </Callout>
      )}

      {errors.length > 0 && (
        <Callout tone="error" title="Algunas imágenes no se subieron">
          <ul className="list-disc pl-4">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </Callout>
      )}

      {/* Listado ordenable */}
      {images.length > 0 && (
        <ul className="flex flex-col gap-3">
          {images.map((image, index) => (
            <li
              key={`${image.src}-${index}`}
              className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row ${
                index === 0 ? 'border-olive/45 shadow-[0_2px_10px_rgba(58,74,42,0.08)]' : 'border-charcoal/10'
              }`}
            >
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt=""
                  className="h-28 w-36 rounded-xl bg-charcoal/5 object-cover"
                />
                {index === 0 && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-olive-deep px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cream">
                    <Star size={10} fill="currentColor" />
                    Principal
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {index === 0 && (
                  <p className="text-[13px] font-semibold text-olive-deep">
                    {variant === 'prototipo'
                      ? 'Se ve en el catálogo, encabeza la galería y aparece al compartir el link.'
                      : 'Es la que se ve en la tarjeta del mapa y en el panel lateral.'}
                  </p>
                )}
                <Input
                  value={image.alt}
                  onChange={(e) => update(index, { alt: e.target.value })}
                  placeholder="Descripción de la imagen (para buscadores y accesibilidad)"
                  maxLength={300}
                />
                <Input
                  value={image.caption}
                  onChange={(e) => update(index, { caption: e.target.value })}
                  placeholder="Epígrafe opcional — ej: Cocina, Exterior, Planta"
                  maxLength={160}
                />
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(index)}
                    className="self-start rounded-lg border border-charcoal/15 px-3 py-1.5 text-[13px] font-semibold
                               text-charcoal/60 transition hover:border-olive/40 hover:bg-olive/5 hover:text-olive-deep
                               focus:outline-none focus:ring-2 focus:ring-olive/25"
                  >
                    Hacer principal
                  </button>
                )}
              </div>

              <div className="flex shrink-0 flex-row gap-1 sm:flex-col">
                <IconButton label="Subir" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowUp size={16} />
                </IconButton>
                <IconButton
                  label="Bajar"
                  onClick={() => move(index, 1)}
                  disabled={index === images.length - 1}
                >
                  <ArrowDown size={16} />
                </IconButton>
                <IconButton label="Quitar" onClick={() => remove(index)} danger>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-charcoal/12 transition disabled:opacity-30 ${
        danger
          ? 'text-red-600 hover:border-red-300 hover:bg-red-50'
          : 'text-charcoal/60 hover:border-olive/40 hover:bg-olive/5 hover:text-olive-deep'
      }`}
    >
      {children}
    </button>
  );
}
