'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { OBRAS } from '@/lib/data/obras';
import { Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

// Dynamically import the map to avoid SSR issues with Leaflet
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
  const lenis = useLenis();

  const filteredObras = OBRAS.filter(obra =>
    obra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obra.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeObra = activeObraId ? OBRAS.find(o => o.id === activeObraId) : null;

  // Lock body scroll and stop Lenis so only the sidebar and map can be scrolled/zoomed
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    
    return () => {
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };
  }, [lenis]);

  return (
    <div data-lenis-prevent="true" className="flex flex-col mt-[92px] w-full" style={{ height: 'calc(100dvh - 92px)' }}>

      {/* ── MAP + SIDEBAR ── */}
      <div className="flex flex-col-reverse lg:flex-row flex-1 min-h-0 overflow-hidden bg-white border-4 border-black">

      {/* ── SIDEBAR (Google Maps Style) ── */}
      <div className="w-full lg:w-[400px] h-[42vh] lg:h-full flex flex-col bg-white shadow-[2px_0_12px_rgba(0,0,0,0.08)] z-10 shrink-0 relative">
        
        {/* Header / Buscador */}
        <div className="p-4 border-b border-gray-100 shrink-0">
          <h1 
            style={{ fontFamily: "'Century Gothic', sans-serif", fontWeight: 700 }}
            className="text-2xl text-[#2c2c2c] mb-1"
          >
            Monte Hermoso
          </h1>
          <p className="text-sm text-gray-500 mb-4">Nuestras obras y proyectos en la zona</p>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar una obra..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3A4A2A]/20 focus:border-[#3A4A2A] transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Lista de Resultados */}
        <div data-lenis-prevent="true" className="flex-1 overflow-y-auto bg-white custom-scrollbar">
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
                    onClick={() => setActiveObraId(obra.id)}
                    onMouseEnter={() => setHoveredObraId(obra.id)}
                    onMouseLeave={() => setHoveredObraId(null)}
                    className={`
                      p-4 cursor-pointer transition-colors duration-150 flex gap-4
                      ${isActive ? 'bg-[#3A4A2A]/5 border-l-4 border-l-[#3A4A2A]' : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'}
                    `}
                  >
                    {/* Imagen cuadrada chica a la izquierda, estilo Google Maps thumbnails */}
                    {obra.images && obra.images.length > 0 ? (
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
                        className="text-base text-gray-900 truncate"
                      >{obra.name}</h3>
                      <p className="text-sm text-gray-500 truncate mt-0.5">{obra.location}</p>
                      
                      {/* Badge / Category */}
                      <span className="inline-block mt-1.5 text-[10px] font-medium uppercase tracking-wider text-[#3A4A2A] bg-[#3A4A2A]/10 px-2 py-0.5 rounded-sm w-fit">
                        {obra.category || 'Obra Realizada'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Info panel that slides over the list when an item is active (Mobile only logic or detail view) */}
        <AnimatePresence>
          {activeObra && (
            <motion.div 
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-0 bg-white z-20 flex flex-col overflow-hidden"
            >
              <div className="h-14 flex items-center px-4 border-b border-gray-100 shrink-0 bg-white">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveObraId(null);
                  }}
                  className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  <X size={18} className="mr-2" />
                  Volver a resultados
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="w-full aspect-video bg-gray-100">
                  {activeObra.images && activeObra.images.length > 0 ? (
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
                    className="text-3xl text-gray-900 mb-2"
                  >{activeObra.name}</h2>
                  <p className="text-gray-500 mb-6 flex items-center">
                    <MapPin size={16} className="mr-1.5" />
                    {activeObra.location}
                  </p>

                  <button className="w-full py-3 bg-[#3A4A2A] text-white font-medium rounded-lg hover:bg-[#2c3820] transition-colors">
                    Ver Galería Completa
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MAPA (Derecha) ── */}
      <div className="flex-1 relative z-0 h-[42vh] lg:h-full">
        <ObrasMap
          obras={OBRAS}
          activeObraId={activeObraId}
          hoveredObraId={hoveredObraId}
          onObraClick={setActiveObraId}
          onObraHover={setHoveredObraId}
        />
      </div>

      </div>{/* end map+sidebar */}

      {/* ── FOOTER STRIP ── */}
      <div className="shrink-0 h-[48px] bg-[#1e1e1e] flex items-center justify-between px-5 md:px-8">
        <span className="text-white/40 text-[11px] tracking-wide">
          © Julián Tavano · Todos los derechos reservados
        </span>
        <a
          href="https://gaelgonzalez.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/30 text-[11px] tracking-wide hover:text-white/60 transition-colors"
        >
          Desarrollado por Gael González →
        </a>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}
