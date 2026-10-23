import type { ReactNode } from 'react';
import './l12.css';

/** Range slider with a TeX label on the left and a read-out on the right (same look as the other figures). */
export function Slider({ label, min, max, step, value, onChange, show, aria }: {
  label: ReactNode; min: number; max: number; step: number; value: number; onChange: (v: number) => void; show: ReactNode; aria: string;
}) {
  return (
    <label className="slider wide-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={aria} />
      <span className="val">{show}</span>
    </label>
  );
}

/** Row of preset buttons (one is pressed). */
export function Presets<K extends string>({ items, value, onPick, label }: { items: readonly { id: K; label: ReactNode }[]; value: K | null; onPick: (id: K) => void; label: string }) {
  return (
    <div className="v-presets" role="group" aria-label={label}>
      {items.map((it) => <button key={it.id} type="button" aria-pressed={value === it.id} onClick={() => onPick(it.id)}>{it.label}</button>)}
    </div>
  );
}
