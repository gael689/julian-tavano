'use client';

import clsx from 'clsx';
import { Home, Inbox, MapPin, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin/prototipos', label: 'Modelos', Icon: Home },
  { href: '/admin/obras', label: 'Obras', Icon: MapPin },
  { href: '/admin/inversiones', label: 'Inversiones', Icon: TrendingUp },
  { href: '/admin/consultas', label: 'Consultas', Icon: Inbox },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-1 flex items-center gap-1.5 overflow-x-auto pb-0.5">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-[15px] font-semibold transition',
              active
                ? 'bg-olive-deep text-cream shadow-[0_2px_8px_rgba(58,74,42,0.20)]'
                : 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal'
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
