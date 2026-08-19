/**
 * Cloud name y API key de Cloudinary no son secretos — Cloudinary los usa
 * así a propósito para firmar subidas desde el navegador (ver
 * lib/cloudinary/sign.ts). El API secret nunca sale del servidor.
 */
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
export const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? '';

export const isCloudinaryConfigured = Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY);
