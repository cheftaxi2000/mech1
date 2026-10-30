import { useEffect, useState, type RefObject } from 'react';

/**
 * Small helpers shared by the 2D figures. They live here, not in a 3D figure file, so that a lesson
 * without a 3D figure does not pull in three.js (the bundler keeps a module's imports together).
 */
export function useReducedMotion() {
  const q = '(prefers-reduced-motion: reduce)';
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const m = matchMedia(q), on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

/** Position of an HTML label over an SVG with the given viewBox (percent of the box). */
export const at = (vb: [number, number, number, number], x: number, y: number) =>
  ({ left: `${((x - vb[0]) / vb[2]) * 100}%`, top: `${((y - vb[1]) / vb[3]) * 100}%` });

/**
 * True while the element is at least slightly on screen. «Play» loops add it to their condition, so an animation
 * that the student left running stops (no React re-renders, no WebGL frames, no battery use) once the figure is
 * scrolled away and resumes when it comes back.
 */
export function useInView(ref: RefObject<Element | null>): boolean {
  const [v, setV] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return v;
}
