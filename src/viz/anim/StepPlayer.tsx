import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTr } from '../../i18n';

export interface AnimStep { caption: ReactNode; ms: number }

function usePrefersReducedMotion() {
  const q = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(q).matches);
  useEffect(() => {
    if (typeof matchMedia === 'undefined') return;
    const m = matchMedia(q);
    const on = () => setReduced(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * Plays a figure step by step, in sync with a numbered list of captions (the derivation text).
 * `children(step, t)` draws the figure for step index `step` at normalised time t ∈ [0, 1].
 * - Starts once by itself when half of it scrolls into view; "Play" runs all remaining steps.
 * - Clicking a step number (or Back/Next) plays just that step.
 * - With prefers-reduced-motion, every step jumps straight to its final state.
 */
export function StepPlayer({ steps, children, label }: {
  steps: AnimStep[];
  children: (step: number, t: number) => ReactNode;
  label: string;
}) {
  const tr = useTr();
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [t, setT] = useState(reduced ? 1 : 0);
  const [playing, setPlaying] = useState(false);
  const stepRef = useRef(step), tRef = useRef(t), autoRef = useRef(true), startedRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const show = useCallback((s: number, tt: number) => {
    stepRef.current = s; tRef.current = tt; setStep(s); setT(tt);
  }, []);

  /** Play from the start of step i; `auto` continues through the following steps. */
  const playFrom = useCallback((i: number, auto: boolean) => {
    startedRef.current = true;
    autoRef.current = auto;
    if (reduced) { show(i, 1); setPlaying(false); return; }
    show(i, 0); setPlaying(true);
  }, [reduced, show]);

  // Autoplay once, when the figure is first half visible.
  useEffect(() => {
    if (reduced || typeof IntersectionObserver === 'undefined' || !rootRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !startedRef.current) playFrom(0, true);
    }, { threshold: 0.5 });
    io.observe(rootRef.current);
    return () => io.disconnect();
  }, [reduced, playFrom]);

  // Animation clock.
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now(), hold = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100); // a background tab must not skip whole steps
      last = now;
      if (hold > 0) {
        hold -= dt;
        if (hold <= 0) show(stepRef.current + 1, 0);
      } else {
        const nt = tRef.current + dt / steps[stepRef.current].ms;
        if (nt < 1) show(stepRef.current, nt);
        else {
          show(stepRef.current, 1);
          if (autoRef.current && stepRef.current < steps.length - 1) hold = 900; // short pause between steps
          else { setPlaying(false); return; }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, steps, show]);

  const atEnd = step === steps.length - 1 && t >= 1;
  const togglePlay = () => {
    if (playing) { setPlaying(false); return; }
    if (atEnd) { playFrom(0, true); return; }
    startedRef.current = true;
    autoRef.current = true;
    if (reduced) { show(Math.min(step + (t >= 1 ? 1 : 0), steps.length - 1), 1); return; }
    if (t >= 1) show(step + 1, 0);
    setPlaying(true);
  };

  return (
    <div className="stepper" ref={rootRef} data-step={step} data-t={t.toFixed(3)} data-playing={playing ? '1' : '0'}>
      <div className="stepper-fig">
        <div role="img" aria-label={label}>{children(step, t)}</div>
        <div className="stepper-controls">
          <button onClick={() => playFrom(Math.max(0, step - 1), false)} disabled={step === 0} aria-label={tr('Vorheriger Schritt', 'Previous step')}>‹</button>
          <button className="primary" onClick={togglePlay} aria-label={playing ? tr('Pause', 'Pause') : tr('Abspielen', 'Play')}>
            {playing ? tr('Pause', 'Pause') : atEnd ? tr('Nochmals', 'Replay') : tr('Abspielen', 'Play')}
          </button>
          <button onClick={() => playFrom(Math.min(steps.length - 1, step + 1), false)} disabled={step === steps.length - 1} aria-label={tr('Nächster Schritt', 'Next step')}>›</button>
          <div className="stepper-progress" aria-hidden="true">
            {steps.map((_, i) => (
              <span key={i} className={i < step ? 'done' : i === step ? 'now' : ''}>
                <i style={{ width: `${i < step ? 100 : i === step ? Math.round(t * 100) : 0}%` }} />
              </span>
            ))}
          </div>
        </div>
      </div>
      <ol className="stepper-steps">
        {steps.map((s, i) => (
          <li key={i} className={i === step ? 'active' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <button className="step-num" onClick={() => playFrom(i, false)} aria-label={tr(`Schritt ${i + 1} abspielen`, `Play step ${i + 1}`)}>{i + 1}</button>
            <div className="step-text">{s.caption}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
