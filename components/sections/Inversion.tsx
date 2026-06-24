'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Download, MapPin } from 'lucide-react';

const PROYECTOS = [
  {
    id: 'los-aromos',
    nombre: 'Los Aromos',
    tipo: 'Fideicomiso',
    ubicacion: 'Monte Hermoso',
    detalle: '6 duplex · 70 m² c/u · a 150 m de la playa',
    estado: 'En desarrollo',
    entrega: 'Dic. 2026',
    pdf: '/inversiones/fideicomiso-los-aromos-2026.pdf',
  },
];

export default function Inversion() {
  const t = useTranslations('inversion');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="inversion" ref={ref} className="bg-olive-soft py-14 md:py-20">
      <div className="container-layout">

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-14 items-end mb-8 md:mb-10"
        >
          <h2 className="text-h1 font-bold text-cream leading-tight">
            {t('title')}
          </h2>
          <p className="text-body-l text-cream/80 leading-relaxed">
            {t('desc')}
          </p>
        </motion.div>

        {/* Cards de proyectos */}
        <div className="flex flex-col gap-2">
          {PROYECTOS.map((proyecto, i) => (
            <motion.div
              key={proyecto.id}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.18 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 px-6 md:px-8 py-5 md:py-6"
            >
              {/* Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold tracking-widest text-olive uppercase">
                    {proyecto.tipo}
                  </span>
                  <span className="w-px h-3 bg-charcoal/20" />
                  <span className="text-[10px] font-semibold tracking-wider text-charcoal/60 uppercase">
                    {proyecto.estado} · {proyecto.entrega}
                  </span>
                </div>

                <h3
                  className="text-xl md:text-2xl text-charcoal font-bold leading-tight"
                  style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
                >
                  {proyecto.nombre}
                </h3>

                <p className="flex items-center gap-1.5 text-sm text-charcoal/70 mt-1">
                  <MapPin size={11} className="text-charcoal/70 shrink-0" />
                  {proyecto.ubicacion} · {proyecto.detalle}
                </p>
              </div>

              {/* CTA */}
              <a
                href={proyecto.pdf}
                download
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal text-cream text-[10px] font-bold tracking-widest hover:bg-charcoal-soft transition-colors whitespace-nowrap"
              >
                <Download size={12} strokeWidth={2.5} />
                {t('descargar')}
              </a>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
