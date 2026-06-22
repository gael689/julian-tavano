'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { PROTOTIPOS_DATA } from '@/lib/data/prototipos';
import { ProtoCard } from '@/components/proto/ProtoCard';

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
