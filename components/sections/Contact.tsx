'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

const INTERESTS = ['interest_proto', 'interest_custom', 'interest_general'] as const;

const BUDGETS = [
  'Hasta USD 30.000',
  'USD 30.000 – 60.000',
  'USD 60.000 – 100.000',
  'Más de USD 100.000',
] as const;

const SURFACES = [
  'Hasta 50 m²',
  '50 – 80 m²',
  '80 – 120 m²',
  'Más de 120 m²',
] as const;

function CharReveal({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <span className="inline-flex flex-wrap leading-none">
      {text.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ lineHeight: 0.95 }}>
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={isActive ? { y: '0%' } : {}}
            transition={{ duration: 0.65, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

const inputClass =
  'w-full bg-charcoal-soft border border-cream/10 text-cream placeholder-cream/30 px-4 py-3 text-sm focus:outline-none focus:border-olive transition-colors';

export default function Contact() {
  const t = useTranslations('contact');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contacto" className="bg-charcoal section-padding" ref={ref}>
      <div className="container-layout">

        {/* ── Editorial title ── */}
        <div className="mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="text-eyebrow text-olive mb-6"
          >
            CONTACTO
          </motion.p>
          <h2
            className="font-bold text-cream overflow-hidden"
            style={{
              fontFamily: "'Century Gothic', Futura, sans-serif",
              fontSize: 'clamp(2.2rem, 13vw, 11rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            <CharReveal text={t('title')} isActive={inView} />
          </h2>
        </div>

        {/* ── Centered form ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          {submitted ? (
            <div className="py-20 text-center">
              <p className="text-olive text-5xl mb-4">✓</p>
              <p className="text-cream text-lg">{t('form.success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Nombre + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required type="text"   placeholder={t('form.name')}  className={inputClass} />
                <input required type="email"  placeholder={t('form.email')} className={inputClass} />
              </div>

              {/* Teléfono */}
              <input type="tel" placeholder={t('form.phone')} className={inputClass} />

              {/* Tipo de proyecto */}
              <select className={`${inputClass} appearance-none`}>
                <option value="">{t('form.interest')}</option>
                {INTERESTS.map((key) => (
                  <option key={key} value={key}>{t(`form.${key}`)}</option>
                ))}
              </select>

              {/* Zona */}
              <input type="text" placeholder={t('form.zone')} className={inputClass} />

              {/* Superficie + Presupuesto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select className={`${inputClass} appearance-none`}>
                  <option value="">Superficie aproximada</option>
                  {SURFACES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className={`${inputClass} appearance-none`}>
                  <option value="">Presupuesto estimado</option>
                  {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Terreno */}
              <div className="flex flex-wrap gap-6 items-center py-1">
                <span className="text-cream/50 text-sm">{t('form.land')}</span>
                {(['land_yes', 'land_no', 'land_process'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 text-cream/70 text-sm cursor-pointer">
                    <input type="radio" name="land" value={opt} className="accent-olive" />
                    {t(`form.${opt}`)}
                  </label>
                ))}
              </div>

              {/* Mensaje */}
              <textarea
                rows={4}
                placeholder={t('form.message')}
                className={`${inputClass} resize-none`}
              />

              {/* Submit + WhatsApp */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-olive text-cream text-sm font-bold tracking-widest hover:bg-olive-deep transition-colors"
                >
                  {t('form.submit')}
                </button>
                <a
                  href="https://wa.me/5492494246878"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 border border-cream/15 text-cream/50 hover:text-olive hover:border-olive text-sm tracking-widest transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
