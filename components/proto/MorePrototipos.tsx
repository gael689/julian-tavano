'use client';

import { useTranslations } from 'next-intl';
import { PROTOTIPOS_DATA } from '@/lib/data/prototipos';
import { ProtoCard } from '@/components/proto/ProtoCard';

export default function MorePrototipos({ currentSlug }: { currentSlug: string }) {
  const t = useTranslations('protoPage');
  const others = PROTOTIPOS_DATA.filter((p) => p.id !== currentSlug);

  if (others.length === 0) return null;

  const isOdd = others.length % 2 !== 0;

  return (
    <section className="bg-concrete section-padding">
      <div className="container-layout">
        <div className="mb-10 md:mb-14">
          <h2
            className="text-h2 text-charcoal"
            style={{ fontFamily: "'Century Gothic', Futura, sans-serif" }}
          >
            {t('otros_titulo')}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {others.map((proto, i) => {
            const isLast = i === others.length - 1;
            return (
              <ProtoCard
                key={proto.id}
                proto={proto}
                index={i}
                wide={isOdd && isLast}
                external={false}
                compact
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
