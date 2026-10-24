import type { ReactNode } from 'react';
import './chem.css';

/** Range slider with a label on the left and a read-out on the right (same look as the other subjects' figures). */
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

/** Row of buttons, one of them pressed. */
export function Presets<K extends string | number>({ items, value, onPick, label }: { items: readonly { id: K; label: ReactNode }[]; value: K | null; onPick: (id: K) => void; label: string }) {
  return (
    <div className="v-presets" role="group" aria-label={label}>
      {items.map((it) => <button key={String(it.id)} type="button" aria-pressed={value === it.id} onClick={() => onPick(it.id)}>{it.label}</button>)}
    </div>
  );
}
