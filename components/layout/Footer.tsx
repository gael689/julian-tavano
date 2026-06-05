import { useTranslations } from 'next-intl';
import { Link } from '@/routing';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('footer');
  const navT = useTranslations('nav');

  const links = [
    { href: '/#prototipos', label: navT('prototipos') },
    { href: '/obras', label: navT('obras') },
    { href: '/#sobre', label: navT('sobre') },
    { href: '/#contacto', label: navT('contacto') },
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
              className="brightness-0 opacity-80"
            />
            <p className="text-body text-charcoal/50 max-w-sm mt-2">
              {t('tagline')}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body text-charcoal/50 hover:text-olive-deep transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <a href="mailto:estudioarqjt@gmail.com" className="text-body text-charcoal/50 hover:text-olive-deep transition-colors">
              estudioarqjt@gmail.com
            </a>
            <a href="https://wa.me/5492494246878" target="_blank" rel="noopener noreferrer" className="text-body text-charcoal/50 hover:text-olive-deep transition-colors">
              +54 9 2494 24-6878
            </a>
            <p className="text-body text-charcoal/50 mt-2">
              Monte Hermoso, Buenos Aires
            </p>
          </div>

        </div>

        <div className="w-full h-px bg-charcoal/10 mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-charcoal/40">
          <p>{t('rights')}</p>
          <p>
            {t('developed_by')}{' '}
            <a
              href="https://gaelgonzalez.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-olive hover:text-olive-deep transition-colors font-normal"
            >
              Gael González
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
