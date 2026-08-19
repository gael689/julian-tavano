'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Shared with Navigation.tsx — both effects kick in at the same scroll position.
const SCROLL_THRESHOLD = 80;

export default function StickyFadeWrapper({ children }: { children: React.ReactNode }) {
  const [heroH, setHeroH] = useState(900);

  useEffect(() => {
    setHeroH(window.innerHeight);
  }, []);

  const { scrollY } = useScroll();

  const scale        = useTransform(scrollY, [SCROLL_THRESHOLD, heroH], [1, 0.9]);
  const opacity      = useTransform(scrollY, [SCROLL_THRESHOLD, heroH * 0.6], [1, 0]);
  const borderRadius = useTransform(scrollY, [SCROLL_THRESHOLD, heroH * 0.6], ['0px', '16px']);

  return (
    <div>
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
