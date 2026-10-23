import type { ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useTr } from '../../i18n';
import { MatrixGrid } from './GaussMatrix';
import './gauss.css';

const t = String.raw;
type C = 'p' | 'a' | 'z' | 'zb' | 'bad';
const CELL: Record<C, ReactNode> = {
  p: <span className="st-p"><M>{t`\circledast`}</M></span>,
  a: <span className="st-a"><M>{t`\ast`}</M></span>,
  z: <span className="st-z"><M>0</M></span>,
  zb: <span className="st-zb"><M>0</M></span>,
  bad: <span className="st-bad"><M>{t`\neq 0`}</M></span>,
};
const P = (rows: string[]): C[][] => rows.map((r) => r.split(' ') as C[]);

/** Slide 31 «Possible Results»: three generic echelon forms. ⊛ = pivot (not 0), ∗ = any number. */
export function ResultStaircases() {
  const tr = useTr();
  const cards: { kind: string; rows: C[][]; title: ReactNode; text: ReactNode }[] = [
    { kind: 'unique', rows: P(['p a a a', 'z p a a', 'z z p a']), title: <T de="Eindeutige Lösung" en="Unique solution" />,
      text: <T de="Jede Spalte links hat ein Pivot." en="Every column on the left has a pivot." /> },
    { kind: 'infinite', rows: P(['p a a a', 'z p a a', 'zb zb zb zb']), title: <T de="Unendlich viele Lösungen" en="Infinitely many solutions" />,
      text: <T de={<>Letzte Zeile <M p=":">{t`0 = 0`}</M> stimmt immer. <M>{t`x_3`}</M> hat kein Pivot und ist frei.</>} en={<>Last row <M p=":">{t`0 = 0`}</M> always true. <M>{t`x_3`}</M> has no pivot and is free.</>} /> },
    { kind: 'none', rows: P(['p a a a', 'z p a a', 'zb zb zb bad']), title: <T de="Keine Lösung" en="No solution" />,
      text: <T de={<>Letzte Zeile: <M p=",">{t`0 = (\text{Zahl} \neq 0)`}</M> unmöglich.</>} en={<>Last row: <M p=",">{t`0 = (\text{number} \neq 0)`}</M> impossible.</>} /> },
  ];
  return (
    <figure className="st-row" role="group" aria-label={tr("Drei mögliche Ergebnisse", "Three possible results")}>
      {cards.map((c) => (
        <div key={c.kind} className={`st-card ${c.kind}`}>
          <h4>{c.title}</h4>
          <MatrixGrid cells={c.rows.map((r) => r.map((x) => CELL[x]))} nLeft={3} label={tr('Allgemeine Stufenform', 'Generic echelon form')} />
          <div className="ge-rule">{c.text}</div>
        </div>
      ))}
    </figure>
  );
}

/** Slide 7 «Rang»: the generic m × n echelon form with r pivot rows and m − r zero rows. */
export function GenericRank() {
  const tr = useTr();
  const pv = <span className="st-p"><M>{t`\circledast`}</M></span>, a = <M>{t`\ast`}</M>, z = <span className="st-z"><M>0</M></span>;
  const dots = <M>{t`\cdots`}</M>, vd = <M>{t`\vdots`}</M>, b = (i: string) => <M>{`b_{${i}}`}</M>;
  const zb = <span className="st-zb"><M>0</M></span>;
  const cells: ReactNode[][] = [
    [pv, a, a, dots, a, b('1')],
    [z, pv, a, dots, a, b('2')],
    [vd, '', '', '', vd, vd],
    [z, z, dots, pv, a, b('r')],
    [zb, zb, dots, zb, zb, b('r+1')],
    [vd, '', '', '', vd, vd],
    [zb, zb, dots, zb, zb, b('m')],
  ];
  const side = (i: number): ReactNode => i === 1 ? <span className="st-brace"><T de={<>Zeilen <M>1</M> bis <M p=":">r</M> Pivots</>} en={<>rows <M>1</M> to <M p=":">r</M> pivots</>} /></span>
    : i === 3 ? <span className="st-brace"><M>{t`\leftarrow r = \text{${tr('Rang', 'rank')}}`}</M></span>
      : i === 5 ? <span className="st-brace"><T de="Nullzeilen" en="zero rows" /></span>
        : i === 6 ? <span className="st-brace"><M>{t`\leftarrow m`}</M></span> : null;
  return (
    <figure className="st-gen">
      <MatrixGrid cells={cells} nLeft={5} side={side}
        heads={[<M key="1">x_1</M>, <M key="2">x_2</M>, <M key="3">{t`\cdots`}</M>, '', <M key="n">x_n</M>, '']}
        label={tr('Allgemeine Zeilen-Stufen-Form mit Rang r', 'Generic row-echelon form with rank r')} />
      <figcaption className="ge-rule">
        <T de={<><M>m</M> <M>=</M> Anzahl Gleichungen (Zeilen), <M>n</M> <M>=</M> Anzahl Unbekannte (Spalten links), <M>r</M> <M>=</M> Rang <M>=</M> Anzahl Pivots <M p=".">{t`\circledast`}</M></>}
          en={<><M>m</M> <M>=</M> number of equations (rows), <M>n</M> <M>=</M> number of unknowns (columns on the left), <M>r</M> <M>=</M> rank <M>=</M> number of pivots <M p=".">{t`\circledast`}</M></>} />
      </figcaption>
    </figure>
  );
}
