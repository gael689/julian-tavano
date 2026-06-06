'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  { id: 'prototipos', image: '/prototipos/cabana-coihue/imagenes/01.jpg', anchor: '#prototipos' },
  { id: 'a_medida', image: '/prototipos/casa-jarilla/imagenes/01.jpg', anchor: '#proyectos-personalizados' },
  { id: 'obras', image: '/prototipos/casa-coral/imagenes/03.jpg', anchor: '/obras' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const } },
  exit:   { opacity: 0, y: -8, transition: { duration: 0.3 } },
};

export default function Hero() {
  const t = useTranslations('hero.carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused]         = useState(false);
  const [progress, setProgress]         = useState(0);
  const [isMounted, setIsMounted]       = useState(false);
  // Start as false (same as server), update client-side only → no hydration mismatch
  const [reducedMotion, setReducedMotion] = useState(false);

  const manualPauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTimeRef    = useRef<number>(0);
  const dragStartX     = useRef<number>(0);
  const dragStartY     = useRef<number>(0);
  const slideDuration  = 7000;

  // Mark mounted + resolve prefers-reduced-motion client-side only
  useEffect(() => {
    setIsMounted(true);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Visibility API: pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const goTo = (index: number, userInitiated = false) => {
    const next = (index + SLIDES.length) % SLIDES.length;
    setCurrentIndex(next);
    setProgress(0);

    if (userInitiated) {
      setIsPaused(true);
      if (manualPauseRef.current) clearTimeout(manualPauseRef.current);
      manualPauseRef.current = setTimeout(() => {
        manualPauseRef.current = null;
        setIsPaused(false);
      }, slideDuration);
    }
  };

  // RAF loop for progress bar + auto-advance
  useEffect(() => {
    if (reducedMotion) return;
    let rafId: number;

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!isPaused && !manualPauseRef.current) {
        setProgress(prev => {
          const next = prev + (delta / slideDuration) * 100;
          if (next >= 100) {
            setCurrentIndex(i => (i + 1) % SLIDES.length);
            return 0;
          }
          return next;
        });
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lastTimeRef.current = 0;
    };
  }, [isPaused, reducedMotion]);

  // Touch/pointer drag handlers — kept outside AnimatePresence to avoid hydration mismatch
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      goTo(currentIndex + (dx < 0 ? 1 : -1), true);
    }
  };

  const activeSlide = SLIDES[currentIndex];

  return (
    <section
      className="relative w-full h-[100dvh] overflow-hidden bg-charcoal select-none"
      aria-roledescription="carousel"
      onMouseEnter={() => { if (!manualPauseRef.current) setIsPaused(true);  }}
      onMouseLeave={() => { if (!manualPauseRef.current) setIsPaused(false); }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Screen reader live region */}
      <div aria-live="polite" className="sr-only">
        {t(`slide_${currentIndex + 1}.title`)}
      </div>

      {/* ── Background slides ─────────────────────────── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'linear' }}
        >
          {/* Ken Burns: pure CSS animation, starts after 1.5s crossfade.
              prefers-reduced-motion handled entirely in globals.css — no JS conditional
              to avoid SSR/client className mismatch. */}
          <div
            className="w-full h-full hero-ken-burns"
            style={{ transformOrigin: 'center center' }}
          >
            <Image
              src={activeSlide.image}
              alt=""
              fill
              priority={currentIndex === 0}
              quality={90}
              className="object-cover pointer-events-none"
            />
          </div>

          {/* Gradient overlay — stronger at top to not clash with logo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/65 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* ── Slide content — anchored to bottom-left ───── */}
      {/*
        pt-[var(--nav-h)] ensures text NEVER slides under the navbar/logo.
        --nav-h is set in Navigation so we can reference it here.
        Fallback: 9rem which is safely below a large logo.
      */}
      <div
        className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none"
        style={{ paddingTop: 'var(--nav-h, 9rem)', paddingBottom: '6rem' }}
      >
        <div className="container-layout w-full flex items-end justify-between gap-4">
          <div className="max-w-2xl w-full">
            <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="pointer-events-auto"
            >
              {/* Eyebrow */}
              <motion.p
                variants={itemVariants}
                className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 text-cream drop-shadow-[0_1px_6px_rgba(0,0,0,1)]"
              >
                {t(`slide_${currentIndex + 1}.eyebrow`)}
              </motion.p>

              {/* Title */}
              <motion.h2
                variants={itemVariants}
                className="font-display font-bold leading-[1.05] mb-4 break-words text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                style={{ fontSize: 'clamp(2rem, 5vw, 5rem)' }}
              >
                {t(`slide_${currentIndex + 1}.title`)}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-base md:text-lg text-cream/90 mb-8 max-w-lg drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
              >
                {t(`slide_${currentIndex + 1}.subtitle`)}
              </motion.p>

              {/* CTA */}
              <motion.div variants={itemVariants}>
                <Link
                  href={activeSlide.anchor}
                  className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-cream hover:text-olive transition-colors drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]"
                >
                  {t(`slide_${currentIndex + 1}.cta`)}
                  <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          </div>

          {/* ── Arrows — aligned to the CTA baseline ───── */}
          <div className="flex items-center gap-3 pointer-events-auto shrink-0 translate-y-1">
            <button
              onClick={() => goTo(currentIndex - 1, true)}
              className="p-3 rounded-full bg-charcoal/30 backdrop-blur-md text-cream hover:bg-olive border border-cream/20 transition-colors"
              aria-label="Anterior slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => goTo(currentIndex + 1, true)}
              className="p-3 rounded-full bg-charcoal/30 backdrop-blur-md text-cream hover:bg-olive border border-cream/20 transition-colors"
              aria-label="Siguiente slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll Indicator ─────────────────────────── */}
      <div className="absolute left-6 md:left-10 bottom-20 z-30 hidden md:flex flex-col items-center pointer-events-none">
        <div className="w-px h-16 bg-cream/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-cream/65 scroll-line-fill" />
        </div>
      </div>

      {/* ── Dots ─────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx, true)}
            className="relative h-[6px] rounded-full bg-cream/30 transition-all duration-300 overflow-hidden"
            style={{ width: currentIndex === idx ? '28px' : '6px' }}
            aria-label={`Ir al slide ${idx + 1}`}
            aria-current={currentIndex === idx ? 'true' : 'false'}
          >
            {currentIndex === idx && (
              <motion.div
                layoutId="activeCarouselDot"
                className="absolute inset-0 bg-olive rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Progress bar ─────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 z-30">
        {isMounted && (
          <div
            className="h-full bg-olive"
            style={{ width: `${reducedMotion ? 0 : progress}%`, transition: 'width 80ms linear' }}
          />
        )}
      </div>
    </section>
  );
}
