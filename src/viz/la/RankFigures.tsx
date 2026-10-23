import { useMemo, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import { num } from '../../linalg/frac';
import { solve, type Mat } from '../../linalg/gauss';
import { solutionSetTex } from '../../linalg/gaussTrace';
import { PIVOT_EXAMPLE, RANK_PRESETS, rankInfo, seriesCase, seriesSystem, type SeriesCase } from '../../linalg/rankInfo';
import { QMatrix } from './GaussMatrix';
import { MatrixEditor, fromStrings, toStrings } from './MatrixEditor';
import './gauss.css';

const t = String.raw;

/** Number with at most 2 decimals, trailing zeros dropped, decimal comma in German (TeX). */
export function nf(x: number, lang: Lang): string {
  let s = (Math.abs(x) < 5e-3 ? 0 : x).toFixed(2);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return lang === 'de' ? s.replace('.', '{,}') : s;
}
const par = (s: string) => (s.startsWith('-') ? `(${s})` : s);

const pivotSet = (aug: Mat) => {
  const info = rankInfo(aug);
  const piv: [number, number][] = [];
  info.echelon.forEach((r, i) => { const c = r.slice(0, info.n).findIndex((v) => v[0] !== 0); if (c >= 0) piv.push([i, c]); });
  return { info, piv };
};
const ringCls = (piv: [number, number][]) => (i: number, j: number) => (piv.some(([a, b]) => a === i && b === j) ? 'ring' : '');

/* ================================================================ slide 5: pivots and free variables in R⁴ */
export function PivotFigure() {
  const tr = useTr(), lang = useLang();
  const [alpha, setAlpha] = useState(1);
  const sol = useMemo(() => solve(PIVOT_EXAMPLE), []);
  const { piv } = pivotSet(PIVOT_EXAMPLE);
  const pivCols = sol.pivotCols;
  const x = sol.particular!.map((p, i) => num(p) + alpha * num(sol.dirs![0][i]));
  const A = PIVOT_EXAMPLE.map((r) => r.slice(0, 4).map(num)), b = PIVOT_EXAMPLE.map((r) => num(r[4]));
  const headCls = (j: number) => (j < 4 ? (pivCols.includes(j) ? 'pv' : 'fr') : '');
  const cellCls = (i: number, j: number) => [ringCls(piv)(i, j), j === 2 ? 'fr-col' : ''].join(' ');
  const heads = [...[0, 1, 2, 3].map((j) => <M key={j}>{`x_${j + 1}`}</M>), <M key="b">1</M>];
  return (
    <figure className="explorer">
      <div className="ge-ex">
        <div className="ge-grid">
          <div className="ge-panel">
            <QMatrix m={PIVOT_EXAMPLE} nVars={4} heads={heads} headCls={headCls} cellCls={cellCls}
              label={tr('Stufenform mit Pivots in den Spalten 1, 2 und 4', 'Echelon form with pivots in columns 1, 2 and 4')} />
            <div className="ge-chips">
              {[0, 1, 3].map((j) => <span key={j} className="ge-chip pv"><M>{`x_${j + 1}`}</M> {tr('Pivotvariable', 'pivot variable')}</span>)}
              <span className="ge-chip"><M>{t`x_3 = \alpha`}</M> {tr('frei', 'free')}</span>
            </div>
          </div>
          <div className="ge-panel">
            <label className="ge-slider">
              <span><M>{t`\alpha`}</M></span>
              <input type="range" min={-4} max={4} step={0.5} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} aria-label={tr('Wert des freien Parameters', 'value of the free parameter')} />
              <span className="val"><M>{nf(alpha, lang)}</M></span>
            </label>
            <div className="ge-verdict infinite">
              <M>{t`x = \begin{pmatrix}-9-3\alpha\\ -\frac{2+\alpha}{2}\\ \alpha\\ 5\end{pmatrix} = \begin{pmatrix}${x.map((v) => nf(v, lang)).join('\\\\')}\end{pmatrix}`}</M>
            </div>
            <div className="ge-eqs" aria-live="polite">
              {A.map((row, i) => {
                const terms = row.map((a, j) => (a === 0 ? '' : `${a === 1 ? '' : `${a}\\cdot `}${par(nf(x[j], lang))}`)).filter(Boolean);
                const lhs = row.reduce((s, a, j) => s + a * x[j], 0);
                const ok = Math.abs(lhs - b[i]) < 1e-9;
                return (
                  <div key={i}>
                    <M>{t`\mathrm{${['I', 'II', 'III', 'IV'][i]}}\!:`}</M>
                    <M>{t`${terms.length ? terms.join(' + ') : '0'} = ${nf(lhs, lang)}`}</M>
                    <span className={ok ? 'chk' : 'gm-note'}><M>{ok ? t`\checkmark` : t`\neq ${nf(b[i], lang)}`}</M></span>
                  </div>
                );
              })}
            </div>
            <p className="ge-rule"><T de={<>Jeder Wert von <M>{t`\alpha`}</M> gibt eine Lösung: Alle vier Gleichungen stimmen.</>} en={<>Every value of <M>{t`\alpha`}</M> gives a solution: all four equations hold.</>} /></p>
          </div>
        </div>
      </div>
    </figure>
  );
}

