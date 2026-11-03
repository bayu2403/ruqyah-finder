'use client';

import { useEffect, useRef, useState } from 'react';

export function prefersReducedMotion() {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

// Counts from 0 to `to` once, after `delay` ms. Server render and reduced
// motion show the final number, so the value is never wrong without JS.
export function CountUp({ to, delay = 900, duration = 1200 }: { to: number; delay?: number; duration?: number }) {
  const [value, setValue] = useState(to);
  const raf = useRef<number>();

  useEffect(() => {
    if (to === 0 || prefersReducedMotion()) return;
    setValue(0);
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    const t = setTimeout(() => (raf.current = requestAnimationFrame(step)), delay);
    return () => {
      clearTimeout(t);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [to, delay, duration]);

  return <span className="tabular-nums">{value}</span>;
}
