import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

/** A labelled range input in the look of the other figures (`.slider`). */
export function NumSlider({ label, min, max, value, onChange, aria }: {
  label: ReactNode; min: number; max: number; value: number; onChange: (v: number) => void; aria: string;
}) {
  return (
    <label className="slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={1} value={value} aria-label={aria} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="val">{value}</span>
    </label>
  );
}

/** Calls `tick` every `ms` while `on` is true. */
export function useInterval(on: boolean, ms: number, tick: () => void) {
  const ref = useRef(tick);
  ref.current = tick;
  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => ref.current(), ms);
    return () => window.clearInterval(id);
  }, [on, ms]);
}
