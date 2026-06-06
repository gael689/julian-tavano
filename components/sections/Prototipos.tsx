'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';
import { PROTOTIPOS_DATA, type Prototipo } from '@/lib/data/prototipos';

function ProtoCard({ proto, index, wide }: { proto: Prototipo; index: number; wide?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const t = useTranslations('prototipos');
  const tp = useTranslations('protoPage');

  const typeLabel  = proto.type === 'casa' ? tp('type_casa') : tp('type_cabana');
  const displayName = `${typeLabel} ${proto.name}`;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden bg-charcoal-soft${wide ? ' md:col-span-2' : ''}`}
      style={{ borderRadius: '2px' }}
    >
      <div className="relative overflow-hidden" style={{ minHeight: '400px', height: '100%' }}>
        <Image
          src={proto.images[0].src}
          alt={proto.images[0].alt}
          fill
          quality={85}
          className="object-cover object-center"
          sizes={wide ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
        />

        <div className="absolute inset-0 bg-charcoal/35" />

        <div className="absolute top-4 right-4 z-10 text-cream/40 text-xs font-mono tracking-widest">
          {proto.specs.coveredArea} m²
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-transparent pt-16 px-5 pb-5">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-cream/55 text-[10px] tracking-[0.2em] uppercase font-bold mb-1">
                {proto.specs.coveredArea} m²
                {proto.specs.semiCoveredArea ? ` + ${proto.specs.semiCoveredArea} m² semi` : ''}
                {' · '}
                {proto.specs.bedrooms} dorm.
              </p>
              <h3
                className="text-cream font-bold text-xl md:text-2xl leading-tight"
                style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
              >
                {displayName}
              </h3>
            </div>

            <div className="shrink-0">
              <a
                href={`/prototipos/${proto.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-olive text-cream text-[10px] font-bold tracking-widest hover:bg-olive-deep transition-colors whitespace-nowrap"
              >
                {t('explorar')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Prototipos() {
  const t = useTranslations('prototipos');
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  const isOdd = PROTOTIPOS_DATA.length % 2 !== 0;

  return (
    <section id="prototipos" className="bg-cream section-padding">
      <div className="container-layout">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 md:mb-20 flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between items-start lg:items-end"
        >
          <div className="max-w-2xl">
            <p className="text-eyebrow text-olive mb-4">{t('eyebrow')}</p>
            <h2 className="text-h1 text-charcoal">{t('title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 max-w-2xl shrink-0 pb-2">
            {(['galpon', 'entrega', 'traslado', 'cero_conflicto'] as const).map((key) => (
              <div key={key} className="flex items-start gap-3 text-base md:text-lg text-charcoal/80">
                <span className="text-olive font-bold text-xl mt-0.5 shrink-0">✓</span>
                <span className="leading-snug">{t(`diferenciales.${key}`)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {PROTOTIPOS_DATA.map((proto, i) => {
            const isLast = i === PROTOTIPOS_DATA.length - 1;
            return (
              <ProtoCard
                key={proto.id}
                proto={proto}
                index={i}
                wide={isOdd && isLast}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
