'use server';

import { requireAdmin } from '@/lib/admin/guard';
import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME, isCloudinaryConfigured } from '@/lib/cloudinary/config';
import { signParams } from '@/lib/cloudinary/sign';

export type UploadSignatureResult =
  | {
      ok: true;
      cloudName: string;
      apiKey: string;
      timestamp: number;
      signature: string;
      folder: string;
    }
  | { ok: false; error: string };

/**
 * Firma una subida para que el navegador suba directo a Cloudinary sin pasar
 * el archivo por nuestro server. El API secret nunca sale de acá.
 */
export async function getUploadSignature(folder: string): Promise<UploadSignatureResult> {
  try {
    await requireAdmin();

    if (!isCloudinaryConfigured) {
      return { ok: false, error: 'Cloudinary no está configurado.' };
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signParams({ folder, timestamp });

    return { ok: true, cloudName: CLOUDINARY_CLOUD_NAME, apiKey: CLOUDINARY_API_KEY, timestamp, signature, folder };
  } catch {
    return { ok: false, error: 'No tenés permisos para subir imágenes.' };
  }
}
