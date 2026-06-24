'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

function useTypewriter(text: string, isActive: boolean, speed = 70) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    setDisplayed('');
    setDone(false);
    let i = 0;
    const startDelay = setTimeout(() => {
      const tick = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(tick);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(tick);
    }, 400);
    return () => clearTimeout(startDelay);
  }, [isActive, text, speed]);

  return { displayed, done };
}

export default function ObrasTeaser() {
  const t = useTranslations('obras');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const titleText = t('title_home');
  const { displayed: typedTitle, done: typingDone } = useTypewriter(titleText, inView, 70);

  return (
    <section id="mapa-obras" ref={ref} className="relative overflow-hidden bg-charcoal">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/prototipos/cabana-brote/imagenes/01.jpg"
          alt=""
          fill
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-charcoal/72" />
      </div>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Reveal wipe */}
      <motion.div
        className="absolute inset-0 bg-charcoal z-20 pointer-events-none"
        initial={{ scaleX: 1 }}
        animate={inView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: 'right' }}
      />

      <div className="container-layout relative z-10 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-20">

          {/* Left: title + description */}
          <div className="max-w-2xl">

            {/*
              Full text is always in the DOM — layout and wrapping are fixed from the start.
              Typed chars are cream, remaining chars are opacity-0 (invisible but space-holding).
              No layout jump, no line-break surprise mid-animation.
            */}
            <div className="text-h1 text-cream leading-tight mb-5" aria-label={titleText}>
              {typedTitle}
              <span className="opacity-0 select-none" aria-hidden="true">
                {titleText.slice(typedTitle.length)}
              </span>
              {inView && !typingDone && (
                <span className="inline-block w-[3px] h-[0.85em] bg-olive align-middle ml-0.5 animate-pulse" />
              )}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={typingDone ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-body text-cream/85 max-w-lg"
            >
              {t('home_desc')}
            </motion.p>
          </div>

          {/* Right: CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={typingDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="shrink-0"
          >
            <a
              href="/obras"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-cream text-charcoal text-sm font-bold tracking-widest hover:bg-cream-light transition-colors whitespace-nowrap shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
            >
              {t('map_cta')}
              <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
