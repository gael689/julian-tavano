'use client';

import { motion } from 'framer-motion';

export default function TextReveal({ 
  text, 
  delay = 0, 
  className 
}: { 
  text: string; 
  delay?: number; 
  className?: string;
}) {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: '0.25em' }} key={index}>
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
