import sharp from 'sharp';
import { readdirSync, renameSync, rmSync } from 'fs';
import { join } from 'path';

const ROOT   = 'public/prototipos';
const MARGIN = 20;
const OLIVE  = '#A8C490';

// Hero image — no watermark
const EXCLUDE = 'public/prototipos/cabana-coihue/imagenes/01.jpg';

async function addWatermark(filePath) {
  const normalized = filePath.replaceAll('\\', '/');
  if (normalized === EXCLUDE) {
    console.log(`⏭  Skipped (hero): ${normalized}`);
    return;
  }

  const { width } = await sharp(filePath).metadata();

  const scale  = Math.max(0.7, Math.min(1.8, width / 1200));
  const fs1    = Math.round(22 * scale);
  const fs2    = Math.round(14 * scale);
  const ls1    = Math.round(2  * scale);
  const ls2    = Math.round(3  * scale);
  const svgW   = Math.round(310 * scale);
  const svgH   = Math.round(66  * scale);
  const textX  = svgW - Math.round(10 * scale);
  const y1     = Math.round(svgH * 0.46);
  const y2     = y1 + Math.round(24 * scale);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}">
    <text
      x="${textX}" y="${y1}"
      font-family="'Century Gothic','Futura','Trebuchet MS',Arial,sans-serif"
      font-size="${fs1}" font-weight="bold"
      fill="${OLIVE}"
      text-anchor="end"
      letter-spacing="${ls1}"
    >JULIÁN TAVANO</text>
    <text
      x="${textX}" y="${y2}"
      font-family="'Century Gothic','Futura','Trebuchet MS',Arial,sans-serif"
      font-size="${fs2}" font-weight="bold"
      fill="${OLIVE}"
      text-anchor="end"
      letter-spacing="${ls2}"
    >ARQUITECTO</text>
  </svg>`;

  const left   = Math.max(0, width - svgW - MARGIN);
  const tmpPath = filePath + '.tmp';

  await sharp(filePath)
    .composite([{ input: Buffer.from(svg), top: MARGIN, left }])
    .jpeg({ quality: 93 })
    .toFile(tmpPath);

  rmSync(filePath);
  renameSync(tmpPath, filePath);
  console.log(`✓ ${normalized} (${width}px)`);
}

// Recorre todas las subcarpetas de /public/prototipos
const folders = readdirSync(ROOT, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => join(ROOT, d.name, 'imagenes'));

let total = 0;
for (const folder of folders) {
  let files;
  try { files = readdirSync(folder).filter(f => f.endsWith('.jpg')); }
  catch { continue; }

  for (const file of files) {
    await addWatermark(join(folder, file).replaceAll('\\', '/'));
    total++;
  }
}

console.log(`\n✓ ${total} imágenes procesadas.`);
