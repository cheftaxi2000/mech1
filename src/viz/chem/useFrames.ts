import { useEffect, useRef, useState } from 'react';

const Q = '(prefers-reduced-motion: reduce)';
/** True when the visitor asked for reduced motion: continuous particle animations then start paused. */
export function useReducedMotion(): boolean {
  const [r, setR] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(Q).matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const m = matchMedia(Q), on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

export { useInView } from '../figUtils';

/** requestAnimationFrame loop calling `cb(dtSeconds)` while `on` is true (dt is capped at 0.1 s). */
export function useRaf(cb: (dt: number) => void, on: boolean) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!on) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => { const dt = Math.min(0.1, (now - last) / 1000); last = now; ref.current(dt); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
}
