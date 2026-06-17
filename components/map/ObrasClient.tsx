'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { OBRAS } from '@/lib/data/obras';
import { Link } from '@/routing';
import { Search, MapPin, X, ArrowLeft, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

const ObrasMap = dynamic(() => import('./ObrasMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#f3f4f6]">
      <div className="text-gray-400 text-sm font-medium">Cargando mapa...</div>
    </div>
  )
});

export default function ObrasClient() {
  const [activeObraId, setActiveObraId]   = useState<string | null>(null);
  const [hoveredObraId, setHoveredObraId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [listOpen, setListOpen]           = useState(true);
  const lenis = useLenis();
  const mobileScrollerRef  = useRef<HTMLDivElement>(null);
  const desktopScrollerRef = useRef<HTMLDivElement>(null);

  const filteredObras = OBRAS.filter(o =>
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const activeObra = activeObraId ? OBRAS.find(o => o.id === activeObraId) : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    return () => { document.body.style.overflow = ''; if (lenis) lenis.start(); };
  }, [lenis]);

  // Auto-scroll selected card into view
  useEffect(() => {
    if (!activeObraId) return;
    for (const ref of [mobileScrollerRef, desktopScrollerRef]) {
      const el = ref.current?.querySelector<HTMLElement>(`[data-obra-id="${activeObraId}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeObraId]);

  const openObra = (id: string) => { setActiveObraId(id); setListOpen(false); };

  return (
    <div data-lenis-prevent="true" className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-charcoal">

      {/* ── MAP ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <ObrasMap obras={OBRAS} activeObraId={activeObraId} hoveredObraId={hoveredObraId}
          onObraClick={setActiveObraId} onObraHover={setHoveredObraId} />
      </motion.div>

      {/* ── MOBILE: top header ───────────────────────── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-3 pointer-events-none"
      >
        <Link href="/" aria-label="Volver"
          className="pointer-events-auto w-11 h-11 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.18)] text-charcoal hover:bg-white active:scale-95 transition">
          <X size={18} strokeWidth={2.5} />
        </Link>
        <div className="pointer-events-auto px-5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.18)] flex flex-col items-center">
          <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }} className="text-sm text-charcoal leading-none">Obras</span>
          <span className="text-[10px] text-gray-500 tracking-wide mt-0.5">+{OBRAS.length} lugares</span>
        </div>
        <div className="w-11 h-11" aria-hidden />
      </motion.div>

      {/* ── DESKTOP: volver al inicio ─────────────────── */}
      <motion.div
        initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:block absolute top-6 left-6 z-30"
      >
        <Link href="/"
          className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cream/95 backdrop-blur-md text-charcoal hover:bg-cream font-semibold text-sm shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-colors">
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
          <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}>Volver al inicio</span>
        </Link>
      </motion.div>

      {/* ── DESKTOP: botón reabrir ────────────────────── */}
      <AnimatePresence>
        {!listOpen && (
          <motion.button
            key="reopen-btn"
            initial={{ y: 14, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 14, opacity: 0, x: '-50%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={() => setListOpen(true)}
            className="hidden md:inline-flex absolute bottom-6 left-1/2 z-30 items-center gap-2.5 px-6 py-3 rounded-full bg-cream/90 backdrop-blur-xl border border-[rgba(58,74,42,0.18)] text-charcoal hover:bg-cream font-semibold text-sm shadow-[0_8px_32px_rgba(0,0,0,0.18)] transition-colors"
          >
            <List size={15} className="text-olive-deep" />
            <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}>
              Ver plano de obras construidas
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── MOBILE: "Ver lista" pill ──────────────────── */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        onClick={() => setListOpen(true)}
        className="md:hidden absolute z-30 left-1/2 -translate-x-1/2 bottom-[148px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-charcoal font-semibold text-sm shadow-[0_4px_16px_rgba(0,0,0,0.18)] active:scale-95 transition"
      >
        <List size={16} className="text-olive-deep" />
        <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}>Ver lista</span>
      </motion.button>

      {/* ── MOBILE: cards horizontales ────────────────── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="md:hidden absolute z-20 bottom-3 left-0 right-0 pointer-events-none"
      >
        <div ref={mobileScrollerRef}
          className="pointer-events-auto flex gap-3 overflow-x-auto px-3 pb-2 snap-x snap-mandatory hide-scrollbar">
          {OBRAS.map(obra => {
            const isActive = activeObraId === obra.id;
            return (
              <button key={obra.id} data-obra-id={obra.id} onClick={() => setActiveObraId(obra.id)}
                className={`shrink-0 snap-center w-[260px] flex gap-3 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-left transition-all duration-200 ${
                  isActive ? 'shadow-[0_8px_24px_rgba(0,0,0,0.22)] ring-2 ring-olive-deep scale-[1.02]' : 'shadow-[0_4px_16px_rgba(0,0,0,0.15)]'}`}>
                {obra.images?.[0]
                  ? <img src={obra.images[0].src} alt={obra.images[0].alt} className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" /> // eslint-disable-line @next/next/no-img-element
                  : <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><MapPin className="text-gray-300" size={22} /></div>}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h3 style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }} className="text-sm text-charcoal truncate">{obra.name}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{obra.location}</p>
                  <span className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-wider text-olive-deep bg-olive-deep/10 px-1.5 py-0.5 rounded-sm w-fit">{obra.category || 'Obra'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── LIST: mobile sheet + desktop carousel ─────── */}
      <AnimatePresence>
        {listOpen && (
          <>
            <motion.div key="list-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }} onClick={() => setListOpen(false)}
              className="md:hidden absolute inset-0 z-40 bg-black/35 backdrop-blur-[2px]" />

            <motion.div key="list-sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="md:hidden absolute z-50 left-0 right-0 bottom-0 h-[85dvh] bg-white rounded-t-3xl shadow-[0_-12px_32px_rgba(0,0,0,0.25)] flex flex-col">
              <div className="flex flex-col items-center pt-3 pb-1 shrink-0">
                <div className="w-12 h-1 rounded-full bg-gray-300" />
              </div>
              <ListPanel filteredObras={filteredObras} searchQuery={searchQuery}
                setSearchQuery={setSearchQuery} activeObraId={activeObraId}
                onObraClick={openObra} onObraHover={setHoveredObraId}
                onClose={() => setListOpen(false)} />
            </motion.div>

            {/* Desktop — carrusel flotante, paleta del arquitecto */}
            <motion.div
              key="desktop-carousel"
              initial={{ y: 28, opacity: 0, x: '-50%' }}
              animate={{ y: 0, opacity: 1, x: '-50%' }}
              exit={{ y: 28, opacity: 0, x: '-50%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="hidden md:block absolute z-30 bottom-6 left-1/2 w-[min(940px,calc(100vw-3rem))] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.22),0_4px_16px_rgba(0,0,0,0.12)]"
              style={{ willChange: 'transform' }}
            >
              {/* Inner wrapper handles visual clipping independently */}
              <div className="rounded-2xl overflow-hidden bg-[rgba(245,240,232,0.82)] backdrop-blur-2xl border border-[rgba(245,240,232,0.55)]"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(58,74,42,0.06)' }}>
                <DesktopCarousel
                  filteredObras={filteredObras}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeObraId={activeObraId}
                  hoveredObraId={hoveredObraId}
                  onObraClick={setActiveObraId}
                  onObraHover={setHoveredObraId}
                  onClose={() => setListOpen(false)}
                  scrollerRef={desktopScrollerRef}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── OBRA DETAIL ───────────────────────────────── */}
      <AnimatePresence>
        {activeObra && (
          <motion.div key="detail"
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="absolute z-[60] top-0 bottom-0 left-0 w-full md:w-[440px] bg-white flex flex-col overflow-hidden shadow-[12px_0_32px_rgba(0,0,0,0.2)]">
            <div className="h-14 flex items-center px-4 border-b border-gray-100 shrink-0 bg-white">
              <button onClick={() => setActiveObraId(null)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-charcoal transition-colors">
                <ArrowLeft size={18} className="mr-2" />Volver al mapa
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="w-full aspect-video bg-gray-100">
                {activeObra.images?.[0]
                  ? <img src={activeObra.images[0].src} alt={activeObra.images[0].alt} className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                  : <div className="w-full h-full flex items-center justify-center"><MapPin className="text-gray-300" size={48} /></div>}
              </div>
              <div className="p-6">
                <h2 style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }} className="text-3xl text-charcoal mb-2">{activeObra.name}</h2>
                <p className="text-gray-500 mb-6 flex items-center"><MapPin size={16} className="mr-1.5" />{activeObra.location}</p>
                <button className="w-full py-3 bg-olive-deep text-cream font-semibold rounded-lg hover:bg-olive transition-colors">Ver Galería Completa</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 6px; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

/* ── Desktop Carousel ─────────────────────────────────────────── */

// Subtle card tints cycling through the architect's palette
const CARD_TINTS = [
  'bg-[rgba(245,240,232,0.55)]',   // cream
  'bg-[rgba(237,243,233,0.50)]',   // olive tint
  'bg-[rgba(250,247,241,0.55)]',   // warm white
];

function DesktopCarousel({
  filteredObras, searchQuery, setSearchQuery,
  activeObraId, hoveredObraId,
  onObraClick, onObraHover, onClose, scrollerRef,
}: {
  filteredObras: typeof OBRAS;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeObraId: string | null;
  hoveredObraId: string | null;
  onObraClick: (id: string) => void;
  onObraHover: (id: string | null) => void;
  onClose: () => void;
  scrollerRef: React.RefObject<HTMLDivElement>;
}) {
  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const velocityRef = useRef(0);
  const rafRef      = useRef<number>(0);

  const checkScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 12);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 12);
  }, [scrollerRef]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Momentum-based wheel scroll
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      velocityRef.current += delta * 0.9;
      cancelAnimationFrame(rafRef.current);
      const tick = () => {
        if (Math.abs(velocityRef.current) < 0.5) { velocityRef.current = 0; return; }
        el.scrollLeft += velocityRef.current;
        velocityRef.current *= 0.88;
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', checkScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollerRef, checkScroll]);

  const scrollBy = (dir: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll by ~3 cards width
    el.scrollBy({ left: dir === 'left' ? -660 : 660, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-3.5 pb-3 border-b border-[rgba(58,74,42,0.08)]">
        <div className="flex items-center gap-1.5 shrink-0">
          <MapPin size={13} className="text-olive-soft" />
          <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
            className="text-[13px] text-charcoal tracking-wide">
            Obras construidas
          </span>
        </div>

        <div className="relative flex-1 max-w-[240px]">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-soft/60 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/55 border border-[rgba(58,74,42,0.12)] rounded-full py-1.5 pl-8 pr-3 text-[12px] text-charcoal placeholder-[#6B7A5A]/50 focus:outline-none focus:bg-white/80 focus:border-olive/30 transition-all duration-200"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-olive-soft/50 hover:text-olive-deep transition-colors">
              <X size={11} />
            </button>
          )}
        </div>

        <button onClick={onClose} aria-label="Cerrar"
          className="ml-auto w-7 h-7 flex items-center justify-center rounded-full bg-[rgba(58,74,42,0.07)] hover:bg-[rgba(58,74,42,0.14)] text-olive-soft hover:text-olive-deep transition-all shrink-0">
          <X size={13} />
        </button>
      </div>

      {/* Carousel + flechas */}
      <div className="relative">

        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              onClick={() => scrollBy('left')}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-cream/95 hover:bg-cream border border-[rgba(58,74,42,0.14)] text-olive-deep shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-all backdrop-blur-sm"
            >
              <ChevronLeft size={17} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
              onClick={() => scrollBy('right')}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-cream/95 hover:bg-cream border border-[rgba(58,74,42,0.14)] text-olive-deep shadow-[0_4px_16px_rgba(0,0,0,0.16)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-all backdrop-blur-sm"
            >
              <ChevronRight size={17} />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollerRef}
          data-lenis-prevent="true"
          className="flex gap-4 overflow-x-auto px-6 py-4 hide-scrollbar"
        >
          {filteredObras.length === 0 ? (
            <p className="text-olive-soft/60 text-sm py-3 px-2">Sin resultados para &ldquo;{searchQuery}&rdquo;</p>
          ) : (
            filteredObras.map((obra, i) => {
              const isActive  = activeObraId  === obra.id;
              const isHovered = hoveredObraId === obra.id;
              const tint = CARD_TINTS[i % CARD_TINTS.length];
              return (
                <button
                  key={obra.id}
                  data-obra-id={obra.id}
                  onClick={() => onObraClick(obra.id)}
                  onMouseEnter={() => onObraHover(obra.id)}
                  onMouseLeave={() => onObraHover(null)}
                  className={`shrink-0 w-[196px] rounded-2xl overflow-hidden border text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-olive-deep/[0.10] border-olive-deep/35 shadow-[0_6px_24px_rgba(58,74,42,0.22)] scale-[1.05] -translate-y-0.5'
                      : isHovered
                      ? `${tint} border-[rgba(58,74,42,0.18)] scale-[1.025] shadow-[0_4px_16px_rgba(0,0,0,0.10)] -translate-y-px`
                      : `${tint} border-[rgba(245,240,232,0.8)] shadow-[0_1px_4px_rgba(0,0,0,0.05)]`
                  }`}
                >
                  {obra.images?.[0]
                    ? <img src={obra.images[0].src} alt={obra.images[0].alt} className="w-full h-[112px] object-cover" /> // eslint-disable-line @next/next/no-img-element
                    : (
                      <div className={`w-full h-[112px] flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-br from-olive/22 to-olive-deep/14'
                          : i % 3 === 1
                          ? 'bg-gradient-to-br from-[#E8EEE2] to-[#DDE6D5]'
                          : i % 3 === 2
                          ? 'bg-gradient-to-br from-[#F0EBE0] to-[#E8E0D0]'
                          : 'bg-gradient-to-br from-[#F5F0E8] to-[#EDE8DE]'
                      }`}>
                        <MapPin size={26} className={`transition-all duration-300 ${
                          isActive ? 'text-olive-deep/55 scale-110' : 'text-olive-soft/30'
                        }`} />
                      </div>
                    )
                  }
                  <div className="px-3 pt-2.5 pb-3">
                    <p style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
                      className={`text-[12.5px] leading-snug truncate transition-colors duration-200 ${isActive ? 'text-olive-deep' : 'text-charcoal'}`}>
                      {obra.name}
                    </p>
                    <p className="text-[10.5px] text-olive-soft/55 mt-0.5 truncate">{obra.location}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Fade edges */}
        {canScrollLeft  && <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[rgba(245,240,232,0.85)] to-transparent" />}
        {canScrollRight && <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[rgba(245,240,232,0.85)] to-transparent" />}
      </div>
    </div>
  );
}

/* ── Mobile list panel ────────────────────────────────────────── */
function ListPanel({
  filteredObras, searchQuery, setSearchQuery,
  activeObraId, onObraClick, onObraHover, onClose,
}: {
  filteredObras: typeof OBRAS;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeObraId: string | null;
  onObraClick: (id: string) => void;
  onObraHover: (id: string | null) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="px-5 pt-2 pb-4 border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }} className="text-xl text-charcoal leading-none">Obras</h2>
            <p className="text-xs text-gray-500 mt-1">{filteredObras.length} resultados</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar lista"
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input type="text" placeholder="Buscar por nombre o zona..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive transition" />
        </div>
      </div>
      <div data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredObras.length === 0
          ? <div className="p-6 text-center text-gray-400 text-sm">No se encontraron resultados para &quot;{searchQuery}&quot;</div>
          : (
            <div className="divide-y divide-gray-50">
              {filteredObras.map(obra => {
                const isActive = activeObraId === obra.id;
                return (
                  <div key={obra.id} onClick={() => onObraClick(obra.id)}
                    onMouseEnter={() => onObraHover(obra.id)} onMouseLeave={() => onObraHover(null)}
                    className={`p-4 cursor-pointer transition-colors duration-150 flex gap-4 ${
                      isActive ? 'bg-olive-deep/5 border-l-4 border-l-olive-deep' : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'}`}>
                    {obra.images?.[0]
                      ? <img src={obra.images[0].src} alt={obra.images[0].alt} className="w-[72px] h-[72px] object-cover rounded-md bg-gray-100 shrink-0" /> // eslint-disable-line @next/next/no-img-element
                      : <div className="w-[72px] h-[72px] rounded-md bg-gray-100 flex items-center justify-center shrink-0"><MapPin className="text-gray-300" size={24} /></div>}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }} className="text-base text-charcoal truncate">{obra.name}</h3>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{obra.location}</p>
                      <span className="inline-block mt-1.5 text-[10px] font-medium uppercase tracking-wider text-olive-deep bg-olive-deep/10 px-2 py-0.5 rounded-sm w-fit">{obra.category || 'Obra Realizada'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </>
  );
}
