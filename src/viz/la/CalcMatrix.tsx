import { useRef, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr, type Lang } from '../../i18n';
import type { Mat } from '../../linalg/matops';
import './CalcMat.css';

/** Shared small building blocks of the matrix lessons (la-rechnen, la-spezial, la-produkt): matrix grids, editable matrices, steppers, sliders. */

/** A number for KaTeX: at most `d` decimals, trailing zeros dropped, German decimal comma protected by braces. */
export function texNum(x: number, lang: Lang, d = 2): string {
  let s = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return lang === 'de' ? s.replace('.', '{,}') : s;
}

/** pmatrix TeX of a matrix (entries are numbers) — the entries are separated by & and rows by \\. */
export const texMat = (A: Mat, lang: Lang, d = 2) => String.raw`\begin{pmatrix}${A.map((r) => r.map((v) => texNum(v, lang, d)).join(' & ')).join(String.raw` \\ `)}\end{pmatrix}`;
/** Column vector as pmatrix. */
export const texVec = (v: number[], lang: Lang, d = 2) => texMat(v.map((x) => [x]), lang, d);

/** Tuple "(a; b)" in German (decimal comma) / "(a, b)" in English, as TeX. */
export const texTuple = (v: number[], lang: Lang, d = 2) => `(${v.map((x) => texNum(x, lang, d)).join(lang === 'de' ? String.raw`;\ ` : String.raw`,\ `)})`;

export type CellInfo = { cls?: string; onClick?: () => void; title?: string };

/**
 * A matrix drawn as a bracketed grid of cells. `cell(i, j)` gives the content, `info(i, j)` an optional class / click handler
 * (0-based). `rowLabels` / `colLabels` are small index labels at the left / top.
 */
export function MatGrid({ rows, cols, cell, info, rowLabels, colLabels, label, className }: {
  rows: number; cols: number;
  cell: (i: number, j: number) => ReactNode;
  info?: (i: number, j: number) => CellInfo;
  rowLabels?: (i: number) => ReactNode;
  colLabels?: (j: number) => ReactNode;
  label?: string;
  className?: string;
}) {
  const lead = rowLabels ? 'auto ' : '';
  return (
    <div className={`la-matwrap${className ? ` ${className}` : ''}`} role="group" aria-label={label}>
      <div className="la-mat" style={{ gridTemplateColumns: `${lead}repeat(${cols}, minmax(var(--la-cw, 2.4em), auto))` }}>
        {colLabels && <>
          {rowLabels && <span className="la-lab" />}
          {Array.from({ length: cols }, (_, j) => <span key={`cl${j}`} className="la-lab la-lab-col">{colLabels(j)}</span>)}
        </>}
        {Array.from({ length: rows }, (_, i) => (
          <MatRow key={i} i={i} cols={cols} cell={cell} info={info} rowLabel={rowLabels?.(i)} />
        ))}
      </div>
    </div>
  );
}

function MatRow({ i, cols, cell, info, rowLabel }: { i: number; cols: number; cell: (i: number, j: number) => ReactNode; info?: (i: number, j: number) => CellInfo; rowLabel?: ReactNode }) {
  return (
    <>
      {rowLabel !== undefined && <span className="la-lab la-lab-row">{rowLabel}</span>}
      {Array.from({ length: cols }, (_, j) => {
        const c = info?.(i, j) ?? {};
        return c.onClick
          ? <button key={j} type="button" className={`la-c ${c.cls ?? ''}`} onClick={c.onClick} title={c.title}>{cell(i, j)}</button>
          : <span key={j} className={`la-c ${c.cls ?? ''}`} title={c.title}>{cell(i, j)}</span>;
      })}
    </>
  );
}

/** One editable number. Invalid intermediate input (an empty field, a lone minus) is ignored until the user finishes. */
function NumCell({ value, onChange, onFocus, cls, aria }: { value: number; onChange: (v: number) => void; onFocus?: () => void; cls?: string; aria: string }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <input ref={ref} type="number" step="any" inputMode="decimal" className={`la-c la-in ${cls ?? ''}`} aria-label={aria}
      value={Number.isFinite(value) ? +value.toFixed(6) : 0}
      onFocus={(e) => { e.target.select(); onFocus?.(); }}
      onChange={(e) => { const v = e.target.valueAsNumber; if (Number.isFinite(v)) onChange(v); }}
      onBlur={(e) => { e.target.value = String(+value.toFixed(6)); }} />
  );
}

/** A bracketed matrix of editable numbers. `info` gives classes per cell; `onCell` fires when an entry gets the focus. */
export function MatInput({ value, onChange, info, onCell, name, rowLabels, colLabels }: {
  value: Mat; onChange: (A: Mat) => void;
  info?: (i: number, j: number) => CellInfo;
  onCell?: (i: number, j: number) => void;
  name: string;
  rowLabels?: (i: number) => ReactNode;
  colLabels?: (j: number) => ReactNode;
}) {
  const tr = useTr();
  const rows = value.length, cols = value[0]?.length ?? 0;
  return (
    <MatGrid rows={rows} cols={cols} rowLabels={rowLabels} colLabels={colLabels} label={name}
      info={() => ({ cls: 'wrap' })}
      cell={(i, j) => (
        <NumCell value={value[i][j]} cls={info?.(i, j).cls} onFocus={() => onCell?.(i, j)}
          aria={tr(`${name}, Zeile ${i + 1}, Spalte ${j + 1}`, `${name}, row ${i + 1}, column ${j + 1}`)}
          onChange={(v) => onChange(value.map((r, a) => r.map((x, b) => (a === i && b === j ? v : x))))} />
      )} />
  );
}

/** − n + stepper. */
export function Stepper({ label, value, min, max, onChange, aria }: { label: ReactNode; value: number; min: number; max: number; onChange: (v: number) => void; aria: string }) {
  const tr = useTr();
  return (
    <span className="la-step" role="group" aria-label={aria}>
      <span className="la-step-l">{label}</span>
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={tr(`${aria} verkleinern`, `decrease ${aria}`)}><M>-</M></button>
      <output>{value}</output>
      <button type="button" disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={tr(`${aria} vergrössern`, `increase ${aria}`)}><M>+</M></button>
    </span>
  );
}

/** Range slider with a KaTeX label and a value read-out. */
export function CalcSlider({ label, min, max, step, value, onChange, show, aria }: { label: ReactNode; min: number; max: number; step: number; value: number; onChange: (v: number) => void; show: ReactNode; aria: string }) {
  return (
    <label className="slider wide-slider">
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={aria} />
      <span className="val">{show}</span>
    </label>
  );
}

/** Coloured ink for text next to a figure (roles of the plot: c1 green, c2 blue, tgt red, miss orange, c3 purple). */
export function Ink({ role, children }: { role: 'c1' | 'c2' | 'tgt' | 'miss' | 'c3' | 'ax'; children: ReactNode }) {
  return <span className={`pl-ink-${role}`}>{children}</span>;
}

/** A matrix as TeX inside <M>, with the current language's decimal sign. */
export function MM({ A, d = 2, p }: { A: Mat; d?: number; p?: string }) {
  const lang = useLang();
  return <M p={p}>{texMat(A, lang, d)}</M>;
}
