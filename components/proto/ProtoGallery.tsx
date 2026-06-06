'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

type GalleryImage = { src: string; alt: string; caption?: string };

function GalleryImg({
  img,
  index,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: {
  img: GalleryImage;
  index: number;
  sizes?: string;
  priority?: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden bg-charcoal-soft group h-full"
    >
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          quality={88}
          priority={priority}
          className="object-cover object-center"
          sizes={sizes}
        />
      </motion.div>
      {img.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-charcoal/55 to-transparent pointer-events-none">
          <p className="text-white/70 text-[10px] font-bold tracking-[0.25em] uppercase">
            {img.caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function ProtoGallery({ images }: { images: GalleryImage[] }) {
  const t = useTranslations('protoPage');

  if (images.length < 2) return null;

  // First image → wide hero cell (aspect 3:2, mild horizontal crop)
  // Rest → 2-column grid with aspect-[4/5] matching the 4:5 portrait ratio exactly
  const [hero, ...rest] = images;

  // Separate odd last image to span full width
  const isOdd = rest.length % 2 !== 0;
  const gridImages = isOdd ? rest.slice(0, -1) : rest;
  const lastSolo   = isOdd ? rest[rest.length - 1] : null;

  return (
    <div className="bg-cream pt-6 pb-4 px-4 md:px-6">
      <div className="mb-4 px-1">
        <p className="text-eyebrow text-olive">{t('galeria')}</p>
      </div>

      {/* Hero image — full width, aspect 16:9 */}
      <div className="relative aspect-[16/9] overflow-hidden mb-2 md:mb-3">
        <GalleryImg img={hero} index={0} sizes="100vw" priority />
      </div>

      {/* 2-column grid — aspect square */}
      {gridImages.length > 0 && (
        <div className="grid grid-cols-2 gap-2 md:gap-3 mb-2 md:mb-3">
          {gridImages.map((img, i) => (
            <div key={img.src} className="relative aspect-square overflow-hidden">
              <GalleryImg
                img={img}
                index={i + 1}
                sizes="(max-width: 768px) 50vw, 45vw"
              />
            </div>
          ))}
        </div>
      )}

      {/* Last image when odd count — full width, aspect 16:9 */}
      {lastSolo && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <GalleryImg
            img={lastSolo}
            index={rest.length}
            sizes="100vw"
          />
        </div>
      )}
    </div>
  );
}
