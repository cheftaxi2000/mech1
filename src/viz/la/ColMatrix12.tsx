import type { ReactNode } from 'react';
import { M } from '../../components/Tex';
import './l12.css';

/**
 * A matrix with round brackets whose columns can carry the colour roles of the linear-algebra chapters
 * (c1 green = first column, c2 blue = second column, c3 purple, tgt red, ax dark, miss orange).
 * `rows` holds TeX strings (every entry is typeset by KaTeX).
 */
export type ColRole = 'c1' | 'c2' | 'c3' | 'tgt' | 'ax' | 'miss' | '';
export function ColMatrix({ rows, cols = [], label }: { rows: readonly (readonly string[])[]; cols?: readonly ColRole[]; label?: string }) {
  const n = rows[0]?.length ?? 0;
  return (
    <span className="l12-mat" role="group" aria-label={label} style={{ gridTemplateColumns: `repeat(${n}, auto)` }}>
      {rows.flatMap((r, i) => r.map((x, j) => <span key={`${i}-${j}`} className={`l12-mat-cell ${cols[j] ?? ''}`}><M>{x}</M></span>))}
    </span>
  );
}

/** `F = (matrix)` on one line. */
export function Eq({ lhs, children }: { lhs: string; children: ReactNode }) {
  return <span className="l12-eq"><M>{`${lhs} =`}</M>{children}</span>;
}
