'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import TextReveal from '@/components/ui/TextReveal';

export default function CustomProjects() {
  const t = useTranslations('customProjects');
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-60px' });



  return (
    <section
      id="proyectos-personalizados"
      className="relative overflow-hidden bg-charcoal py-14 md:py-20"
      ref={sectionRef}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Content: título izquierda, botón derecha ── */}
      <div className="container-layout relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-16">

          {/* Left: eyebrow + title */}
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-eyebrow text-olive mb-4"
            >
              {t('title')}
            </motion.p>

            <TextReveal
              text={t('text')}
              className="text-h1 text-cream leading-tight"
            />
          </div>

          {/* Right: pill button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <a
              href="#contacto"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-olive text-cream text-sm font-bold tracking-widest hover:bg-olive-deep transition-colors whitespace-nowrap"
            >
              {t('cta')}
              <span aria-hidden="true">→</span>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
