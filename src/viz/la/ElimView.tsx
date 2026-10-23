import type { ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useTr } from '../../i18n';
import { tex } from '../../linalg/frac';
import { ROMAN, solutionSetTex, type Frame, type Trace } from '../../linalg/gaussTrace';
import { QMatrix } from './GaussMatrix';

const t = String.raw;
const R = (i: number) => t`\mathrm{${ROMAN[i]}}`;
const key = (p: [number, number]) => `${p[0]},${p[1]}`;

/** One frame of an elimination: matrix with rings, tints, red multiples / notes and back substitution next to the rows. */
export function ElimView({ frame, prev, t: tt = 1, nVars, heads = true, headCls }: { frame: Frame; prev?: Frame; t?: number; nVars: number; heads?: boolean; headCls?: (j: number) => string }) {
  const tr = useTr();
  const f = frame;
  const done = new Set(f.done.map(key));
  const now = f.pivot ? key(f.pivot) : '';
  const tgt = new Set([...f.mult.map((m) => m.row), ...(f.kind === 'ops' || f.kind === 'clear' || f.kind === 'scale' || f.kind === 'swap' ? f.notes.map((n) => n.row) : [])]);
  const srcRow = f.pivot && (f.kind === 'pivot' || f.kind === 'ops' || f.kind === 'clear') ? f.pivot[0] : -1;
  const cellCls = (i: number, j: number) => {
    const c: string[] = [];
    const k = `${i},${j}`;
    if (k === now && f.kind !== 'verdict') c.push('ring ring-now');
    else if (done.has(k) || (f.kind === 'verdict' && f.done.some((d) => key(d) === k))) c.push('ring');
    if (f.bad === i) c.push('r-bad');
    else if (f.focusCol === j && f.pivot && i !== f.pivot[0] && tgt.has(i)) c.push('focus');
    else if (i === srcRow) c.push('r-src');
    else if (tgt.has(i)) c.push('r-tgt');
    if (f.kind === 'back' && f.pivot && i !== f.pivot[0]) c.push('dim');
    return c.join(' ');
  };
  const backBy = new Map(f.back.map((b) => [b.row, b]));
  const side = (i: number): ReactNode => {
    const mult = f.mult.find((m) => m.row === i);
    if (mult) return <><span className="gm-arrow" aria-hidden="true" /><span className="gm-mult"><M>{tex(mult.factor)}</M></span></>;
    const notes = f.notes.filter((n) => n.row === i);
    if (notes.length) return <span className="gm-note"><M>{notes[0].tex}</M></span>;
    const b = backBy.get(i);
    if (b && (f.kind === 'back' || f.kind === 'verdict')) return <span className="gm-back"><span className="gm-sub"><M>{t`${b.subst ?? b.eq}\;\Rightarrow`}</M>{' '}</span><span className="gm-val"><M>{b.val}</M></span></span>;
    if (f.bad === i) return <span className="gm-note"><M>{t`0 = ${tex(f.m[i][nVars])}\;?!`}</M></span>;
    return null;
  };
  const H = heads ? [...Array.from({ length: nVars }, (_, j) => <M key={j}>{`x_${j + 1}`}</M>), <M key="b">1</M>] : undefined;
  return (
    <div className="ge-view" data-kind={f.kind}>
      <QMatrix m={f.m} prev={prev?.m} t={tt} nVars={nVars} heads={H} headCls={headCls} cellCls={cellCls} side={side}
        label={tr('Erweiterte Matrix des Gleichungssystems', 'Augmented matrix of the system')} />
      <div className="ge-foot">
        {f.free.length > 0 && (f.kind === 'free' || f.kind === 'back' || f.kind === 'verdict') && (
          <div className="ge-chips">{f.free.map((s) => <span key={s} className="ge-chip"><M>{s}</M></span>)}</div>
        )}
        {f.kind === 'verdict' && f.sol && <Verdict frame={f} />}
      </div>
    </div>
  );
}

export function Verdict({ frame }: { frame: Frame }) {
  const s = frame.sol!;
  const tag = s.kind === 'unique' ? <T de="Genau eine Lösung" en="Exactly one solution" />
    : s.kind === 'infinite' ? <T de={<>Unendlich viele Lösungen, <M>{t`n - r = ${s.n - s.rank}`}</M> frei</>} en={<>Infinitely many solutions, <M>{t`n - r = ${s.n - s.rank}`}</M> free</>} />
      : <T de="Keine Lösung" en="No solution" />;
  return <div className={`ge-verdict ${s.kind}`}><span className="tag">{tag}</span> <M>{solutionSetTex(s)}</M></div>;
}

const list = (xs: string[]) => xs.map((x, i) => <span key={i}>{i > 0 && ', '}<M>{x}</M></span>);

