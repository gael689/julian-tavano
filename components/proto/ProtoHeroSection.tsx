'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLightbox } from './LightboxProvider';

type Spec = { value: number | string; unit: string; label: string };

interface Props {
  label: string;
  name: string;
  tagline: string;
  heroImage: { src: string; alt: string };
  specs: Spec[];
}

const ease = [0.76, 0, 0.24, 1] as const;
const TITLE_SIZE = 'clamp(2.8rem, 6.5vw, 6.5rem)';
const TITLE_SIZE_MOBILE = 'clamp(2.4rem, 9vw, 3.6rem)';

export default function ProtoHeroSection({ label, name, tagline, heroImage, specs }: Props) {
  const t = useTranslations('protoPage');
  const { open } = useLightbox();

  return (
    <section className="relative bg-charcoal overflow-hidden">

      {/* Top scrim — ensures logo/navbar always readable over hero image */}
      <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 to-transparent pointer-events-none z-[5]" />

      {/* ── Desktop only: absolute image on right half ── */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[55%]">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.3, delay: 0.15, ease }}
        >
          <motion.button
            type="button"
            onClick={() => open(0)}
            aria-label={heroImage.alt}
            className="w-full h-full block cursor-zoom-in group"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              quality={95}
              className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.015]"
              sizes="55vw"
            />
          </motion.button>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/20 to-transparent pointer-events-none" />
      </div>

      {/* ── Mobile only: full-screen image FIRST ── */}
      <div className="lg:hidden relative h-[100dvh] overflow-hidden">
        <motion.button
          type="button"
          onClick={() => open(0)}
          aria-label={heroImage.alt}
          className="absolute inset-0 w-full h-full block cursor-zoom-in"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            quality={95}
            className="object-cover object-top"
            sizes="100vw"
          />
        </motion.button>

        {/* Bottom scrim for title legibility */}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent pointer-events-none" />
        {/* Top scrim for back link */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-charcoal/80 to-transparent pointer-events-none" />

        {/* Back link — top left over image, clears navbar + extra 5dvh */}
        <div className="absolute top-0 left-0 right-0 z-10 container-layout" style={{ paddingTop: 'calc(var(--nav-h, 4.5rem) + 1rem + 5dvh)' }}>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              href="/#prototipos"
              className="inline-flex items-center gap-2 text-cream text-xs font-bold tracking-widest uppercase transition-all bg-black/35 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-black/50"
            >
              {t('back')}
            </Link>
          </motion.div>
        </div>

        {/* Title overlaid at bottom-left + scroll indicator bottom-right */}
        <div className="absolute bottom-0 left-0 right-0 z-10 container-layout pb-8 flex items-end justify-between gap-4">
          {/* Title stacked as a single column */}
          <div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, delay: 0.5, ease }}
                className="block text-cream font-bold leading-none"
                style={{ fontFamily: "'Century Gothic', Futura, sans-serif", fontSize: TITLE_SIZE_MOBILE, letterSpacing: '-0.01em' }}
              >
                {label}
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.85, delay: 0.62, ease }}
                className="block text-cream font-bold leading-none"
                style={{ fontFamily: "'Century Gothic', Futura, sans-serif", fontSize: TITLE_SIZE_MOBILE, letterSpacing: '-0.01em' }}
              >
                {name}
              </motion.span>
            </div>
          </div>

          {/* Scroll indicator — bottom right */}
          <motion.a
            href="#descripcion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex items-center gap-1.5 shrink-0 pb-1"
          >
            <span
              className="text-cream/50 font-bold uppercase whitespace-nowrap"
              style={{ fontSize: '8px', letterSpacing: '0.18em' }}
            >
              {t('scroll_hint')}
            </span>
            <span className="arrow-float text-cream/45 leading-none inline-block" style={{ fontSize: '10px' }}>
              ↓
            </span>
          </motion.a>
        </div>
      </div>

      {/* ── Mobile only: specs + CTA below the image ── */}
      <div className="lg:hidden container-layout py-10 pb-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="text-cream/45 tracking-[0.25em] uppercase text-sm mb-8"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-wrap gap-x-7 gap-y-3 pt-8 border-t border-cream/10 mb-8"
        >
          {specs.map(({ value, unit, label: specLabel }) => (
            <div key={specLabel}>
              <span
                className="text-cream font-bold tabular-nums"
                style={{ fontFamily: "'Century Gothic', Futura, sans-serif", fontSize: 'clamp(1.3rem, 5vw, 1.9rem)' }}
              >
                {value}{unit}
              </span>
              <p className="text-cream/35 text-[9px] font-bold tracking-[0.3em] uppercase mt-0.5">{specLabel}</p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* ── Desktop only: text content (left side, full height) ── */}
      <div className="hidden lg:flex container-layout relative z-10 lg:min-h-screen lg:flex-col lg:justify-between lg:py-32">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link
            href="/#prototipos"
            className="inline-flex items-center gap-2 text-cream/40 hover:text-cream text-xs font-bold tracking-widest uppercase transition-colors"
          >
            {t('back')}
          </Link>
        </motion.div>

        {/* Title + specs */}
        <div className="lg:max-w-[48%]">

          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.85, delay: 1.0, ease }}
              className="block text-cream font-bold leading-none"
              style={{ fontFamily: "'Century Gothic', Futura, sans-serif", fontSize: TITLE_SIZE, letterSpacing: '-0.01em' }}
            >
              {label}
            </motion.span>
          </div>

          <div className="overflow-hidden">
            <motion.span
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.85, delay: 1.1, ease }}
              className="block text-cream font-bold leading-none"
              style={{ fontFamily: "'Century Gothic', Futura, sans-serif", fontSize: TITLE_SIZE, letterSpacing: '-0.01em' }}
            >
              {name}
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="text-cream/45 mt-5 tracking-[0.25em] uppercase text-sm"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.45 }}
            className="flex flex-wrap gap-x-7 gap-y-3 mt-8 pt-8 border-t border-cream/10"
          >
            {specs.map(({ value, unit, label: specLabel }) => (
              <div key={specLabel}>
                <span
                  className="text-cream font-bold tabular-nums"
                  style={{ fontFamily: "'Century Gothic', Futura, sans-serif", fontSize: 'clamp(1.3rem, 2.5vw, 1.9rem)' }}
                >
                  {value}{unit}
                </span>
                <p className="text-cream/35 text-[9px] font-bold tracking-[0.3em] uppercase mt-0.5">{specLabel}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="mt-8"
          >
            <a
              href="#descripcion"
              className="inline-flex items-center gap-3 px-6 py-3 bg-olive text-cream text-xs font-bold tracking-widest hover:bg-olive-deep transition-colors"
            >
              {t('conoce_mas')}
              <span className="text-base leading-none">↓</span>
            </a>
          </motion.div>
        </div>

        {/* Desktop spacer */}
        <div className="hidden lg:block" />
      </div>

    </section>
  );
}
