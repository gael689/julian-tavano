'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLenis } from 'lenis/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type LightboxImage = { src: string; alt: string; caption?: string };

type LightboxContextValue = {
  open: (index: number) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within LightboxProvider');
  return ctx;
}

export default function LightboxProvider({
  images,
  children,
}: {
  images: LightboxImage[];
  children: React.ReactNode;
}) {
  const t = useTranslations('protoPage');
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const lenis = useLenis();
  const touchStartX = useRef<number | null>(null);
  const prevOverflow = useRef<string>('');

  useEffect(() => setMounted(true), []);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex(i => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex(i => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  // Scroll lock + Lenis stop while open
  useEffect(() => {
    if (index === null) return;
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    return () => {
      document.body.style.overflow = prevOverflow.current;
      if (lenis) lenis.start();
    };
  }, [index, lenis]);

  // Keyboard nav
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  };

  const current = index !== null ? images[index] : null;
  const total = images.length;

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {current && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center select-none"
                onClick={close}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                aria-modal="true"
                role="dialog"
              >
                {/* Image */}
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-[92vw] h-[80vh] md:w-[88vw] md:h-[86vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    quality={95}
                    sizes="92vw"
                    className="object-contain"
                    priority
                  />
                  {current.caption && (
                    <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-[0.2em] uppercase whitespace-nowrap">
                      {current.caption}
                    </p>
                  )}
                </motion.div>

                {/* Close */}
                <button
                  onClick={(e) => { e.stopPropagation(); close(); }}
                  aria-label={t('lightbox_close')}
                  className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>

                {/* Prev / Next — hidden when only 1 image */}
                {total > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      aria-label={t('lightbox_prev')}
                      className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      aria-label={t('lightbox_next')}
                      className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={22} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/85 text-xs font-semibold tabular-nums">
                      {(index ?? 0) + 1} / {total}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </LightboxContext.Provider>
  );
}