/** What a frame says in plain words (both languages). */
export function frameCaption(f: Frame, tr: Trace): ReactNode {
  const n = tr.nVars;
  switch (f.kind) {
    case 'start': return <T
      de={<>Die erweiterte Matrix: Jede Zeile ist eine Gleichung. Links stehen die Zahlen vor <M p=",">{t`x_1, \dots, x_${n}`}</M> rechts vom Strich die rechte Seite.</>}
      en={<>The augmented matrix: every row is one equation. On the left the numbers in front of <M p=",">{t`x_1, \dots, x_${n}`}</M> right of the bar the right-hand side.</>} />;
    case 'pivot': {
      const [r, c] = f.pivot!;
      const p = tex(f.m[r][c]);
      return <T
        de={<>Pivot <M>{p}</M> (Kreis) in Zeile <M p=".">{R(r)}</M> Darunter wollen wir nur Nullen. Rot: das Vielfache von Zeile <M p=",">{R(r)}</M> das wir zu {f.mult.length > 1 ? 'den Zeilen' : 'der Zeile'} {list(f.mult.map((m) => R(m.row)))} dazuzählen.</>}
        en={<>Pivot <M>{p}</M> (circle) in row <M p=".">{R(r)}</M> Below it we want only zeros. Red: the multiple of row <M>{R(r)}</M> that we add to {f.mult.length > 1 ? 'rows' : 'row'} {list(f.mult.map((m) => R(m.row)))}.</>} />;
    }
    case 'ops': return <T
      de={<>Gerechnet: {list(f.notes.map((x) => x.tex))}. Die Operation schreibt man neben die Zeile. Unter dem Pivot steht jetzt <M p=".">0</M></>}
      en={<>Computed: {list(f.notes.map((x) => x.tex))}. The operation is written next to the row. Below the pivot there is now <M p=".">0</M></>} />;
    case 'swap': return <T
      de={<>An der Pivotstelle steht <M p=":">0</M> Wir tauschen die Zeilen (<M p=").">{f.notes[0].tex}</M> Tauschen heisst nur: die Gleichungen anders ordnen.</>}
      en={<>The pivot place holds <M p=":">0</M> we swap the rows (<M p=").">{f.notes[0].tex}</M> Swapping only reorders the equations.</>} />;
    case 'echelon': return <T
      de={<>Zeilen-Stufen-Form: Jede Zeile beginnt weiter rechts als die darüber, wie eine Treppe. Die Pivots (Kreise) sind die Stufen. Anzahl Pivots: <M p=".">{String(f.done.length)}</M></>}
      en={<>Row-echelon form: every row starts further right than the one above, like a staircase. The pivots (circles) are the steps. Number of pivots: <M p=".">{String(f.done.length)}</M></>} />;
    case 'free': return <T
      de={<>Spalten ohne Pivot gehören zu <b>freien Variablen</b>. Sie dürfen jeden Wert haben, darum bekommen sie einen Namen: {list(f.free)}.</>}
      en={<>Columns without a pivot belong to <b>free variables</b>. They may take any value, so they get a name: {list(f.free)}.</>} />;
    case 'back': {
      const b = f.back.at(-1)!;
      return <T
        de={<>Rückwärts einsetzen, von unten nach oben. Zeile <M p=":">{R(b.row)}</M> <M>{b.subst ?? b.eq}</M> ergibt <M p=".">{b.val}</M></>}
        en={<>Back substitution, from the bottom up. Row <M p=":">{R(b.row)}</M> <M>{b.subst ?? b.eq}</M> gives <M p=".">{b.val}</M></>} />;
    }
    case 'scale': return <T
      de={<>Weiter zur vereinfachten Form: <M p=".">{f.notes[0].tex}</M> Die Zeile wird durch ihr Pivot geteilt, damit das Pivot <M>1</M> wird.</>}
      en={<>On to the reduced form: <M p=".">{f.notes[0].tex}</M> The row is divided by its pivot, so the pivot becomes <M p=".">1</M></>} />;
    case 'clear': return <T
      de={<>Jetzt Nullen <em>über</em> dem Pivot: {list(f.notes.map((x) => x.tex))}.</>}
      en={<>Now zeros <em>above</em> the pivot: {list(f.notes.map((x) => x.tex))}.</>} />;
    case 'reduced': return tr.sol.kind === 'unique' && tr.sol.n === tr.m
      ? <T de={<>Vereinfachte Zeilen-Stufen-Form: Links steht die Einheitsmatrix (Diagonale aus Einsen). Rechts kann man die Lösung direkt ablesen.</>}
        en={<>Reduced row-echelon form: the identity matrix is on the left (a diagonal of ones). On the right you read off the solution directly.</>} />
      : <T de={<>Vereinfachte Zeilen-Stufen-Form: Jedes Pivot ist <M p=",">1</M> über und unter ihm stehen Nullen. Jede Zeile nennt eine Pivotvariable.</>}
        en={<>Reduced row-echelon form: every pivot is <M p=",">1</M> with zeros above and below it. Every row names one pivot variable.</>} />;
    case 'verdict': {
      const s = f.sol!;
      if (s.kind === 'none') return <T
        de={<>Zeile <M>{R(f.bad!)}</M> sagt <M p=":">{t`0\cdot x_1 + \dots = ${tex(f.m[f.bad!][n])}`}</M> Das stimmt für keine Zahlen. Also gibt es keine Lösung: <M p=".">{t`L = \varnothing`}</M></>}
        en={<>Row <M>{R(f.bad!)}</M> says <M p=":">{t`0\cdot x_1 + \dots = ${tex(f.m[f.bad!][n])}`}</M> No numbers make this true. So there is no solution: <M p=".">{t`L = \varnothing`}</M></>} />;
      if (s.kind === 'unique') return <T
        de={<>Jede Variable hat ein Pivot. Also gibt es genau eine Lösung.</>}
        en={<>Every variable has a pivot. So there is exactly one solution.</>} />;
      return <T
        de={<><M>{t`n - r = ${n} - ${s.rank} = ${s.n - s.rank}`}</M> Variable{s.n - s.rank > 1 ? 'n sind' : ' ist'} frei. Für jeden Wert der Parameter gibt es eine Lösung: unendlich viele.</>}
        en={<><M>{t`n - r = ${n} - ${s.rank} = ${s.n - s.rank}`}</M> variable{s.n - s.rank > 1 ? 's are' : ' is'} free. Every value of the parameters gives a solution: infinitely many.</>} />;
    }
  }
}
