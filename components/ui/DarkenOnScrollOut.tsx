'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, cubicBezier } from 'framer-motion';

// Slow-in/slow-out — no abrupt jump at either end of the scroll range.
const EASE_FLUID = cubicBezier(0.45, 0, 0.2, 1);

/**
 * variant="darken"  — light section fading dark as it exits (cream → charcoal)
 * variant="lighten" — dark section fading light as it exits (charcoal → cream)
 *
 * `brightnessEnd` lets a section tune how far the filter travels: sections
 * with an already-light background (e.g. olive-soft) hit CSS brightness
 * clipping much sooner than a near-black one, which reads as a sudden flash
 * to white instead of a fade — override it to match the section's own tone.
 */
export default function DarkenOnScrollOut({
  children,
  startAt = 0.3,
  variant = 'darken',
  brightnessEnd,
}: {
  children: React.ReactNode;
  startAt?: number;
  variant?: 'darken' | 'lighten';
  brightnessEnd?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const end = brightnessEnd ?? (variant === 'lighten' ? 7 : 0.45);
  const brightness = useTransform(scrollYProgress, [startAt, 1], [1, end], { ease: [EASE_FLUID] });
  const y          = useTransform(scrollYProgress, [startAt, 1], ['0%', '6%'], { ease: [EASE_FLUID] });
  const filter     = useMotionTemplate`brightness(${brightness})`;

  return (
    <div ref={ref}>
      <motion.div style={{ filter, y, willChange: 'transform, filter' }}>
        {children}
      </motion.div>
    </div>
  );
}
