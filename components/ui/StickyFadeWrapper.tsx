'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// No sticky — the hero scrolls normally but fades + scales as it exits the viewport.
// This avoids the "dead scroll" problem of position:sticky with extra height.
export default function StickyFadeWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scale        = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity      = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.6], ['0px', '16px']);

  return (
    <div ref={ref}>
      <motion.div
        style={{
          scale,
          opacity,
          borderRadius,
          overflow: 'hidden',
          willChange: 'transform, opacity',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
