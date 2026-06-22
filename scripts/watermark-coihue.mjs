import sharp from 'sharp';
import { renameSync, rmSync } from 'fs';

const OLIVE = '#A8C490';
const MARGIN = 20;
const FILE = 'public/prototipos/cabana-coihue/imagenes/01.jpg';

const { width } = await sharp(FILE).metadata();
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
  <text x="${textX}" y="${y1}"
    font-family="'Century Gothic','Futura','Trebuchet MS',Arial,sans-serif"
    font-size="${fs1}" font-weight="bold" fill="${OLIVE}"
    text-anchor="end" letter-spacing="${ls1}">JULIÁN TAVANO</text>
  <text x="${textX}" y="${y2}"
    font-family="'Century Gothic','Futura','Trebuchet MS',Arial,sans-serif"
    font-size="${fs2}" font-weight="bold" fill="${OLIVE}"
    text-anchor="end" letter-spacing="${ls2}">ARQUITECTO</text>
</svg>`;

const tmp = FILE + '.tmp';
await sharp(FILE)
  .composite([{ input: Buffer.from(svg), top: MARGIN, left: Math.max(0, width - svgW - MARGIN) }])
  .jpeg({ quality: 93 })
  .toFile(tmp);

rmSync(FILE);
renameSync(tmp, FILE);
console.log(`✓ Watermark aplicado a ${FILE} (${width}px)`);
