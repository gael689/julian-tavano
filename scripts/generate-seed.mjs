/**
 * Genera supabase/seed.sql a partir de los datos estáticos de lib/data/*.
 *
 *   node scripts/generate-seed.mjs
 *
 * Los datos estáticos siguen siendo el fallback del sitio cuando no hay
 * credenciales de Supabase, así que este script se puede volver a correr
 * si esos archivos cambian antes de la migración inicial.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Extrae el literal de array de un módulo TS y lo evalúa. */
function readArray(file, exportName) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const marker = source.indexOf(`export const ${exportName}`);
  if (marker === -1) throw new Error(`No encontré ${exportName} en ${file}`);
  // Saltear la anotación de tipo (`: Prototipo[]`) buscando primero el `=`.
  const start = source.indexOf('[', source.indexOf('=', marker));
  if (start === -1) throw new Error(`No encontré el array de ${exportName} en ${file}`);

  let depth = 0;
  let end = start;
  for (let i = start; i < source.length; i++) {
    if (source[i] === '[') depth++;
    else if (source[i] === ']' && --depth === 0) { end = i + 1; break; }
  }
  return new Function(`return ${source.slice(start, end)}`)();
}

const q = (v) =>
  v === undefined || v === null || v === '' ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const n = (v) => (v === undefined || v === null ? 'null' : Number(v));

const PROTOTIPOS = readArray('lib/data/prototipos.ts', 'PROTOTIPOS_DATA');
const OBRAS = readArray('lib/data/obras.ts', 'OBRAS');

const INVERSIONES = [
  {
    slug: 'los-aromos',
    nombre: 'Los Aromos',
    tipo: 'Fideicomiso',
    ubicacion: 'Monte Hermoso',
    detalle: '6 duplex · 70 m² c/u · a 150 m de la playa',
    estado: 'En desarrollo',
    entrega: 'Dic. 2026',
    pdf_url: '/inversiones/fideicomiso-los-aromos-2026.pdf',
  },
];

const out = [];
out.push('-- ============================================================================');
out.push('-- Seed: datos actuales del sitio (generado por scripts/generate-seed.mjs).');
out.push('-- Idempotente: se puede correr más de una vez sin duplicar.');
out.push('-- ============================================================================');
out.push('');

// ── Prototipos ──────────────────────────────────────────────────────────────
out.push('-- Prototipos ----------------------------------------------------------------');
PROTOTIPOS.forEach((p, i) => {
  out.push(
    `insert into public.prototipos (slug, type, name, tagline_es, tagline_en, description_es, description_en, covered_area, semi_covered_area, bedrooms, bathrooms, features_es, features_en, sort_order)`,
    `values (${q(p.id)}, ${q(p.type)}, ${q(p.name)}, ${q(p.tagline.es)}, ${q(p.tagline.en)}, ${q(p.description.es)}, ${q(p.description.en)}, ${n(p.specs.coveredArea)}, ${n(p.specs.semiCoveredArea)}, ${n(p.specs.bedrooms)}, ${n(p.specs.bathrooms)}, ${q(p.specs.features.es)}, ${q(p.specs.features.en)}, ${i})`,
    `on conflict (slug) do nothing;`,
    ''
  );
});

out.push('-- Imágenes de prototipos ----------------------------------------------------');
PROTOTIPOS.forEach((p) => {
  p.images.forEach((img, j) => {
    out.push(
      `insert into public.prototipo_images (prototipo_id, src, alt, caption, sort_order)`,
      `select id, ${q(img.src)}, ${q(img.alt)}, ${q(img.caption)}, ${j} from public.prototipos where slug = ${q(p.id)}`,
      `and not exists (select 1 from public.prototipo_images pi join public.prototipos pp on pp.id = pi.prototipo_id where pp.slug = ${q(p.id)} and pi.src = ${q(img.src)});`,
      ''
    );
  });
});

// ── Obras ───────────────────────────────────────────────────────────────────
out.push('-- Obras ---------------------------------------------------------------------');
OBRAS.forEach((o, i) => {
  const [lng, lat] = o.coordinates;
  out.push(
    `insert into public.obras (slug, name, location, lat, lng, description_es, description_en, year, category, sort_order)`,
    `values (${q(o.id)}, ${q(o.name)}, ${q(o.location)}, ${lat}, ${lng}, ${q(o.description?.es)}, ${q(o.description?.en)}, ${n(o.year)}, ${q(o.category ?? 'vivienda')}, ${i})`,
    `on conflict (slug) do nothing;`,
    ''
  );
  (o.images ?? []).forEach((img, j) => {
    out.push(
      `insert into public.obra_images (obra_id, src, alt, caption, sort_order)`,
      `select id, ${q(img.src)}, ${q(img.alt)}, ${q(img.caption)}, ${j} from public.obras where slug = ${q(o.id)}`,
      `and not exists (select 1 from public.obra_images oi join public.obras oo on oo.id = oi.obra_id where oo.slug = ${q(o.id)} and oi.src = ${q(img.src)});`,
      ''
    );
  });
});

// ── Inversiones ─────────────────────────────────────────────────────────────
out.push('-- Inversiones ---------------------------------------------------------------');
INVERSIONES.forEach((inv, i) => {
  out.push(
    `insert into public.inversiones (slug, nombre, tipo, ubicacion, detalle, estado, entrega, pdf_url, sort_order)`,
    `values (${q(inv.slug)}, ${q(inv.nombre)}, ${q(inv.tipo)}, ${q(inv.ubicacion)}, ${q(inv.detalle)}, ${q(inv.estado)}, ${q(inv.entrega)}, ${q(inv.pdf_url)}, ${i})`,
    `on conflict (slug) do nothing;`,
    ''
  );
});

fs.mkdirSync(path.join(root, 'supabase'), { recursive: true });
fs.writeFileSync(path.join(root, 'supabase/seed.sql'), out.join('\n'));
console.log(
  `supabase/seed.sql generado — ${PROTOTIPOS.length} prototipos, ${OBRAS.length} obras, ${INVERSIONES.length} inversiones.`
);
