import type { ReactNode } from 'react';
import { M } from '../../components/Tex';
import './la.css';

/**
 * A matrix or column vector as CSS: bracket, one block per column, so columns can be coloured like the slides
 * (a₁ green, a₂ blue, b red). Every entry is a ReactNode (normally `<M>`, so all mathematics is KaTeX).
 * `cols[j][i]` = entry in row i, column j. `caption` = labels under the columns (a₁, a₂).
 */
export function Mat({ cols, cls, caption, className }: { cols: ReactNode[][]; cls?: (string | undefined)[]; caption?: ReactNode[]; className?: string }) {
  return (
    <span className={`la-matwrap${className ? ` ${className}` : ''}`}>
      <span className="la-br">
        {cols.map((c, j) => (
          <span key={j} className={`la-col${cls?.[j] ? ` ${cls[j]}` : ''}`}>
            {c.map((e, i) => <span key={i} className="la-cell">{e}</span>)}
          </span>
        ))}
      </span>
      {caption && (
        <span className="la-cap">
          {caption.map((c, j) => <span key={j} className={cls?.[j]}>{c}</span>)}
        </span>
      )}
    </span>
  );
}

/** `Mat` from TeX strings: `cols[j][i]` = entry (row i, column j); `caption` = TeX labels under the columns. */
export function TexMat({ cols, cls, caption }: { cols: string[][]; cls?: (string | undefined)[]; caption?: string[] }) {
  return <Mat cols={cols.map((c) => c.map((e, i) => <M key={i}>{e}</M>))} cls={cls} caption={caption?.map((c, j) => <M key={j}>{c}</M>)} />;
}