/* ================================================================ slide 8: the table of cases, live */
const RANK_LABEL: Record<string, [string, string]> = {
  none: ['Folie 8: keine', 'Slide 8: none'], unique: ['Folie 8: eindeutig', 'Slide 8: unique'], infinite: ['Folie 8: unendlich', 'Slide 8: infinite'],
  tall: ['3 Gl., 2 Unb.', '3 eq., 2 unkn.'], tallNone: ['3 Gl., 2 Unb., keine', '3 eq., 2 unkn., none'],
  wide: ['2 Gl., 3 Unb.', '2 eq., 3 unkn.'], wideNone: ['2 Gl., 3 Unb., keine', '2 eq., 3 unkn., none'],
};

function Stat({ k, v }: { k: ReactNode; v: ReactNode }) { return <div><span className="k">{k}</span><b>{v}</b></div>; }

export function RankStats({ aug }: { aug: Mat }) {
  const tr = useTr();
  const { info } = pivotSet(aug);
  const kindTag = info.kind === 'none' ? tr('Keine Lösung', 'No solution') : info.kind === 'unique' ? tr('Genau eine Lösung', 'Exactly one solution') : tr('Unendlich viele Lösungen', 'Infinitely many solutions');
  const why = info.kind === 'none'
    ? <T de={<><M p=":">{t`\operatorname{rang}[A\mid b] = ${info.rAug} > r = ${info.r}`}</M> Eine Zeile lautet <M p=".">{t`0 = b_i \neq 0`}</M></>} en={<><M p=":">{t`\operatorname{rank}[A\mid b] = ${info.rAug} > r = ${info.r}`}</M> one row reads <M p=".">{t`0 = b_i \neq 0`}</M></>} />
    : info.kind === 'unique'
      ? <T de={<>Lösbar und <M p=":">{t`r = n = ${info.n}`}</M> Jede Unbekannte hat ein Pivot.</>} en={<>Consistent and <M p=":">{t`r = n = ${info.n}`}</M> every unknown has a pivot.</>} />
      : <T de={<>Lösbar und <M p=":">{t`r = ${info.r} < n = ${info.n}`}</M> <M>{t`n - r = ${info.free}`}</M> freie{info.free > 1 ? '' : 'r'} Parameter.</>} en={<>Consistent and <M p=":">{t`r = ${info.r} < n = ${info.n}`}</M> <M>{t`n - r = ${info.free}`}</M> free parameter{info.free > 1 ? 's' : ''}.</>} />;
  return (
    <div className="ge-panel">
      <div className="ge-stat">
        <Stat k={tr('Gleichungen', 'equations')} v={<M>{t`m = ${info.m}`}</M>} />
        <Stat k={tr('Unbekannte', 'unknowns')} v={<M>{t`n = ${info.n}`}</M>} />
        <Stat k={tr('Rang', 'rank')} v={<M>{t`r = ${info.r}`}</M>} />
        <Stat k={tr('Rang mit b', 'rank with b')} v={<M>{String(info.rAug)}</M>} />
      </div>
      <div className={`ge-verdict ${info.kind}`}><span className="tag">{kindTag}</span> {why}</div>
      <div className="ge-rule">
        <div><span className={info.solvableForAll ? 'ge-ok' : 'ge-no'}><M>{info.solvableForAll ? t`\checkmark` : t`\times`}</M></span>{' '}
          <T de={<>Für <em>jedes</em> <M>b</M> lösbar (<M p=")">{t`r = m`}</M></>} en={<>Solvable for <em>every</em> <M>b</M> (<M p=")">{t`r = m`}</M></>} /></div>
        <div><span className={info.uniqueForAll ? 'ge-ok' : 'ge-no'}><M>{info.uniqueForAll ? t`\checkmark` : t`\times`}</M></span>{' '}
          <T de={<>Für <em>jedes</em> <M>b</M> eindeutig lösbar (<M p=")">{t`r = m = n`}</M></>} en={<>Uniquely solvable for <em>every</em> <M>b</M> (<M p=")">{t`r = m = n`}</M></>} /></div>
      </div>
    </div>
  );
}

export function RankExplorer() {
  const tr = useTr(), lang = useLang();
  const [preset, setPreset] = useState<string | null>('none');
  const [vals, setVals] = useState<string[][]>(() => toStrings(RANK_PRESETS[0].aug));
  const aug = useMemo(() => fromStrings(vals), [vals]);
  const { info, piv } = pivotSet(aug);
  const zero = (i: number) => info.echelon[i].slice(0, info.n).every((v) => v[0] === 0);
  const cellCls = (i: number, j: number) => [ringCls(piv)(i, j), zero(i) ? (info.echelon[i][info.n][0] !== 0 ? 'r-bad' : 'dim') : ''].join(' ');
  const side = (i: number) => (zero(i) ? <span className={info.echelon[i][info.n][0] !== 0 ? 'gm-note' : 'gm-sub'}><M>{info.echelon[i][info.n][0] !== 0 ? t`0 \neq ${nf(num(info.echelon[i][info.n]), lang)}` : t`0 = 0`}</M></span> : null);
  return (
    <figure className="explorer">
      <div className="ge-ex">
        <div className="ge-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
          {RANK_PRESETS.map((p) => <button key={p.id} aria-pressed={preset === p.id} onClick={() => { setPreset(p.id); setVals(toStrings(p.aug)); }}>{tr(...RANK_LABEL[p.id])}</button>)}
        </div>
        <div className="ge-grid">
          <div className="ge-panel">
            <MatrixEditor value={vals} onChange={(v) => { setPreset(null); setVals(v); }} maxM={4} maxN={4} />
            <div className="ge-rule"><T de="Zeilen-Stufen-Form (Kreise: Pivots):" en="Row-echelon form (circles: pivots):" /></div>
            <QMatrix m={info.echelon} nVars={info.n} cellCls={cellCls} side={side} label={tr('Zeilen-Stufen-Form', 'Row-echelon form')} />
          </div>
          <RankStats aug={aug} />
        </div>
      </div>
    </figure>
  );
}

/* ================================================================ slides 9–11: Series 2, problem 2 */
const CASES: { id: SeriesCase; a: number; b: number }[] = [{ id: 'a', a: 0, b: 0 }, { id: 'b', a: 1, b: 0 }, { id: 'c', a: 1, b: 1 }, { id: 'd', a: 0, b: 1 }];

export function SeriesExplorer() {
  const tr = useTr();
  const [a, setA] = useState(0), [b, setB] = useState(0);
  const aug = useMemo(() => seriesSystem(a, b), [a, b]);
  const { info, piv } = pivotSet(aug);
  const sol = solve(aug);
  const c = seriesCase(a, b);
  const caseText: Record<SeriesCase, ReactNode> = {
    a: <T de={<>Fall (a): <M p=",">{t`a = b = 0`}</M> zwei freie Parameter</>} en={<>Case (a): <M p=",">{t`a = b = 0`}</M> two free parameters</>} />,
    b: <T de={<>Fall (b): <M p=",">{t`a \neq 0,\ b = 0`}</M> ein freier Parameter</>} en={<>Case (b): <M p=",">{t`a \neq 0,\ b = 0`}</M> one free parameter</>} />,
    c: <T de={<>Fall (c): <M p=",">{t`a \neq 0,\ b \neq 0`}</M> eindeutig lösbar</>} en={<>Case (c): <M p=",">{t`a \neq 0,\ b \neq 0`}</M> unique solution</>} />,
    d: <T de={<>Fall (d): <M p=",">{t`a = 0,\ b \neq 0`}</M> keine Lösung</>} en={<>Case (d): <M p=",">{t`a = 0,\ b \neq 0`}</M> no solution</>} />,
  };
  const slider = (name: string, v: number, set: (x: number) => void) => (
    <label className="ge-slider">
      <span><M>{name}</M></span>
      <input type="range" min={-3} max={3} step={1} value={v} onChange={(e) => set(Number(e.target.value))} aria-label={name} />
      <span className="val"><M>{String(v)}</M></span>
    </label>
  );
  return (
    <figure className="explorer">
      <div className="ge-ex">
        <div className="ge-presets" role="group" aria-label={tr('Fälle', 'Cases')}>
          {CASES.map((k) => <button key={k.id} aria-pressed={c === k.id} onClick={() => { setA(k.a); setB(k.b); }}>({k.id})</button>)}
        </div>
        <div className="ge-grid">
          <div className="ge-panel">
            {slider('a', a, setA)}
            {slider('b', b, setB)}
            <div className="ge-rule"><T de="Das System mit diesen Zahlen:" en="The system with these numbers:" /></div>
            <QMatrix m={aug} nVars={3} label={tr('Erweiterte Matrix', 'Augmented matrix')} />
            <div className="ge-rule"><T de="Nach dem Gauss-Verfahren:" en="After Gaussian elimination:" /></div>
            <QMatrix m={info.echelon} nVars={3} cellCls={(i, j) => [ringCls(piv)(i, j), info.echelon[i].slice(0, 3).every((v) => v[0] === 0) ? (info.echelon[i][3][0] !== 0 ? 'r-bad' : 'dim') : ''].join(' ')} label={tr('Zeilen-Stufen-Form', 'Row-echelon form')} />
          </div>
          <div className="ge-panel">
            <div className={`ge-verdict ${info.kind}`}><span className="tag">{caseText[c]}</span></div>
            <div className="ge-stat">
              <Stat k={tr('Rang', 'rank')} v={<M>{t`r = ${info.r}`}</M>} />
              <Stat k={tr('Rang mit b', 'rank with b')} v={<M>{String(info.rAug)}</M>} />
              <Stat k={tr('frei', 'free')} v={<M>{info.kind === 'none' ? t`-` : t`n - r = ${info.free}`}</M>} />
            </div>
            <div className="ge-verdict"><M>{solutionSetTex(sol)}</M></div>
            {info.kind === 'unique' && <p className="ge-rule"><T de={<>Allgemein in Fall (c): <M p=".">{t`x = \bigl(\tfrac{15a - 4b}{9a},\ 0,\ \tfrac{b}{3a}\bigr)`}</M> Hier: <M p=".">{t`a = ${a},\ b = ${b}`}</M></>} en={<>In general in case (c): <M p=".">{t`x = \bigl(\tfrac{15a - 4b}{9a},\ 0,\ \tfrac{b}{3a}\bigr)`}</M> Here: <M p=".">{t`a = ${a},\ b = ${b}`}</M></>} /></p>}
            <p className="ge-rule"><T de={<>Nur ob <M>a</M> und <M>b</M> null sind, entscheidet den Fall – nicht ihr genauer Wert.</>} en={<>Only whether <M>a</M> and <M>b</M> are zero decides the case – not their exact value.</>} /></p>
          </div>
        </div>
      </div>
    </figure>
  );
}
