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
    <section className="relative min-h-screen bg-charcoal overflow-hidden">

      {/* Image — absolutely positioned on the right half, never affects layout */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[55%]">
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
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </motion.div>
        {/* Gradient masking left edge on desktop so text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/60 to-transparent lg:via-charcoal/20" />
      </div>

      {/* Content — uses container-layout, same as the navbar */}
      <div className="container-layout relative z-10 min-h-screen flex flex-col justify-between py-32">

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

        {/* Title + specs — left half on desktop */}
        <div className="lg:max-w-[48%]">

          {/* Type label (Cabaña / Casa) */}
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

          {/* Name */}
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

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="text-cream/45 mt-5 tracking-[0.25em] uppercase text-sm"
          >
            {tagline}
          </motion.p>

          {/* Specs */}
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

          {/* CTA scroll */}
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

        {/* Bottom spacer */}
        <div />
      </div>

    </section>
  );
}
