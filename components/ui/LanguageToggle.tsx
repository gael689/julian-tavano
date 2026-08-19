'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/routing';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="relative flex items-center bg-cream border border-olive rounded-full p-1 w-16 h-8 focus:outline-none focus:ring-2 focus:ring-olive-soft transition-colors"
      aria-label="Cambiar idioma"
      role="switch"
      aria-checked={locale === 'en'}
    >
      {/* Background Pill */}
      <div className="absolute inset-0 rounded-full bg-cream z-0" />
      
      {/* Animated active pill */}
      <motion.div
        className="absolute top-1 bottom-1 w-6 rounded-full bg-olive z-10"
        initial={false}
        animate={{
          left: locale === 'es' ? '4px' : 'calc(100% - 28px)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      />

      <div className="relative z-20 flex justify-between w-full px-1.5 text-[0.6rem] font-bold tracking-wider">
        <span className={clsx("transition-colors duration-300", locale === 'es' ? 'text-cream' : 'text-olive-soft')}>
          ES
        </span>
        <span className={clsx("transition-colors duration-300", locale === 'en' ? 'text-cream' : 'text-olive-soft')}>
          EN
        </span>
      </div>
    </button>
  );
}
