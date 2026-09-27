/**
 * Borde ondulado entre dos secciones de fondo sólido — sugerencia propia
 * (inspirada en la skill `estilo-mbk`, ver docs/plan-revision-2026-09.md),
 * aprobada por Gael el 27/sep/2026. Sin color nuevo ni animación: `fondo` es
 * el color de la sección de arriba, `color` el de la de abajo — el SVG
 * recorta ese segundo color en una curva sobre el primero.
 */
export default function Ola({
  fondo,
  color,
  invertida = false,
}: {
  fondo: string;
  color: string;
  invertida?: boolean;
}) {
  return (
    <div className={fondo} aria-hidden="true">
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className={`block h-6 w-full md:h-9 fill-current ${color} ${invertida ? '-scale-x-100' : ''}`}
      >
        <path d="M0 20C180 38 360 2 600 18s420 28 620 6c90-10 170-10 220-3V40H0Z" />
      </svg>
    </div>
  );
}
