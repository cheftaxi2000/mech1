import type { ReactNode } from 'react';
import { M } from '../../components/Tex';
import { tex } from '../../linalg/frac';
import type { Mat } from '../../linalg/gauss';
import './gauss.css';

/**
 * An (augmented) matrix as an HTML grid: brackets, the bar before the right-hand side, optional column heads
 * (x₁ x₂ x₃ | 1 as on the slides) and a note column right of every row (red multiples, «II − I», back substitution).
 * Cells are KaTeX. Used by all figures of the Gauss and rank lessons.
 */
export interface GridProps {
  cells: ReactNode[][];
  /** number of columns left of the bar (null = no bar) */
  nLeft: number | null;
  heads?: ReactNode[];
  headCls?: (j: number) => string;
  cellCls?: (i: number, j: number) => string;
  side?: (i: number) => ReactNode;
  label?: string;
}

export function MatrixGrid({ cells, nLeft, heads, headCls, cellCls, side, label }: GridProps) {
  const m = cells.length, cols = cells[0]?.length ?? 0;
  const hasBar = nLeft !== null && nLeft < cols;
  // grid columns: [pad] c_0 … c_{nLeft-1} [bar] c_nLeft … [pad] side
  const colOf = (j: number) => 2 + j + (hasBar && j >= nLeft! ? 1 : 0);
  const last = colOf(cols - 1);
  const template = ['10px', ...Array.from({ length: cols + (hasBar ? 1 : 0) }, (_, k) => (hasBar && k === nLeft ? '6px' : 'auto')), '10px', side ? 'auto' : '0px'].join(' ');
  const r0 = heads ? 2 : 1;
  return (
    <div className="gm-wrap">
      <div className="gm" role="img" aria-label={label} style={{ gridTemplateColumns: template }}>
        <div className="gm-frame" style={{ gridColumn: `1 / ${last + 2}`, gridRow: `${r0} / ${r0 + m}`, alignSelf: 'stretch', justifySelf: 'stretch' }} />
        {hasBar && <div className="gm-bar" style={{ gridColumn: colOf(nLeft!) - 1, gridRow: `${r0} / ${r0 + m}` }} />}
        {heads && heads.map((h, j) => <div key={`h${j}`} className={`gm-head ${headCls?.(j) ?? ''}`} style={{ gridColumn: colOf(j), gridRow: 1 }}>{h}</div>)}
        {cells.map((row, i) => row.map((c, j) => (
          <div key={`${i}-${j}`} className={`gm-c ${cellCls?.(i, j) ?? ''}`} style={{ gridColumn: colOf(j), gridRow: r0 + i }}>{c}</div>
        )))}
        {side && cells.map((_, i) => <div key={`s${i}`} className="gm-side" style={{ gridColumn: last + 2, gridRow: r0 + i }}>{side(i)}</div>)}
      </div>
    </div>
  );
}

/** A rational matrix; entries that change from `prev` cross-fade with t (0 → 1). */
export function QMatrix({ m, prev, t = 1, nVars, ...rest }: Omit<GridProps, 'cells' | 'nLeft'> & { m: Mat; prev?: Mat; t?: number; nVars: number }) {
  const cells = m.map((row, i) => row.map((v, j) => {
    const now = tex(v), old = prev?.[i]?.[j] !== undefined ? tex(prev[i][j]) : now;
    if (old === now || t >= 1) return <M>{now}</M>;
    return <span className="gm-x"><span style={{ opacity: 1 - t }}><M>{old}</M></span><span style={{ opacity: t }}><M>{now}</M></span></span>;
  }));
  return <MatrixGrid cells={cells} nLeft={nVars} {...rest} />;
}
