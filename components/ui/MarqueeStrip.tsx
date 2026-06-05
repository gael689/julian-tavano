const ITEMS = [
  'ARQUITECTURA',
  'MONTE HERMOSO',
  'DISEÑO',
  'VIVIENDAS',
  'HORMIGÓN',
  'MADERA',
  'SUSTENTABLE',
  'PREMIUM',
];

export default function MarqueeStrip() {
  return (
    <div className="bg-olive-deep py-[11px] overflow-hidden select-none">
      <div className="marquee-inner flex whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {ITEMS.map((item, j) => (
              <span key={j} className="inline-flex items-center">
                <span
                  className="text-cream/70 px-7"
                  style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase' }}
                >
                  {item}
                </span>
                <span className="text-cream/25" style={{ fontSize: '7px' }}>◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
