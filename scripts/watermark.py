#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
watermark.py
------------
Marca de agua nueva (revisión sep/2026, Etapa 5 del plan): más grande y
visible que la anterior (un texto chico arriba a la derecha, "JULIÁN TAVANO
/ ARQUITECTO" en verde claro, casi invisible). Abajo a la derecha, con un
respaldo oscuro translúcido detrás del texto para que se lea sobre
cualquier imagen, clara u oscura.

No hay isotipo vectorial todavía (ver docs/plan-revision-2026-09.md) — esta
marca es solo texto, con la tipografía del sitio (Montserrat).

Los renders ya tenían una marca vieja (arriba a la derecha) sin un archivo
"original" sin marca disponible para la mayoría — esta se agrega encima, no
la reemplaza. Sí revisar visualmente el resultado antes de confiar en él:
este script pisa los archivos en su lugar (son parte del repo git, así que
`git checkout -- <archivo>` deshace cualquier corrida si hace falta).

Uso:
    python scripts/watermark.py                  # todas las imágenes de public/prototipos
    python scripts/watermark.py --dry-run         # solo lista qué tocaría
    python scripts/watermark.py --dir public/prototipos/casa-cardon/imagenes
"""

import argparse
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).parent.parent
FONT_BOLD = ROOT / "scripts" / "assets" / "fonts" / "Montserrat-Bold.ttf"
FONT_SEMIBOLD = ROOT / "scripts" / "assets" / "fonts" / "Montserrat-SemiBold.ttf"

LINE1 = "JULIÁN TAVANO"
LINE2 = "ARQUITECTO"

# Proporciones relativas al ancho de cada imagen, para que la marca se vea
# consistente sin importar la resolución del render.
MARGIN_RATIO = 0.028
LINE1_SIZE_RATIO = 0.025
LINE2_SIZE_RATIO = 0.0135
LINE_GAP_RATIO = 0.010
TRACKING_RATIO = 0.055  # espaciado entre letras de la línea 2, relativo a su tamaño de fuente

TEXT_OPACITY = 165        # 0-255, blanco
BACKING_OPACITY = 90       # 0-255, panel oscuro detrás del texto
BACKING_PAD_RATIO = 0.4   # padding del panel relativo al alto del bloque de texto


def tracked_text_size(draw: "ImageDraw.ImageDraw", text: str, font: "ImageFont.FreeTypeFont", tracking: float):
    width = 0
    height = 0
    for ch in text:
        bbox = draw.textbbox((0, 0), ch, font=font)
        width += (bbox[2] - bbox[0]) + tracking
        height = max(height, bbox[3] - bbox[1])
    return width - tracking, height


def draw_tracked_text(draw, xy, text, font, fill, tracking, anchor_right):
    x, y = xy
    widths = []
    for ch in text:
        bbox = draw.textbbox((0, 0), ch, font=font)
        widths.append(bbox[2] - bbox[0])
    total = sum(widths) + tracking * (len(text) - 1)
    cur_x = x - total if anchor_right else x
    for ch, w in zip(text, widths):
        draw.text((cur_x, y), ch, font=font, fill=fill)
        cur_x += w + tracking


def watermark_image(path: Path, dry_run: bool = False) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size

    margin = int(w * MARGIN_RATIO)
    size1 = max(14, int(w * LINE1_SIZE_RATIO))
    size2 = max(10, int(w * LINE2_SIZE_RATIO))
    gap = int(h * LINE_GAP_RATIO)
    tracking = size2 * TRACKING_RATIO

    font1 = ImageFont.truetype(str(FONT_BOLD), size1)
    font2 = ImageFont.truetype(str(FONT_SEMIBOLD), size2)

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    bbox1 = draw.textbbox((0, 0), LINE1, font=font1)
    w1, h1 = bbox1[2] - bbox1[0], bbox1[3] - bbox1[1]
    w2, h2 = tracked_text_size(draw, LINE2, font2, tracking)

    block_w = max(w1, w2)
    block_h = h1 + gap + h2

    right_x = w - margin
    bottom_y = h - margin
    top_y = bottom_y - block_h

    # Panel translúcido oscuro detrás del texto, para que se lea sobre
    # cualquier imagen. Esquinas redondeadas, sin blur pesado.
    pad = int(block_h * BACKING_PAD_RATIO)
    panel = Image.new("RGBA", img.size, (0, 0, 0, 0))
    panel_draw = ImageDraw.Draw(panel)
    panel_draw.rounded_rectangle(
        [right_x - block_w - pad, top_y - pad, right_x + pad, bottom_y + pad],
        radius=pad,
        fill=(20, 24, 22, BACKING_OPACITY),
    )
    panel = panel.filter(ImageFilter.GaussianBlur(pad * 0.35))
    overlay = Image.alpha_composite(overlay, panel)
    draw = ImageDraw.Draw(overlay)

    # Línea 1: alineada a la derecha, en right_x.
    draw.text((right_x - w1, top_y - bbox1[1]), LINE1, font=font1, fill=(255, 255, 255, TEXT_OPACITY))
    # Línea 2: tracked, alineada a la derecha también.
    draw_tracked_text(
        draw,
        (right_x, top_y + h1 + gap),
        LINE2,
        font2,
        (255, 255, 255, TEXT_OPACITY),
        tracking,
        anchor_right=True,
    )

    result = Image.alpha_composite(img, overlay).convert("RGB")

    if dry_run:
        print(f"[dry-run] {path}  ({w}x{h})")
        return

    result.save(path, "JPEG", quality=92, optimize=True)
    print(f"[ok] {path}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dir", type=Path, default=ROOT / "public" / "prototipos",
                         help="Carpeta a procesar (default: public/prototipos, recursivo)")
    parser.add_argument("--dry-run", action="store_true", help="Solo lista los archivos, no escribe nada")
    args = parser.parse_args()

    if not FONT_BOLD.exists() or not FONT_SEMIBOLD.exists():
        print(f"[ERROR] Faltan las fuentes en {FONT_BOLD.parent}")
        sys.exit(1)

    images = sorted(args.dir.rglob("*.jpg"))
    if not images:
        print(f"[AVISO] No se encontraron .jpg en {args.dir}")
        return

    print(f"Procesando {len(images)} imagen(es) en {args.dir}\n")
    for path in images:
        watermark_image(path, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
