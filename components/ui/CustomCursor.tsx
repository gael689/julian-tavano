'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let rafId: number;
    const mouse = { x: -100, y: -100 };
    const ring  = { x: -100, y: -100 };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouse.x}px,${mouse.y}px)`;
      }
    };

    const loop = () => {
      ring.x += (mouse.x - ring.x) * 0.1;
      ring.y += (mouse.y - ring.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.x}px,${ring.y}px)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    const addHoverListeners = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', onHoverIn);
        el.addEventListener('mouseleave', onHoverOut);
      });
    };

    const onHoverIn  = () => ringRef.current?.classList.add('cursor-hover');
    const onHoverOut = () => ringRef.current?.classList.remove('cursor-hover');

    document.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loop);
    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
