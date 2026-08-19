'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ServiceTabs({ wa }: { wa: string }) {
  const t = useTranslations('protoPage.tabs');
  const [active, setActive] = useState<'full' | 'plans'>('full');

  const SERVICES = {
    full: {
      label: t('full_label'),
      subtitle: t('full_subtitle'),
      items: [
        t('full_item_1'),
        t('full_item_2'),
        t('full_item_3'),
        t('full_item_4'),
        t('full_item_5'),
      ],
    },
    plans: {
      label: t('plans_label'),
      subtitle: t('plans_subtitle'),
      items: [
        t('plans_item_1'),
        t('plans_item_2'),
        t('plans_item_3'),
        t('plans_item_4'),
        t('plans_item_5'),
        t('plans_item_6'),
      ],
    },
  };

  const service = SERVICES[active];

  return (
    <div>
      {/* Toggle */}
      <div className="flex border border-charcoal/15 mb-6 w-fit">
        {(['full', 'plans'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`relative px-5 py-2.5 text-xs font-bold tracking-widest transition-colors ${
              active === key ? 'bg-charcoal text-cream' : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            {SERVICES[key].label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-charcoal/10 p-7"
        >
          <p className="text-xs text-charcoal/40 tracking-[0.2em] uppercase font-bold mb-5">{service.subtitle}</p>
          <ul className="flex flex-col gap-3.5">
            {service.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-charcoal/75 leading-relaxed">
                <CheckIcon className="w-4 h-4 text-olive shrink-0 mt-0.5" strokeWidth={2.5} />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <div className="flex flex-col gap-3 mt-5">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-olive text-cream text-xs font-bold tracking-widest text-center hover:bg-olive-deep transition-colors"
        >
          {active === 'full' ? t('cta_full') : t('cta_plans')}
        </a>
        <Link
          href="/#contacto"
          className="w-full py-3.5 border border-charcoal/15 text-charcoal/60 text-xs font-bold tracking-widest text-center hover:border-charcoal/40 hover:text-charcoal transition-colors"
        >
          {t('cta_email')}
        </Link>
      </div>
    </div>
  );
}
