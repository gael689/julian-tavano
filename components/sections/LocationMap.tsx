'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

export default function LocationMap() {
  const t = useTranslations('location');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="bg-concrete section-padding" ref={ref}>
      <div className="container-layout">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
        >
          <div>
            <p className="text-eyebrow text-olive mb-5">{t('eyebrow')}</p>
            <h2 className="text-h2 text-charcoal mb-5 leading-tight">{t('title')}</h2>
            <p className="text-body-l text-charcoal/70 mb-8">{t('desc')}</p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=ARQUITECTO+Julian+Tavano"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-olive-deep text-cream font-semibold text-sm hover:bg-olive transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-olive/20 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3101.4359126463714!2d-61.27878632349037!3d-38.982546571705925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x958d53c52357f927%3A0xfacf3086dabc1de4!2sARQUITECTO%20Julian%20Tavano!5e0!3m2!1ses!2sar!4v1785423496070!5m2!1ses!2sar"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0, filter: 'grayscale(0.15) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title={t('title')}
              allowFullScreen
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
