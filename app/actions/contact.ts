'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';

import { INTEREST_LABEL, LAND_LABEL } from '@/lib/contact/labels';
import { contactSchema } from '@/lib/contact/schema';
import { createPublicClient } from '@/lib/supabase/server';

export type ContactResult = { ok: true } | { ok: false; error: string };

async function clientIp() {
  const h = await headers();
  const forwarded = h.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return h.get('x-real-ip') ?? 'unknown';
}

async function sendNotification(input: {
  name: string;
  email: string;
  phone: string;
  interest: string;
  zone: string;
  surface: string;
  budget: string;
  land?: string | null;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return;

  const resend = new Resend(apiKey);

  const rows = [
    ['Nombre', input.name],
    ['Email', input.email],
    ['Teléfono', input.phone || '—'],
    ['Interés', INTEREST_LABEL[input.interest] ?? input.interest],
    ['Zona', input.zone || '—'],
    ['Superficie', input.surface || '—'],
    ['Presupuesto', input.budget || '—'],
    ['Terreno', input.land ? (LAND_LABEL[input.land] ?? input.land) : '—'],
  ];

  const html = `
    <h2>Nueva consulta desde juliantavano.com.ar</h2>
    <table cellpadding="4">
      ${rows.map(([label, value]) => `<tr><td><strong>${label}</strong></td><td>${value}</td></tr>`).join('')}
    </table>
    <p><strong>Mensaje:</strong></p>
    <p>${(input.message || '—').replace(/\n/g, '<br>')}</p>
  `;

  await resend.emails.send({
    from: 'Julián Tavano Arquitecto <onboarding@resend.dev>',
    to,
    replyTo: input.email,
    subject: `Nueva consulta de ${input.name}`,
    html,
  });
}

export async function submitContact(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Datos inválidos.' };
  }

  // Honeypot: si un bot completó este campo oculto, fingimos éxito.
  if (parsed.data.company) {
    return { ok: true };
  }

  const data = parsed.data;

  const supabase = createPublicClient();
  if (!supabase) {
    return { ok: false, error: 'El formulario no está disponible en este momento.' };
  }

  const ip = await clientIp();

  const { error } = await supabase.rpc('submit_consulta', {
    p_name: data.name,
    p_email: data.email,
    p_phone: data.phone || null,
    p_interest: data.interest,
    p_zone: data.zone || null,
    p_surface: data.surface || null,
    p_budget: data.budget || null,
    p_land: data.land || null,
    p_message: data.message || null,
    p_ip: ip,
  });

  if (error) {
    if (error.message.includes('rate_limited')) {
      return { ok: false, error: 'Ya enviaste varias consultas. Probá de nuevo en unos minutos.' };
    }
    console.error('[contact]', error.message);
    return { ok: false, error: 'No pudimos enviar tu consulta. Probá de nuevo en unos minutos.' };
  }

  try {
    await sendNotification(data);
  } catch (err) {
    // La consulta ya quedó guardada en la base; el mail es best-effort.
    console.error('[contact] resend', err);
  }

  return { ok: true };
}
