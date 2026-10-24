import { M } from '../../components/Tex';
import { ELEMENTS, type Element } from '../../chem/elements';
import './periodic.css';

export interface CellStyle {
  /** CSS colour of the cell background */
  bg?: string;
  /** 0–1, faded cells show what is not "reached yet" */
  opacity?: number;
  /** ring around the picked element */
  ring?: boolean;
  /** tiny second line (a value), plain digits */
  sub?: string;
  /** text colour override */
  ink?: string;
}

/**
 * The periodic table up to xenon (Z ≤ 54, rows 1–5, groups 1–18) as a grid of buttons; the symbols are KaTeX.
 * `style(el)` colours each cell, `onPick` makes the cells clickable. The lanthanides are not drawn.
 */
export function PeriodicGrid({ style, onPick, picked, label, className }: { style: (el: Element) => CellStyle; onPick?: (Z: number) => void; picked?: number; label: string; className?: string }) {
  const els = ELEMENTS.filter((e) => e.Z <= 54);
  return (
    <div className={`pg${className ? ` ${className}` : ''}`} role="group" aria-label={label}>
      {els.map((e) => {
        const s = style(e);
        const inner = (
          <>
            <span className="pg-sym"><M>{String.raw`\mathrm{${e.symbol}}`}</M></span>
            {s.sub && <span className="pg-sub">{s.sub}</span>}
          </>
        );
        const css = { gridColumn: e.group, gridRow: e.period, background: s.bg, opacity: s.opacity, color: s.ink } as const;
        const cls = `pg-cell${s.ring || picked === e.Z ? ' ring' : ''}`;
        return onPick
          ? <button key={e.Z} type="button" className={cls} style={css} onClick={() => onPick(e.Z)} aria-label={`${e.symbol} (${e.Z})`} aria-pressed={picked === e.Z}>{inner}</button>
          : <div key={e.Z} className={cls} style={css}>{inner}</div>;
      })}
    </div>
  );
}
