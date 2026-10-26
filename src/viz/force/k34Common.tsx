import type { CSSProperties, PointerEvent as RPointerEvent, ReactNode } from 'react';
import { M } from '../../components/Tex';
import './k34.css';

/** Shared pieces of the figures of the lessons «Systemabgrenzung» (K3) and «Verteilte Kräfte» (K4). */
export type V = readonly [number, number];
export type ViewBox = readonly [number, number, number, number];

export const pts = (ps: readonly V[]) => ps.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
export const vsub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
export const vlen = (a: V) => Math.hypot(a[0], a[1]);
export const vunit = (a: V): V => { const l = vlen(a) || 1; return [a[0] / l, a[1] / l]; };
export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

/** Position of an HTML label over an SVG with the given viewBox (percent of the box). */
export const place = (vb: ViewBox, p: V): CSSProperties => ({ left: `${((p[0] - vb[0]) / vb[2]) * 100}%`, top: `${((p[1] - vb[1]) / vb[3]) * 100}%` });

/** Client position → figure coordinates (viewBox units). */
export function svgPoint(svg: SVGSVGElement, vb: ViewBox, e: RPointerEvent | PointerEvent): V {
  const r = svg.getBoundingClientRect();
  return [vb[0] + ((e.clientX - r.left) / r.width) * vb[2], vb[1] + ((e.clientY - r.top) / r.height) * vb[3]];
}

export type ArrowKind = 'out' | 'in' | 'ghost' | 'load' | 'neutral' | 'pos' | 'neg';
/** An arrow from a to b (tail at a). `kind` sets the colour (see k34.css); the head is drawn in viewBox units. */
export function KArrow({ a, b, kind, w = 3, head = 11, className = '' }: { a: V; b: V; kind: ArrowKind; w?: number; head?: number; className?: string }) {
  const d = vsub(b, a), l = vlen(d);
  if (l < 2) return null;
  const u: V = [d[0] / l, d[1] / l];
  const s = Math.min(head, 0.7 * l);
  const base: V = [b[0] - s * u[0], b[1] - s * u[1]];
  const head2 = pts([b, [base[0] + 0.42 * s * u[1], base[1] - 0.42 * s * u[0]], [base[0] - 0.42 * s * u[1], base[1] + 0.42 * s * u[0]]]);
  return (
    <g className={`kf-arrow ${kind} ${className}`} style={{ ['--kw' as string]: w }}>
      <line x1={a[0]} y1={a[1]} x2={base[0] + 1.5 * u[0]} y2={base[1] + 1.5 * u[1]} />
      <polygon points={head2} />
    </g>
  );
}

/** A text label placed over the SVG; `ink` colours it, `children` is usually <M>…</M>. */
export function KL({ vb, at, ink = 'fg', anchor, children, className = '' }: { vb: ViewBox; at: V; ink?: string; anchor?: 'l' | 'r' | 't' | 'b'; children: ReactNode; className?: string }) {
  return <div className={`kf-lbl ink-${ink} ${anchor ? `a-${anchor}` : ''} ${className}`} style={place(vb, at)}>{children}</div>;
}

/** A point name, red, as in the lecture. */
export const PName = ({ vb, at, tex, anchor }: { vb: ViewBox; at: V; tex: string; anchor?: 'l' | 'r' | 't' | 'b' }) =>
  <KL vb={vb} at={at} ink="point" anchor={anchor}><M>{tex}</M></KL>;

/** A labelled range slider in the project's slider look. */
export function KSlider({ label, min, max, step, value, onChange, val, aria }: {
  label: ReactNode; min: number; max: number; step: number; value: number; onChange: (v: number) => void; val: ReactNode; aria: string;
}) {
  return (
    <label className="slider kf-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={aria} />
      <span className="val">{val}</span>
    </label>
  );
}

/** Group the integer part of a plain number string with thin spaces (TeX `\,`) from 10 000 on. */
const group = (s: string, dec: string) => {
  const [int, frac] = s.split(dec);
  const g = int.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');
  return frac === undefined ? g : g + dec + frac;
};

/** Format with significant digits (as TeX); scientific notation outside [0.01, 10⁶). German decimal comma inside TeX is `{,}`. */
export function fmtSig(x: number, sig: number, lang: 'de' | 'en'): string {
  if (x === 0) return '0';
  const ax = Math.abs(x), dsep = lang === 'de' ? '{,}' : '.';
  const dec = (v: number, d: number) => { const s = v.toFixed(Math.max(0, d)); return lang === 'de' ? s.replace('.', '{,}') : s; };
  const trim = (s: string) => (s.includes(dsep) ? s.replace(/0+$/, '').replace(new RegExp(`${dsep.replace(/[{}.]/g, '\\$&')}$`), '') : s);
  if (ax >= 0.01 && ax < 1e6) {
    const digits = sig - 1 - Math.floor(Math.log10(ax));
    const s = trim(dec(x, digits));
    return ax >= 1e4 ? group(s, dsep) : s;
  }
  const e = Math.floor(Math.log10(ax));
  return `${trim(dec(x / 10 ** e, sig - 1))}\\cdot 10^{${e}}`;
}
