/**
 * Normalización de coordenadas.
 *
 * El arquitecto puede pegar la ubicación en cualquiera de estos formatos y
 * siempre sale un par {lat, lng} decimal:
 *
 *   -38.984639, -61.314917
 *   -38.984639 -61.314917
 *   lat: -38.98 lng: -61.31
 *   38°59'04.7"S 61°18'53.7"W
 *   https://www.google.com/maps/@-38.984639,-61.314917,17z
 *   https://maps.google.com/?q=-38.984639,-61.314917
 *   https://maps.app.goo.gl/... (no se puede resolver, se avisa)
 */

export type LatLng = { lat: number; lng: number };

export type ParseResult =
  | { ok: true; value: LatLng; note?: string }
  | { ok: false; error: string };

/** Caja aproximada de Argentina continental — sólo para detectar errores. */
const AR_BOUNDS = { minLat: -56, maxLat: -21, minLng: -74, maxLng: -52 };

export function isInArgentina({ lat, lng }: LatLng) {
  return (
    lat >= AR_BOUNDS.minLat &&
    lat <= AR_BOUNDS.maxLat &&
    lng >= AR_BOUNDS.minLng &&
    lng <= AR_BOUNDS.maxLng
  );
}

/**
 * Detecta el error más común: pegar lng/lat en vez de lat/lng. Los dos valores
 * son válidos por rango, así que hay que mirar la geografía.
 */
export function looksSwapped(value: LatLng) {
  return !isInArgentina(value) && isInArgentina({ lat: value.lng, lng: value.lat });
}

function dmsToDecimal(deg: number, min: number, sec: number, hemi: string) {
  const decimal = deg + min / 60 + sec / 3600;
  return /[SWsw]/.test(hemi) ? -decimal : decimal;
}

const DMS_PAIR =
  /(\d{1,3})\s*[°º]\s*(\d{1,2})\s*['′]\s*([\d.]+)\s*["″]?\s*([NSEWnsew])/g;

function parseDms(input: string): LatLng | null {
  const matches = [...input.matchAll(DMS_PAIR)];
  if (matches.length < 2) return null;

  const parts = matches.slice(0, 2).map((m) => ({
    value: dmsToDecimal(Number(m[1]), Number(m[2]), Number(m[3]), m[4]),
    hemi: m[4].toUpperCase(),
  }));

  const latPart = parts.find((p) => p.hemi === 'N' || p.hemi === 'S');
  const lngPart = parts.find((p) => p.hemi === 'E' || p.hemi === 'W');
  if (!latPart || !lngPart) return null;

  return { lat: latPart.value, lng: lngPart.value };
}

/** Extrae el par de una URL de Google Maps (`@lat,lng` o `q=lat,lng`). */
function parseGoogleMapsUrl(input: string): LatLng | null {
  const at = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (at) return { lat: Number(at[1]), lng: Number(at[2]) };

  const q = input.match(/[?&](?:q|ll|daddr|center)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (q) return { lat: Number(q[1]), lng: Number(q[2]) };

  const bang = input.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (bang) return { lat: Number(bang[1]), lng: Number(bang[2]) };

  return null;
}

export function parseCoordinates(raw: string): ParseResult {
  const input = raw.trim();
  if (!input) return { ok: false, error: 'Pegá una coordenada o una dirección.' };

  if (/^https?:\/\//i.test(input)) {
    const fromUrl = parseGoogleMapsUrl(input);
    if (fromUrl) return finish(fromUrl);
    if (/goo\.gl|app\.goo\.gl/i.test(input)) {
      return {
        ok: false,
        error:
          'Ese es un link corto de Google Maps y no contiene las coordenadas. Abrilo en el navegador y copiá el link largo (el que tiene "@-38.98,-61.31"), o hacé clic derecho sobre el punto en Google Maps y copiá los números que aparecen.',
      };
    }
    return { ok: false, error: 'No encontré coordenadas en ese link.' };
  }

  const fromDms = parseDms(input);
  if (fromDms) return finish(fromDms);

  const numbers = input.match(/-?\d+(?:[.,]\d+)?/g);
  if (!numbers || numbers.length < 2) {
    return {
      ok: false,
      error:
        'No pude leer dos números. Ejemplo válido: -38.984639, -61.314917 (primero latitud, después longitud).',
    };
  }

  // Con coma decimal ("-38,98 -61,31") los grupos ya vienen separados por el
  // regex, así que sólo hay que normalizar el separador de cada número.
  const lat = Number(numbers[0].replace(',', '.'));
  const lng = Number(numbers[1].replace(',', '.'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return { ok: false, error: 'Los valores no son números válidos.' };
  }

  return finish({ lat, lng });
}

function finish(value: LatLng): ParseResult {
  const rounded = {
    lat: Number(value.lat.toFixed(6)),
    lng: Number(value.lng.toFixed(6)),
  };

  if (rounded.lat < -90 || rounded.lat > 90) {
    return { ok: false, error: 'La latitud debe estar entre -90 y 90.' };
  }
  if (rounded.lng < -180 || rounded.lng > 180) {
    return { ok: false, error: 'La longitud debe estar entre -180 y 180.' };
  }

  if (looksSwapped(rounded)) {
    return {
      ok: true,
      value: { lat: rounded.lng, lng: rounded.lat },
      note: 'Los valores estaban invertidos (longitud primero). Los di vuelta automáticamente.',
    };
  }

  if (!isInArgentina(rounded)) {
    return {
      ok: true,
      value: rounded,
      note: 'Ojo: ese punto cae fuera de Argentina. Verificá en el mapa antes de guardar.',
    };
  }

  return { ok: true, value: rounded };
}

/** Formato de una coordenada para mostrar en pantalla. */
export function formatLatLng({ lat, lng }: LatLng) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}
