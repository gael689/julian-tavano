'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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

export default function ProtoHeroSection({ label, name, tagline, heroImage, specs }: Props) {
  const t = useTranslations('protoPage');

  return (
    <section className="relative bg-charcoal overflow-hidden">

      {/* ── Desktop only: absolute image on right half ── */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-[55%]">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.3, delay: 0.15, ease }}
        >
          <motion.div
            className="w-full h-full"
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
              className="object-cover object-top"
              sizes="55vw"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/20 to-transparent" />
      </div>

      {/* ── Text content ── */}
      <div className="container-layout relative z-10 lg:min-h-screen lg:flex lg:flex-col lg:justify-between lg:py-32 pt-32 pb-10 lg:pb-0">

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
        <div className="lg:max-w-[48%] mt-10 lg:mt-0">

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

      {/* ── Mobile only: image below content, with top shadow ── */}
      <div className="lg:hidden relative aspect-[3/2] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.3, delay: 0.3, ease }}
        >
          <motion.div
            className="w-full h-full"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
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
          </motion.div>
        </motion.div>
        {/* Top shadow — blends image into the charcoal text section above */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-charcoal to-transparent pointer-events-none" />
      </div>

    </section>
  );
}
