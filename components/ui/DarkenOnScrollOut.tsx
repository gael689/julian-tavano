'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

/**
 * variant="darken"  — light section fading dark as it exits (cream → charcoal)
 * variant="lighten" — dark section fading light as it exits (charcoal → cream)
 */
export default function DarkenOnScrollOut({
  children,
  startAt = 0.08,
  variant = 'darken',
}: {
  children: React.ReactNode;
  startAt?: number;
  variant?: 'darken' | 'lighten';
}) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const brightnessEnd = variant === 'lighten' ? 7 : 0.45;
  const brightness = useTransform(scrollYProgress, [startAt, 0.98], [1, brightnessEnd]);
  const y          = useTransform(scrollYProgress, [startAt, 0.98], ['0%', '6%']);
  const filter     = useMotionTemplate`brightness(${brightness})`;

  return (
    <div ref={ref}>
      <motion.div style={{ filter, y, willChange: 'transform, filter' }}>
        {children}
      </motion.div>
    </div>
  );
}
