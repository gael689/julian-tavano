'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LetterboxIntro() {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFinished(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isFinished) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-between">
      <motion.div
        className="w-full bg-charcoal"
        initial={{ height: '50vh' }}
        animate={{ height: '0vh' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
      <motion.div
        className="w-full bg-charcoal"
        initial={{ height: '50vh' }}
        animate={{ height: '0vh' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      />
    </div>
  );
}
