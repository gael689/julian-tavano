'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * Los cuatro CTA comparten forma; sólo cambia el color. `whitespace-nowrap`
 * evita que una etiqueta se parta en dos renglones y desalinee la fila.
 */
const ctaBase =
  'inline-flex items-center justify-center gap-2 rounded-full text-cream font-semibold ' +
  'whitespace-nowrap transition-all shadow-[0_2px_12px_rgba(0,0,0,0.35)] ' +
  'px-6 py-3 text-sm lg:px-4 lg:py-2.5 lg:text-[13px] xl:px-6 xl:py-3 xl:text-base';

export default function Hero({ obrasCount }: { obrasCount: number }) {
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
            src="/prototipos/casa-cardon/imagenes/07.jpg"
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
            className="pointer-events-auto"
          >
            <motion.h1
              variants={itemVariants}
              className="font-display font-bold leading-[1.05] mb-6 break-words text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] max-w-3xl"
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
              {t('subtitle', { count: obrasCount })}
            </motion.p>

            {/* Los 4 CTA en una sola fila desde lg — abajo de ese ancho no
                entran las etiquetas en español, así que se apilan. */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-stretch gap-3 lg:flex-row lg:flex-nowrap lg:items-center lg:gap-3 xl:gap-4"
            >
              <Link
                href="#modelos"
                className={`${ctaBase} bg-olive-deep hover:bg-olive`}
              >
                {t('ctas.prototipos')}
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href="#proyectos-personalizados"
                className={`${ctaBase} bg-wood hover:brightness-110`}
              >
                {t('ctas.aMedida')}
                <span aria-hidden="true">→</span>
              </Link>
              <a
                href="/obras"
                target="_blank"
                rel="noopener noreferrer"
                className={`${ctaBase} bg-charcoal hover:bg-charcoal-soft`}
              >
                {t('ctas.obras')}
                <span aria-hidden="true">→</span>
              </a>
              <Link
                href="#inversion"
                className={`${ctaBase} bg-olive-soft hover:bg-olive`}
              >
                {t('ctas.inversiones')}
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
