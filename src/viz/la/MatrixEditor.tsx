import { M } from '../../components/Tex';
import { useTr } from '../../i18n';
import { q, type Q } from '../../linalg/frac';
import type { Mat } from '../../linalg/gauss';
import './gauss.css';

/** Parse an entry: integers and simple fractions `a/b` (|a|, |b| ≤ 99). */
export function parseEntry(s: string): Q | null {
  const m = s.trim().replace('−', '-').match(/^(-?\d{1,2})(?:\/(\d{1,2}))?$/);
  if (!m) return null;
  const d = m[2] ? Number(m[2]) : 1;
  if (d === 0) return null;
  return q(Number(m[1]), d);
}
export const toStrings = (a: Mat): string[][] => a.map((r) => r.map((v) => (v[1] === 1 ? String(v[0]) : `${v[0]}/${v[1]}`)));
/** The matrix of the strings; invalid entries count as 0 (they are marked in the editor). */
export const fromStrings = (s: string[][]): Mat => s.map((r) => r.map((x) => parseEntry(x) ?? q(0)));

/** Editable augmented matrix [A | b] with buttons for the number of equations and unknowns. */
export function MatrixEditor({ value, onChange, maxM = 3, maxN = 3 }: { value: string[][]; onChange: (v: string[][]) => void; maxM?: number; maxN?: number }) {
  const tr = useTr();
  const m = value.length, n = value[0].length - 1;
  const resize = (mm: number, nn: number) => {
    const out = Array.from({ length: mm }, (_, i) => Array.from({ length: nn + 1 }, (_, j) => {
      if (j === nn) return value[i]?.[n] ?? '0';
      return value[i]?.[j] !== undefined && j < n ? value[i][j] : '0';
    }));
    onChange(out);
  };
  const set = (i: number, j: number, s: string) => onChange(value.map((r, a) => r.map((x, b) => (a === i && b === j ? s : x))));
  const cols = `repeat(${n}, auto) 4px auto`;
  return (
    <div className="me">
      <div className="me-size">
        <span>{tr('Gleichungen', 'Equations')} <M>m</M>:</span>
        <button className="ge-btn" onClick={() => resize(m - 1, n)} disabled={m <= 1} aria-label={tr('Eine Gleichung weniger', 'One equation fewer')}><M>-</M></button>
        <M>{String(m)}</M>
        <button className="ge-btn" onClick={() => resize(m + 1, n)} disabled={m >= maxM} aria-label={tr('Eine Gleichung mehr', 'One more equation')}><M>+</M></button>
        <span>{tr('Unbekannte', 'Unknowns')} <M>n</M>:</span>
        <button className="ge-btn" onClick={() => resize(m, n - 1)} disabled={n <= 1} aria-label={tr('Eine Unbekannte weniger', 'One unknown fewer')}><M>-</M></button>
        <M>{String(n)}</M>
        <button className="ge-btn" onClick={() => resize(m, n + 1)} disabled={n >= maxN} aria-label={tr('Eine Unbekannte mehr', 'One more unknown')}><M>+</M></button>
      </div>
      <div className="me-grid" style={{ gridTemplateColumns: cols }}>
        {Array.from({ length: n }, (_, j) => <span key={`h${j}`} className="me-head" style={{ gridRow: 1, gridColumn: j + 1 }}><M>{`x_${j + 1}`}</M></span>)}
        <span className="me-head" style={{ gridRow: 1, gridColumn: n + 2 }}><M>b</M></span>
        <span className="me-bar" style={{ gridRow: `2 / ${m + 2}`, gridColumn: n + 1 }} />
        {value.map((row, i) => row.map((x, j) => {
          const ok = parseEntry(x) !== null;
          return (
            <span key={`${i}-${j}`} className="me-cell" style={{ gridRow: i + 2, gridColumn: j < n ? j + 1 : n + 2 }}>
              <input value={x} inputMode="text" aria-invalid={!ok} onChange={(e) => set(i, j, e.target.value)}
                aria-label={j < n ? tr(`Zeile ${i + 1}, Faktor vor x${j + 1}`, `row ${i + 1}, coefficient of x${j + 1}`) : tr(`Zeile ${i + 1}, rechte Seite`, `row ${i + 1}, right-hand side`)} />
            </span>
          );
        }))}
      </div>
    </div>
  );
}

