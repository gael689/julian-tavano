import { z } from 'zod';

/**
 * Validación del formulario público de contacto. Al igual que las Server
 * Actions del panel, nada de lo que llega acá se considera confiable.
 */

const text = (max: number) => z.string().trim().max(max);
const requiredText = (max: number) => text(max).min(1, 'Este campo es obligatorio');

export const contactSchema = z.object({
  name: requiredText(120),
  email: requiredText(200).email('Ingresá un mail válido'),
  phone: text(40).default(''),
  interest: z.enum(['interest_proto', 'interest_custom', 'interest_general']),
  zone: text(160).default(''),
  surface: text(60).default(''),
  budget: text(60).default(''),
  land: z.enum(['land_yes', 'land_no', 'land_process']).nullish(),
  message: text(2000).default(''),
  // Honeypot: campo oculto para bots. Si viene con contenido, se descarta
  // el envío sin decírselo (para no darle feedback al bot).
  company: z.string().max(200).default(''),
});

export type ContactInput = z.input<typeof contactSchema>;
