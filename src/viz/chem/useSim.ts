import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { advance, type Sim } from '../../chem/particles';
import { useReducedMotion } from '../figUtils';

/**
 * Runs a particle simulation in the browser: pre-warmed (so the pressure read-out is meaningful at once),
 * paused while the figure is off screen, and not started under prefers-reduced-motion (Play starts it).
 * `init` builds the simulation once; the caller changes it in place (setT, setWidth, setCount …) and calls `touch()`.
 */
export function useSim(init: () => Sim, warm = 2.5) {
  const ref = useRef<Sim | null>(null);
  if (ref.current === null) { ref.current = init(); advance(ref.current, warm); }
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  const started = useRef(false);
  const host = useRef<HTMLElement | null>(null);

  // first appearance: start unless the user prefers reduced motion
  useEffect(() => { if (!started.current && !reduced) { started.current = true; setPlaying(true); } }, [reduced]);
  useEffect(() => { if (reduced) setPlaying(false); }, [reduced]);

  useEffect(() => {
    const el = host.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    let raf = 0, last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      advance(ref.current!, dt);
      bump();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, visible]);

  const touch = useCallback(() => bump(), []);
  const hostRef = useCallback((el: HTMLElement | null) => { host.current = el; }, []);
  return { sim: ref.current, playing, setPlaying, touch, hostRef, reduced };
}
