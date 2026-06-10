'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { OBRAS } from '@/lib/data/obras';
import { Link } from '@/routing';
import { Search, MapPin, X, ArrowLeft, List } from 'lucide-react';
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
  const [activeObraId, setActiveObraId] = useState<string | null>(null);
  const [hoveredObraId, setHoveredObraId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const lenis = useLenis();
  const cardsScrollerRef = useRef<HTMLDivElement>(null);

  const filteredObras = OBRAS.filter(obra =>
    obra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obra.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeObra = activeObraId ? OBRAS.find(o => o.id === activeObraId) : null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [lenis]);

  // Scroll the active card into view on the horizontal scroller
  useEffect(() => {
    if (!activeObraId || !cardsScrollerRef.current) return;
    const el = cardsScrollerRef.current.querySelector<HTMLElement>(`[data-obra-id="${activeObraId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeObraId]);

  const openObra = (id: string) => {
    setActiveObraId(id);
    setListOpen(false);
  };

  return (
    <div data-lenis-prevent="true" className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-charcoal">

      {/* ── MAP (edge-to-edge background) ─────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <ObrasMap
          obras={OBRAS}
          activeObraId={activeObraId}
          hoveredObraId={hoveredObraId}
          onObraClick={setActiveObraId}
          onObraHover={setHoveredObraId}
        />
      </motion.div>

      {/* ── MOBILE TOP HEADER ─────────────────────── */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="md:hidden absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-3 pointer-events-none"
      >
        <Link
          href="/"
          aria-label="Volver al inicio"
          className="pointer-events-auto w-11 h-11 flex items-center justify-center rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.18)] text-charcoal hover:bg-white active:scale-95 transition"
        >
          <X size={18} strokeWidth={2.5} />
        </Link>

        <div className="pointer-events-auto px-5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.18)] flex flex-col items-center">
          <span
            style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
            className="text-sm text-charcoal leading-none"
          >
            Obras
          </span>
          <span className="text-[10px] text-gray-500 tracking-wide mt-0.5">
            +{OBRAS.length} lugares
          </span>
        </div>

        <div className="w-11 h-11" aria-hidden />
      </motion.div>

      {/* ── DESKTOP CONTROLS ──────────────────────── */}
      <div className="hidden md:block">
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-6 left-6 z-30"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cream/95 backdrop-blur-md text-charcoal hover:bg-cream font-semibold text-sm shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}>
              Volver al inicio
            </span>
          </Link>
        </motion.div>

        <motion.button
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setListOpen(true)}
          className="absolute top-6 right-6 z-30 inline-flex items-center gap-3 px-5 py-3 rounded-full bg-cream/95 backdrop-blur-md text-charcoal hover:bg-cream font-semibold text-sm shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-colors"
        >
          <List size={18} />
          <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}>
            Ver obras
          </span>
        </motion.button>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="absolute bottom-6 left-6 z-30 w-[360px]"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar una obra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-cream/95 backdrop-blur-md border border-cream/40 rounded-full py-3 pl-11 pr-10 text-sm text-charcoal placeholder-gray-400 shadow-[0_8px_24px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-olive/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── MOBILE: "Ver lista" pill above the cards ── */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45 }}
        onClick={() => setListOpen(true)}
        className="md:hidden absolute z-30 left-1/2 -translate-x-1/2 bottom-[148px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md text-charcoal font-semibold text-sm shadow-[0_4px_16px_rgba(0,0,0,0.18)] active:scale-95 transition"
      >
        <List size={16} className="text-olive-deep" />
        <span style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}>
          Ver lista
        </span>
      </motion.button>

      {/* ── MOBILE: Horizontal scrolling cards ────── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="md:hidden absolute z-20 bottom-3 left-0 right-0 pointer-events-none"
      >
        <div
          ref={cardsScrollerRef}
          className="pointer-events-auto flex gap-3 overflow-x-auto px-3 pb-2 snap-x snap-mandatory hide-scrollbar"
        >
          {OBRAS.map(obra => {
            const isActive = activeObraId === obra.id;
            return (
              <button
                key={obra.id}
                data-obra-id={obra.id}
                onClick={() => setActiveObraId(obra.id)}
                className={`shrink-0 snap-center w-[260px] flex gap-3 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md text-left transition-all duration-200 ${
                  isActive
                    ? 'shadow-[0_8px_24px_rgba(0,0,0,0.22)] ring-2 ring-olive-deep scale-[1.02]'
                    : 'shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
                }`}
              >
                {obra.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={obra.images[0].src}
                    alt={obra.images[0].alt}
                    className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <MapPin className="text-gray-300" size={22} />
                  </div>
                )}
                <div className="min-w-0 flex-1 flex flex-col justify-center">
                  <h3
                    style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
                    className="text-sm text-charcoal truncate"
                  >
                    {obra.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{obra.location}</p>
                  <span className="inline-block mt-1 text-[9px] font-semibold uppercase tracking-wider text-olive-deep bg-olive-deep/10 px-1.5 py-0.5 rounded-sm w-fit">
                    {obra.category || 'Obra'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* ── LIST: bottom-sheet (mobile) / right-drawer (desktop) ── */}
      <AnimatePresence>
        {listOpen && (
          <>
            <motion.div
              key="list-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setListOpen(false)}
              className="absolute inset-0 z-40 bg-black/35 backdrop-blur-[2px]"
            />

            {/* Mobile sheet */}
            <motion.div
              key="list-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="md:hidden absolute z-50 left-0 right-0 bottom-0 h-[85dvh] bg-white rounded-t-3xl shadow-[0_-12px_32px_rgba(0,0,0,0.25)] flex flex-col"
            >
              <div className="flex flex-col items-center pt-3 pb-1 shrink-0">
                <div className="w-12 h-1 rounded-full bg-gray-300" />
              </div>
              <ListPanel
                filteredObras={filteredObras}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeObraId={activeObraId}
                onObraClick={openObra}
                onObraHover={setHoveredObraId}
                onClose={() => setListOpen(false)}
              />
            </motion.div>

            {/* Desktop right drawer */}
            <motion.div
              key="list-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 280 }}
              className="hidden md:flex absolute z-50 top-0 right-0 bottom-0 w-[440px] bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.2)] flex-col"
            >
              <ListPanel
                filteredObras={filteredObras}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeObraId={activeObraId}
                onObraClick={openObra}
                onObraHover={setHoveredObraId}
                onClose={() => setListOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── OBRA DETAIL (slides from left) ────────── */}
      <AnimatePresence>
        {activeObra && (
          <motion.div
            key="detail"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 280 }}
            className="absolute z-[60] top-0 bottom-0 left-0 w-full md:w-[440px] bg-white flex flex-col overflow-hidden shadow-[12px_0_32px_rgba(0,0,0,0.2)]"
          >
            <div className="h-14 flex items-center px-4 border-b border-gray-100 shrink-0 bg-white">
              <button
                onClick={() => setActiveObraId(null)}
                className="flex items-center text-sm font-medium text-gray-600 hover:text-charcoal transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                Volver al mapa
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="w-full aspect-video bg-gray-100">
                {activeObra.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeObra.images[0].src}
                    alt={activeObra.images[0].alt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="text-gray-300" size={48} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h2
                  style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
                  className="text-3xl text-charcoal mb-2"
                >
                  {activeObra.name}
                </h2>
                <p className="text-gray-500 mb-6 flex items-center">
                  <MapPin size={16} className="mr-1.5" />
                  {activeObra.location}
                </p>

                <button className="w-full py-3 bg-olive-deep text-cream font-semibold rounded-lg hover:bg-olive transition-colors">
                  Ver Galería Completa
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9fafb; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
}

/* ── List panel (shared between mobile sheet & desktop drawer) ── */
function ListPanel({
  filteredObras,
  searchQuery,
  setSearchQuery,
  activeObraId,
  onObraClick,
  onObraHover,
  onClose,
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
            <h2
              style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
              className="text-xl text-charcoal leading-none"
            >
              Obras
            </h2>
            <p className="text-xs text-gray-500 mt-1">+{filteredObras.length} resultados</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar lista"
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre o zona..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive transition"
          />
        </div>
      </div>

      <div data-lenis-prevent="true" className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredObras.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No se encontraron resultados para &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredObras.map(obra => {
              const isActive = activeObraId === obra.id;
              return (
                <div
                  key={obra.id}
                  onClick={() => onObraClick(obra.id)}
                  onMouseEnter={() => onObraHover(obra.id)}
                  onMouseLeave={() => onObraHover(null)}
                  className={`p-4 cursor-pointer transition-colors duration-150 flex gap-4 ${
                    isActive
                      ? 'bg-olive-deep/5 border-l-4 border-l-olive-deep'
                      : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'
                  }`}
                >
                  {obra.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={obra.images[0].src}
                      alt={obra.images[0].alt}
                      className="w-[72px] h-[72px] object-cover rounded-md bg-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-[72px] h-[72px] rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="text-gray-300" size={24} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3
                      style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
                      className="text-base text-charcoal truncate"
                    >
                      {obra.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate mt-0.5">{obra.location}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-medium uppercase tracking-wider text-olive-deep bg-olive-deep/10 px-2 py-0.5 rounded-sm w-fit">
                      {obra.category || 'Obra Realizada'}
                    </span>
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
