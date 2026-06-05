'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname } from '@/routing';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const isObrasPage = pathname === '/obras';
  
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: '/#prototipos', label: t('prototipos') },
    { href: '/obras', label: t('obras') },
    { href: '/#sobre', label: t('sobre') },
    { href: '/#contacto', label: t('contacto') },
  ];

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isObrasPage 
            ? 'bg-[#6B7A5A] py-1.5 shadow-md' // Lighter olive, tighter padding
            : scrolled 
              ? 'bg-cream/90 backdrop-blur-md py-2 shadow-sm' 
              : 'bg-gradient-to-b from-black/80 via-black/25 to-transparent py-3'
        )}
        style={{ '--nav-h': scrolled && !isObrasPage ? '4rem' : '7rem' } as React.CSSProperties}
      >
        <div className="container-layout flex items-center justify-between">
          <Link href="/" className="relative z-50 flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="JT Arquitectura" 
              width={200} 
              height={200}
              quality={100}
              priority
              className={clsx(
                "transition-all duration-300 object-contain origin-left", 
                scrolled 
                  ? "h-16 md:h-16 w-auto brightness-0" 
                  : "h-16 md:h-20 w-auto brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
              )} 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "text-eyebrow font-bold transition-colors tracking-widest",
                    scrolled && !isObrasPage ? "text-olive hover:text-olive-deep" : "text-cream hover:text-cream-light drop-shadow-md"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className={clsx("w-px h-4 transition-colors", scrolled ? "bg-concrete" : "bg-cream/30")} />
            <LanguageToggle />
          </div>

          {/* Mobile Toggle */}
          <button 
            className={clsx(
              "md:hidden relative z-50 p-2 transition-colors",
              scrolled || menuOpen ? "text-olive" : "text-cream drop-shadow-md"
            )}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-cream flex flex-col justify-center px-6"
          >
            <div className="flex flex-col gap-8">
              <div className="mb-8">
                <LanguageToggle />
              </div>
              <nav className="flex flex-col gap-6">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-display-l text-olive-deep"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
