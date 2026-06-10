'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-charcoal select-none">
      {/* ── Background image ─────────────────────────── */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full hero-ken-burns"
          style={{ transformOrigin: 'center center' }}
        >
          <Image
            src="/prototipos/cabana-coihue/imagenes/01.jpg"
            alt=""
            fill
            priority
            quality={90}
            className="object-cover pointer-events-none"
          />
        </div>
        {/* Top gradient — covers nav area */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-transparent pointer-events-none" />
        {/* Bottom scrim — denser at the content zone for subtitle legibility */}
        <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none" />
      </div>

      {/* ── Content — anchored to bottom-left ────────── */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none"
        style={{ paddingTop: 'var(--nav-h, 9rem)', paddingBottom: '6rem' }}
      >
        <div className="container-layout w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
            className="max-w-3xl pointer-events-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold leading-[1.05] mb-6 break-words text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)' }}
            >
              {t('title')}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg font-semibold text-cream mb-10 max-w-2xl"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,1)',
              }}
            >
              {t('subtitle')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4"
            >
              <Link
                href="#prototipos"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-olive-deep text-cream font-semibold text-sm md:text-base hover:bg-olive transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
              >
                {t('ctas.prototipos')}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="#proyectos-personalizados"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-wood text-cream font-semibold text-sm md:text-base hover:brightness-110 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
              >
                {t('ctas.aMedida')}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="/obras"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-charcoal text-cream font-semibold text-sm md:text-base hover:bg-charcoal-soft transition-colors shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
              >
                {t('ctas.obras')}
                <span aria-hidden="true">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────── */}
      <div className="absolute left-6 md:left-10 bottom-10 z-30 hidden md:flex flex-col items-center pointer-events-none">
        <div className="w-px h-16 bg-cream/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-cream/65 scroll-line-fill" />
        </div>
      </div>
    </section>
  );
}
