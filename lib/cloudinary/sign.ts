import 'server-only';

import { createHash } from 'crypto';

import { CLOUDINARY_CLOUD_NAME } from './config';

/**
 * Firma de subida/borrado de Cloudinary: sha1 de los parámetros ordenados
 * alfabéticamente + el API secret. Nunca se manda el secret al navegador,
 * sólo el resultado de esta función.
 * https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
 */
export function signParams(params: Record<string, string | number>): string {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) throw new Error('CLOUDINARY_API_SECRET no está configurado.');

  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return createHash('sha1').update(toSign + secret).digest('hex');
}

/** Extrae el public_id de una URL de Cloudinary (sin versión ni extensión). */
export function extractPublicId(url: string): string | null {
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return null;

  let rest = url.slice(idx + marker.length);
  rest = rest.replace(/^v\d+\//, '');
  rest = rest.replace(/\.[a-zA-Z0-9]+$/, '');

  return decodeURIComponent(rest) || null;
}

/** Borra un asset de Cloudinary. Ignora errores: el borrado es best-effort. */
export async function deleteCloudinaryAsset(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (!publicId || !CLOUDINARY_CLOUD_NAME) return;

  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  if (!apiKey) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ public_id: publicId, timestamp });

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  try {
    await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  } catch (error) {
    console.error('[cloudinary] destroy', error);
  }
}
