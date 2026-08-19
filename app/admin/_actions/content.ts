'use server';

import { revalidatePath } from 'next/cache';

import { requireAdmin } from '@/lib/admin/guard';
import {
  inversionSchema,
  obraSchema,
  prototipoSchema,
  type ImageInput,
} from '@/lib/admin/schemas';
import { slugify } from '@/lib/admin/slug';
import { deleteCloudinaryAsset } from '@/lib/cloudinary/sign';
import { BUCKETS } from '@/lib/supabase/config';

export type ActionResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string };

/** Revalida todo el sitio público — el contenido aparece en varias páginas. */
function revalidateSite() {
  revalidatePath('/', 'layout');
}

function fail(error: unknown, fallback: string): { ok: false; error: string } {
  const message = error instanceof Error ? error.message : String(error ?? '');
  console.error('[admin action]', message);

  if (message.includes('duplicate key')) {
    return { ok: false, error: 'Ya existe un elemento con ese identificador (slug).' };
  }
  if (message.includes('row-level security') || message.includes('permisos')) {
    return { ok: false, error: 'No tenés permisos para hacer esto.' };
  }
  return { ok: false, error: fallback };
}

/**
 * Las imágenes se reemplazan enteras: se borran las filas actuales y se
 * insertan las nuevas en orden. Evita tener que diffear altas/bajas/reordenes.
 */
async function replaceImages(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  table: 'prototipo_images' | 'obra_images',
  foreignKey: 'prototipo_id' | 'obra_id',
  parentId: string,
  images: ImageInput[]
) {
  const { error: deleteError } = await supabase.from(table).delete().eq(foreignKey, parentId);
  if (deleteError) throw new Error(deleteError.message);

  if (images.length === 0) return;

  const rows = images.map((img, i) => ({
    [foreignKey]: parentId,
    src: img.src,
    alt: img.alt ?? '',
    caption: img.caption ?? null,
    sort_order: i,
  }));

  const { error: insertError } = await supabase.from(table).insert(rows);
  if (insertError) throw new Error(insertError.message);
}

/** Borra de Storage los archivos que suba el panel (ignora rutas de /public). */
async function removeStorageFiles(
  supabase: Awaited<ReturnType<typeof requireAdmin>>['supabase'],
  bucket: string,
  urls: (string | null | undefined)[]
) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const paths = urls
    .filter((u): u is string => Boolean(u && u.includes(marker)))
    .map((u) => decodeURIComponent(u.split(marker)[1]));

  if (paths.length === 0) return;
  await supabase.storage.from(bucket).remove(paths);
}

/** Borra de Cloudinary las imágenes subidas desde el panel (best-effort). */
async function removeCloudinaryFiles(urls: (string | null | undefined)[]) {
  const cloudinaryUrls = urls.filter(
    (u): u is string => Boolean(u && u.includes('res.cloudinary.com'))
  );
  await Promise.all(cloudinaryUrls.map((u) => deleteCloudinaryAsset(u)));
}

// ── Prototipos ──────────────────────────────────────────────────────────────

export async function savePrototipo(input: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = prototipoSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
    }

    const { id, images, ...rest } = parsed.data;
    const slug = rest.slug?.trim() || slugify(rest.name);
    if (!slug) return { ok: false, error: 'No pude generar el identificador. Revisá el nombre.' };

    const row = { ...rest, slug };

    const { data, error } = id
      ? await supabase.from('prototipos').update(row).eq('id', id).select('id, slug').single()
      : await supabase.from('prototipos').insert(row).select('id, slug').single();

    if (error) throw new Error(error.message);

    await replaceImages(supabase, 'prototipo_images', 'prototipo_id', data.id, images);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo guardar el modelo.');
  }
}

export async function deletePrototipo(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();

    const { data: images } = await supabase
      .from('prototipo_images')
      .select('src')
      .eq('prototipo_id', id);

    const { data, error } = await supabase
      .from('prototipos')
      .delete()
      .eq('id', id)
      .select('id, slug')
      .single();

    if (error) throw new Error(error.message);

    const urls = (images ?? []).map((i) => i.src);
    await Promise.all([
      removeStorageFiles(supabase, BUCKETS.prototipos, urls),
      removeCloudinaryFiles(urls),
    ]);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo eliminar el modelo.');
  }
}

// ── Obras ───────────────────────────────────────────────────────────────────

export async function saveObra(input: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = obraSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
    }

    const { id, images, ...rest } = parsed.data;
    const slug = rest.slug?.trim() || slugify(rest.name);
    if (!slug) return { ok: false, error: 'No pude generar el identificador. Revisá el nombre.' };

    const row = { ...rest, slug };

    const { data, error } = id
      ? await supabase.from('obras').update(row).eq('id', id).select('id, slug').single()
      : await supabase.from('obras').insert(row).select('id, slug').single();

    if (error) throw new Error(error.message);

    await replaceImages(supabase, 'obra_images', 'obra_id', data.id, images);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo guardar la obra.');
  }
}

export async function deleteObra(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();

    const { data: images } = await supabase.from('obra_images').select('src').eq('obra_id', id);

    const { data, error } = await supabase
      .from('obras')
      .delete()
      .eq('id', id)
      .select('id, slug')
      .single();

    if (error) throw new Error(error.message);

    const urls = (images ?? []).map((i) => i.src);
    await Promise.all([
      removeStorageFiles(supabase, BUCKETS.obras, urls),
      removeCloudinaryFiles(urls),
    ]);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo eliminar la obra.');
  }
}

// ── Inversiones ─────────────────────────────────────────────────────────────

export async function saveInversion(input: unknown): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = inversionSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
    }

    const { id, ...rest } = parsed.data;
    const slug = rest.slug?.trim() || slugify(rest.nombre);
    if (!slug) return { ok: false, error: 'No pude generar el identificador. Revisá el nombre.' };

    const row = { ...rest, slug };

    const { data, error } = id
      ? await supabase.from('inversiones').update(row).eq('id', id).select('id, slug').single()
      : await supabase.from('inversiones').insert(row).select('id, slug').single();

    if (error) throw new Error(error.message);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo guardar el proyecto de inversión.');
  }
}

export async function deleteInversion(id: string): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();

    const { data, error } = await supabase
      .from('inversiones')
      .delete()
      .eq('id', id)
      .select('id, slug, pdf_url')
      .single();

    if (error) throw new Error(error.message);

    await removeStorageFiles(supabase, BUCKETS.inversiones, [data.pdf_url]);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo eliminar el proyecto de inversión.');
  }
}

// ── Publicar / despublicar ──────────────────────────────────────────────────

export async function togglePublished(
  table: 'prototipos' | 'obras' | 'inversiones',
  id: string,
  published: boolean
): Promise<ActionResult> {
  try {
    const { supabase } = await requireAdmin();

    if (!['prototipos', 'obras', 'inversiones'].includes(table)) {
      return { ok: false, error: 'Tabla inválida.' };
    }

    const { data, error } = await supabase
      .from(table)
      .update({ published })
      .eq('id', id)
      .select('id, slug')
      .single();

    if (error) throw new Error(error.message);

    revalidateSite();
    return { ok: true, id: data.id, slug: data.slug };
  } catch (error) {
    return fail(error, 'No se pudo cambiar el estado de publicación.');
  }
}
