import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTr } from '../../i18n';

/**
 * One step of an animation.
 * - `ms`: duration of the step's motion.
 * - `holdMs`: pause after the step during autoplay, long enough to read the caption (default 1500).
 * Every step's FINAL frame (t = 1) must show what its caption says: it is the resting frame after
 * the step and the only frame shown when a step is opened under prefers-reduced-motion.
 */
export interface AnimStep { caption: ReactNode; ms: number; holdMs?: number }

const REDUCED_Q = '(prefers-reduced-motion: reduce)';
const reducedNow = () => typeof matchMedia !== 'undefined' && matchMedia(REDUCED_Q).matches;

function usePrefersReducedMotion() {
  const q = REDUCED_Q;
  const [reduced, setReduced] = useState(reducedNow);
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
 *
 * - Autoplay starts once when the FIGURE is at least half visible, and pauses while it is scrolled
 *   out of view (it resumes when it comes back).
 * - "Play" runs the remaining steps; a step number, Back or Next plays just that step.
 * - prefers-reduced-motion: no autoplay; step numbers / Back / Next show the step's final frame
 *   without motion; only an explicit "Play" animates.
 */
export function StepPlayer({ steps, children, label }: {
  steps: AnimStep[];
  children: (step: number, t: number) => ReactNode;
  label: string;
}) {
  const tr = useTr();
  const reduced = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  // Under reduced motion the first thing shown is step 1's final frame (it illustrates caption 1).
  const [t, setT] = useState(() => (reducedNow() ? 1 : 0));
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0); // bumping this restarts the clock (and clears any pending hold)
  const stepRef = useRef(0), tRef = useRef(t), autoRef = useRef(true);
  const startedRef = useRef(false), playingRef = useRef(false), resumeOnVisibleRef = useRef(false);
  const figRef = useRef<HTMLDivElement>(null);
  playingRef.current = playing;

  const show = useCallback((s: number, tt: number) => {
    const c = Math.max(0, Math.min(steps.length - 1, s));
    stepRef.current = c; tRef.current = tt; setStep(c); setT(tt);
  }, [steps.length]);

  const start = useCallback((auto: boolean) => {
    startedRef.current = true;
    resumeOnVisibleRef.current = false;
    autoRef.current = auto;
    setRun((r) => r + 1);
    setPlaying(true);
  }, []);

  /** Go to step i: animate it (or, under reduced motion, show its final frame). Brings the figure into view. */
  const goTo = useCallback((i: number) => {
    const el = figRef.current;
    if (el && typeof el.getBoundingClientRect === 'function') {
      const b = el.getBoundingClientRect();
      if (b.top < 52 || b.bottom > window.innerHeight) el.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    }
    if (reduced) { startedRef.current = true; setPlaying(false); show(i, 1); return; }
    show(i, 0);
    start(false);
  }, [reduced, show, start]);

  // Autoplay once when the figure is half visible; pause while it is out of view.
  useEffect(() => {
    const el = figRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      const visible = e.isIntersecting && e.intersectionRatio >= 0.5;
      if (visible) {
        if (!startedRef.current && !reduced) { show(0, 0); start(true); }
        else if (resumeOnVisibleRef.current) { start(autoRef.current); }
      } else if (!e.isIntersecting && playingRef.current) {
        setPlaying(false);
        resumeOnVisibleRef.current = true;
      }
    }, { threshold: [0, 0.5] });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, show, start]);

  // Turning on "reduce motion" while something plays stops it where it is.
  useEffect(() => { if (reduced) { setPlaying(false); show(stepRef.current, 1); } }, [reduced, show]);

  // Animation clock. Restarts on every `run`, so a click during a hold never inherits the old hold.
  useEffect(() => {
    if (!playing) return;
    let raf = 0, last = performance.now(), hold = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100); // a background tab must not skip whole steps
      last = now;
      const cur = steps[stepRef.current];
      if (!cur) { setPlaying(false); return; }
      if (hold > 0) {
        hold -= dt;
        if (hold <= 0) {
          if (stepRef.current >= steps.length - 1) { setPlaying(false); return; }
          show(stepRef.current + 1, 0);
        }
      } else {
        const nt = tRef.current + dt / cur.ms;
        if (nt < 1) show(stepRef.current, nt);
        else {
          show(stepRef.current, 1);
          if (autoRef.current && stepRef.current < steps.length - 1) hold = cur.holdMs ?? 1500;
          else { setPlaying(false); return; }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, run, steps, show]);

  const atEnd = step === steps.length - 1 && t >= 1;
  const togglePlay = () => {
    if (playing) { setPlaying(false); resumeOnVisibleRef.current = false; return; }
    if (atEnd) { show(0, 0); start(true); return; }
    if (t >= 1) show(step + 1, 0);
    start(true); // explicit Play animates even under reduced motion
  };

  return (
    <div className="stepper" data-step={step} data-t={t.toFixed(3)} data-playing={playing ? '1' : '0'}>
      <div className="stepper-fig" ref={figRef}>
        <div role="img" aria-label={label}>{children(step, t)}</div>
        <div className="stepper-controls">
          <button onClick={() => goTo(step - 1)} disabled={step === 0} aria-label={tr('Vorheriger Schritt', 'Previous step')}>‹</button>
          <button className="primary" onClick={togglePlay}>
            {playing ? tr('Pause', 'Pause') : atEnd ? tr('Nochmals', 'Replay') : tr('Abspielen', 'Play')}
          </button>
          <button onClick={() => goTo(step + 1)} disabled={step === steps.length - 1} aria-label={tr('Nächster Schritt', 'Next step')}>›</button>
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
            <button className="step-num" onClick={() => goTo(i)} aria-label={tr(`Schritt ${i + 1} abspielen`, `Play step ${i + 1}`)}>{i + 1}</button>
            <div className="step-text">{s.caption}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}
