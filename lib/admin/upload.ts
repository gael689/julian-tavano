'use client';

import { getUploadSignature } from '@/app/actions/cloudinary';
import { createClient } from '@/lib/supabase/client';
import type { BucketName } from '@/lib/supabase/config';

const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_PDF_BYTES = 25 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

/**
 * Redimensiona en el navegador antes de subir: las fotos de cámara pesan
 * 6-12 MB y a 2000 px de ancho se ven igual pero cargan mucho más rápido.
 * Si algo falla, sube el original.
 */
async function downscale(file: File): Promise<Blob> {
  if (file.type === 'image/avif' || !('createImageBitmap' in window)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1_500_000) {
      bitmap.close();
      return file;
    }

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY)
    );

    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

function randomName(extension: string) {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${id}.${extension}`;
}

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Sube directo a Cloudinary desde el navegador: el server sólo firma la
 * subida (ver app/actions/cloudinary.ts), el archivo nunca pasa por acá.
 */
export async function uploadImage(
  bucket: BucketName,
  folder: string,
  file: File
): Promise<UploadResult> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: `${file.name}: formato no admitido (usá JPG, PNG o WebP).` };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { ok: false, error: `${file.name}: supera los 10 MB.` };
  }

  const sig = await getUploadSignature(`${bucket}/${folder}`);
  if (!sig.ok) return { ok: false, error: `${file.name}: ${sig.error}` };

  const processed = await downscale(file);

  const body = new FormData();
  body.set('file', processed, file.name);
  body.set('api_key', sig.apiKey);
  body.set('timestamp', String(sig.timestamp));
  body.set('signature', sig.signature);
  body.set('folder', sig.folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
    method: 'POST',
    body,
  });
  const data = await response.json();

  if (!response.ok) {
    return { ok: false, error: `${file.name}: ${data?.error?.message ?? 'no se pudo subir.'}` };
  }

  return { ok: true, url: data.secure_url };
}

export async function uploadPdf(folder: string, file: File): Promise<UploadResult> {
  if (file.type !== 'application/pdf') {
    return { ok: false, error: 'El archivo tiene que ser un PDF.' };
  }
  if (file.size > MAX_PDF_BYTES) {
    return { ok: false, error: 'El PDF supera los 25 MB.' };
  }

  const path = `${folder}/${randomName('pdf')}`;
  const supabase = createClient();

  const { error } = await supabase.storage.from('inversiones').upload(path, file, {
    contentType: 'application/pdf',
    cacheControl: '31536000',
    upsert: false,
  });

  if (error) return { ok: false, error: error.message };

  const { data } = supabase.storage.from('inversiones').getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
