'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/routing';
import Image from 'next/image';

function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');
  const pathname = usePathname();

  if (pathname === '/obras') return null;

  const links = [
    { href: '/#modelos',                  label: navT('prototipos') },
    { href: '/#proyectos-personalizados', label: navT('personalizados') },
    { href: '/obras',                     label: navT('obras'), newTab: true },
    { href: '/#inversion',                label: navT('inversion') },
    { href: '/#sobre',                    label: navT('sobre') },
    { href: '/#contacto',                 label: navT('contacto') },
  ];

  return (
    <footer className="bg-cream text-charcoal pt-20 pb-10">
      <div className="container-layout">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <Image
              src="/logo.png"
              alt="JT Arquitectura"
              width={60}
              height={60}
              className="brightness-0 opacity-90"
            />
            <p className="text-body font-normal text-charcoal/80 max-w-sm mt-2">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                link.newTab ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body font-normal text-charcoal/80 hover:text-olive-deep transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-body font-normal text-charcoal/80 hover:text-olive-deep transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <a
              href="mailto:estudioarqjt@gmail.com"
              className="text-body font-normal text-charcoal/80 hover:text-olive-deep transition-colors"
            >
              estudioarqjt@gmail.com
            </a>
            <a
              href="https://wa.me/5492494246878"
              target="_blank"
              rel="noopener noreferrer"
              className="text-body font-normal text-charcoal/80 hover:text-olive-deep transition-colors"
            >
              +54 9 2494 24-6878
            </a>
            <a
              href="https://instagram.com/arq.juliantavano"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-body font-normal text-charcoal/80 hover:text-olive-deep transition-colors"
            >
              <InstagramIcon size={16} className="shrink-0" />
              @arq.juliantavano
            </a>
            <p className="text-body font-normal text-charcoal/80 mt-2">
              Monte Hermoso, Buenos Aires
            </p>
          </div>

        </div>

        <div className="w-full h-px bg-charcoal/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-normal text-charcoal/65">
          <p>{t('rights')}</p>
          <p>
            {t('developed_by')}{' '}
            <a
              href="https://gaelgonzalez.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wood font-bold hover:text-olive-deep transition-colors"
            >
              Gael González
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
