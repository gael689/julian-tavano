'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef, useState, useEffect } from 'react';

import Image from 'next/image';

const STATS = [
  { countTo: 50,  prefix: '+', suffix: '',  labelKey: 'obras_label'       },
  { countTo: 10,  prefix: '+', suffix: '',  labelKey: 'trayectoria_label' },
  { countTo: 100, prefix: '',  suffix: '%', labelKey: 'entregas_label'    },
] as const;

function useCountUp(target: number, isActive: boolean, duration = 1600) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let startTime: number | null = null;
    let rafId: number;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [isActive, target, duration]);

  return count;
}

function StatItem({
  countTo, prefix, suffix, label, isActive, index,
}: {
  countTo: number; prefix: string; suffix: string;
  label: string; isActive: boolean; index: number;
}) {
  const count = useCountUp(countTo, isActive, 1600 + index * 80);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.3 + index * 0.14, ease: [0.16, 1, 0.3, 1] }}
      className="border-l-2 border-olive pl-6 flex-1"
    >
      <div
        className="font-bold text-charcoal leading-none mb-2 tabular-nums"
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 6vw, 4.5rem)' }}
      >
        {prefix}{count}{suffix}
      </div>
      <p className="text-sm text-charcoal/50 tracking-[0.15em] uppercase font-bold">{label}</p>
    </motion.div>
  );
}

export default function About() {
  const t = useTranslations('about');
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section id="sobre" className="bg-cream section-padding" ref={sectionRef}>

      {/* ── Content ─── */}
      <div className="container-layout relative z-10">
        
        {/* Top Row: Bio & Image */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          
          {/* Left: bio */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-eyebrow text-olive mb-5"
            >
              SOBRE EL ESTUDIO
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-h1 text-charcoal mb-8 leading-tight"
            >
              {t('title')}
            </motion.h2>

            <div className="space-y-4">
              {(['bio1', 'bio2', 'bio3'] as const).map((key, i) => (
                <motion.p
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                  className="text-body-l text-charcoal/70"
                >
                  {t(key)}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] w-full overflow-hidden shadow-lg"
          >
            <Image 
              src="/about-image.png" 
              alt="Julián Tavano" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* Bottom Row: Full-width animated stats */}
        <div className="mt-10 md:mt-16 pt-8 border-t border-charcoal/10">
          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8">
            {STATS.map(({ countTo, prefix, suffix, labelKey }, i) => (
              <StatItem
                key={labelKey}
                countTo={countTo}
                prefix={prefix}
                suffix={suffix}
                label={t(`stats.${labelKey}`)}
                isActive={inView}
                index={i}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
