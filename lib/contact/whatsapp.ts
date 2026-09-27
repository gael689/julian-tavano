/**
 * Número único de WhatsApp del estudio. Antes estaba repetido a mano en
 * Footer.tsx, Contact.tsx y modelos/[slug]/page.tsx — un solo lugar para
 * cambiarlo si el número cambia.
 */
export const WHATSAPP_NUMBER = '5492494246878';

/** Número formateado para mostrar en texto (no para el link). */
export const WHATSAPP_DISPLAY = '+54 9 2494 24-6878';

/** Arma el link de wa.me con un mensaje prearmado, ya codificado. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
