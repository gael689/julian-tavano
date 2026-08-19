import { NextResponse } from 'next/server';

import { getAdminUser } from '@/lib/supabase/server';

/**
 * Proxy de geocodificación contra Nominatim (OpenStreetMap).
 *
 * Va por el servidor y no por el navegador para:
 *  - mandar el User-Agent que exige la política de uso de Nominatim,
 *  - no exponer el endpoint a cualquiera (sólo admins logueados),
 *  - poder limitar la frecuencia (Nominatim permite 1 consulta por segundo).
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';
const CONTACT = process.env.NEXT_PUBLIC_SITE_URL || 'https://juliantavano.com.ar';
const USER_AGENT = `JulianTavanoAdmin/1.0 (${CONTACT})`;

/** Sesgo hacia Monte Hermoso y la zona donde trabaja el estudio. */
const VIEWBOX = '-62.2,-39.4,-60.3,-38.5';

const MIN_INTERVAL_MS = 1100;
let lastRequestAt = 0;

export type GeocodeHit = {
  label: string;
  lat: number;
  lng: number;
  type: string;
};

export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }

  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (query.length < 3) {
    return NextResponse.json({ error: 'Escribí al menos 3 caracteres.' }, { status: 400 });
  }

  const wait = MIN_INTERVAL_MS - (Date.now() - lastRequestAt);
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt = Date.now();

  const url = new URL(NOMINATIM);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('limit', '6');
  url.searchParams.set('countrycodes', 'ar');
  url.searchParams.set('viewbox', VIEWBOX);
  url.searchParams.set('bounded', '0'); // prioriza la zona, pero no la impone
  url.searchParams.set('accept-language', 'es');

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'El servicio de direcciones no respondió. Probá de nuevo en unos segundos.' },
        { status: 502 }
      );
    }

    const raw = (await response.json()) as Array<{
      display_name?: string;
      lat: string;
      lon: string;
      type?: string;
      category?: string;
    }>;

    const results: GeocodeHit[] = raw
      .map((item) => ({
        label: item.display_name ?? '',
        lat: Number(item.lat),
        lng: Number(item.lon),
        type: item.type ?? item.category ?? '',
      }))
      .filter((item) => item.label && Number.isFinite(item.lat) && Number.isFinite(item.lng));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: 'No pude consultar el servicio de direcciones.' },
      { status: 502 }
    );
  }
}
