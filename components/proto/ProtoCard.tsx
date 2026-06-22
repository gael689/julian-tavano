'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef } from 'react';
import { Link } from '@/routing';
import type { Prototipo } from '@/lib/data/prototipos';

export function ProtoCard({
  proto,
  index,
  wide,
  external = true,
  compact = false,
}: {
  proto: Prototipo;
  index: number;
  wide?: boolean;
  external?: boolean;
  compact?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const tp = useTranslations('protoPage');
  const t  = useTranslations('prototipos');

  const typeLabel   = proto.type === 'casa' ? tp('type_casa') : tp('type_cabana');
  const displayName = `${typeLabel} ${proto.name}`;

  const innerContent = (
    <div
      className={`relative overflow-hidden ${compact ? 'min-h-[180px] md:min-h-[400px]' : 'min-h-[400px]'}`}
      style={{ height: '100%' }}
    >
      <Image
        src={proto.images[0].src}
        alt={proto.images[0].alt}
        fill
        quality={85}
        className="object-cover object-center"
        sizes={wide ? '100vw' : '(max-width: 768px) 50vw, 50vw'}
      />

      <div className="absolute inset-0 bg-charcoal/35" />

      <div className={`absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-charcoal/95 via-charcoal/70 to-transparent ${compact ? 'pt-8 md:pt-16 px-3 md:px-5 pb-3 md:pb-5' : 'pt-16 px-5 pb-5'}`}>

        {/* Specs */}
        <p className={`text-cream/55 uppercase font-bold mb-1 ${compact ? 'text-[9px] md:text-[10px] tracking-[0.15em] md:tracking-[0.2em]' : 'text-[10px] tracking-[0.2em]'}`}>
          {compact ? (
            <>{proto.specs.coveredArea} m²</>
          ) : (
            <>
              {proto.specs.coveredArea} m²
              {proto.specs.semiCoveredArea ? ` + ${proto.specs.semiCoveredArea} m² semi` : ''}
              {' · '}
              {proto.specs.bedrooms} dorm.
            </>
          )}
        </p>

        <div className="flex items-end justify-between gap-2 md:gap-4">
          {/* Nombre */}
          <h3
            className={`text-cream font-bold leading-tight min-w-0 ${compact ? 'text-sm md:text-xl lg:text-2xl' : 'text-xl md:text-2xl'}`}
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            {compact ? (
              <>
                {/* Mobile: siempre 2 líneas */}
                <span className="md:hidden">
                  <span className="block">{typeLabel}</span>
                  <span className="block">{proto.name}</span>
                </span>
                {/* Desktop: fluye naturalmente */}
                <span className="hidden md:inline">{displayName}</span>
              </>
            ) : displayName}
          </h3>

          {/* Botón */}
          <div className="shrink-0">
            {compact ? (
              <>
                {/* Mobile: círculo olive con flecha cream */}
                <span className="md:hidden inline-flex items-center justify-center w-7 h-7 rounded-full bg-olive">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="6.5" x2="11" y2="6.5" />
                    <polyline points="7,2.5 11,6.5 7,10.5" />
                  </svg>
                </span>
                {/* Desktop: botón igual que home */}
                <span className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 bg-olive text-cream text-[10px] font-bold tracking-widest whitespace-nowrap">
                  {t('explorar')}
                </span>
              </>
            ) : external ? (
              <a
                href={`/prototipos/${proto.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-olive text-cream text-[10px] font-bold tracking-widest hover:bg-olive-deep transition-colors whitespace-nowrap"
              >
                {t('explorar')}
              </a>
            ) : (
              <Link
                href={`/prototipos/${proto.id}` as never}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-olive text-cream text-[10px] font-bold tracking-widest hover:bg-olive-deep transition-colors whitespace-nowrap"
              >
                {t('explorar')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden bg-charcoal-soft${wide ? ' col-span-2' : ''}`}
      style={{ borderRadius: '2px' }}
    >
      {compact ? (
        <Link href={`/prototipos/${proto.id}` as never} className="block">
          {innerContent}
        </Link>
      ) : (
        innerContent
      )}
    </motion.article>
  );
}
