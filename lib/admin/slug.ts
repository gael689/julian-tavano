/**
 * Genera el identificador de URL a partir del nombre.
 * "Cabaña Coihue" → "cabana-coihue" (igual que los slugs actuales).
 */
export function slugify(input: string) {
  return input
    .replace(/ñ/g, 'n')
    .replace(/Ñ/g, 'N')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '') // saca tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Sufija con -2, -3… hasta encontrar uno libre. */
export function uniqueSlug(base: string, taken: readonly string[]) {
  const slug = slugify(base) || 'sin-nombre';
  if (!taken.includes(slug)) return slug;

  let i = 2;
  while (taken.includes(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}
