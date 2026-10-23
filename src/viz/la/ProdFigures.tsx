import { useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import type { Mat } from '../../linalg/matops';
import { apply, mm, sameM, type M2, type V2 } from '../../linalg/plane2';
import { column, columnOfProduct, entryTerms, matMul, shapeVerdict, SLIDE30 } from '../../linalg/product';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { GridWarp, PArrow, PLabel, Path, Plot, Pt } from '../plot/Plot';
import { Ink, MatGrid, MatInput, Stepper, texMat, texNum, texVec } from './CalcMatrix';
import { chain, COMP_PRESETS, compBox, compFrame, SHAPE_F, X_PT } from './ProdScene';

const t = String.raw;
const hidden = String.raw`\begin{pmatrix}?&?\\?&?\end{pmatrix}`;

/* ================================================================ composing transformations (slide 26 + visualisation) */
function CompPlane({ A, B, step, tt }: { A: M2; B: M2; step: number; tt: number }) {
  const tr = useTr(), lang = useLang();
  const f = compFrame(A, B, step, tt);
  const bx = compBox(A, B);
  const r = Math.max(bx.x[1] - bx.x[0], bx.y[1] - bx.y[0]);
  const tk = r > 12 ? 2 : 1;
  const e1: V2 = [f.M[0][0], f.M[1][0]], e2: V2 = [f.M[0][1], f.M[1][1]];
  const x = apply(f.M, X_PT);
  const AB = mm(A, B), BA = mm(B, A);
  const c = chain(A, B);
  const seqBA = f.seq === 'BA';
  const same = sameM(AB, BA, 1e-9);
  const far = (N: M2) => SHAPE_F.map((p) => apply(N, p)).reduce((a, q) => (Math.hypot(q[0], q[1]) > Math.hypot(a[0], a[1]) ? q : a), [0, 0] as V2);
  const tagAB = far(AB);
  return (
    <div className="la-comp">
      <Plot x={bx.x} y={bx.y} w={400} h={bx.h} grid={[tk, tk]} tick={[tk, tk]}
        label={tr('Die Ebene mit einem Buchstaben wird nacheinander von B und A verformt', 'The plane with a letter is deformed by B and then by A')}>
        <g style={{ opacity: f.fade }}><GridWarp M={f.M} n={Math.min(30, 2 * r)} role="c3" opacity={0.3} /></g>
        {f.outlineAB && <Path pts={SHAPE_F.map((p) => apply(AB, p))} closed role="c3" dashed />}
        {f.first && <Path pts={SHAPE_F.map((p) => apply(f.first!, p))} closed role="ref" dashed />}
        <g style={{ opacity: f.fade }}>
          <Path pts={SHAPE_F.map((p) => apply(f.M, p))} fill role="miss" />
          <Path pts={SHAPE_F.map((p) => apply(f.M, p))} closed role="miss" />
        </g>
        {f.ghosts.map((g) => <g key={g.label} style={{ opacity: 0.35 }}><PArrow a={[0, 0]} b={g.v} role={g.role} /></g>)}
        <g style={{ opacity: f.fade }}>
          <PArrow a={[0, 0]} b={e2} role="c2" head={9} />
          <PArrow a={[0, 0]} b={e1} role="c1" head={9} />
          <Pt x={x[0]} y={x[1]} role="tgt" r={5} />
        </g>
        {f.fade > 0.5 && Math.hypot(...e1) > 0.3 && <PLabel x={e1[0]} y={e1[1]} dx={e1[0] >= 0 ? 10 : -10} dy={e1[1] >= 0 ? -8 : 10} anchor={e1[0] >= 0 ? 'l' : 'r'} role="c1" tex={f.names[0]} />}
        {f.fade > 0.5 && Math.hypot(...e2) > 0.3 && <PLabel x={e2[0]} y={e2[1]} dx={e2[0] >= 0 ? 10 : -10} dy={e2[1] >= 0 ? -8 : 10} anchor={e2[0] >= 0 ? 'l' : 'r'} role="c2" tex={f.names[1]} />}
        {f.fade > 0.5 && <PLabel x={x[0]} y={x[1]} dx={8} dy={10} anchor="l" small role="tgt" tex="x" />}
        {f.outlineAB && <PLabel x={tagAB[0]} y={tagAB[1]} dx={tagAB[0] >= 0 ? 8 : -8} dy={tagAB[1] >= 0 ? -10 : 10} anchor={tagAB[0] >= 0 ? 'l' : 'r'} small role="c3" tex="AB" />}
      </Plot>
      <div className="la-panel">
        {!seqBA
          ? <div className="la-eqline"><M>{t`\underset{2.}{A}\;\underset{1.}{B} = ${texMat(A, lang)}${texMat(B, lang)}`}</M><M>{t`= ${f.productShown ? texMat(AB, lang) : hidden} = C`}</M></div>
          : <div className="la-eqline"><M>{t`\underset{2.}{B}\;\underset{1.}{A} = ${texMat(B, lang)}${texMat(A, lang)}`}</M><M>{t`= ${f.productShown ? texMat(BA, lang) : hidden}`}</M></div>}
        {!seqBA
          ? <M>{t`A(Bx) = A${texVec(c.Bx, lang)} = ${texVec(c.ABx, lang)}${f.productShown ? t` = (AB)x` : ''}`}</M>
          : <M>{t`B(Ax) = B${texVec(c.Ax, lang)} = ${texVec(c.BAx, lang)}${f.productShown ? t` = (BA)x` : ''}`}</M>}
        {seqBA && f.productShown && <span className={`la-verdict ${same ? 'ok' : 'no'}`}><M>{same ? 'BA = AB' : t`BA \neq AB`}</M></span>}
        <p className="la-note"><T de={<>Roter Punkt: <M p=".">{t`x = ${texTupleL(X_PT, lang)}`}</M></>} en={<>Red point: <M p=".">{t`x = ${texTupleL(X_PT, lang)}`}</M></>} /></p>
      </div>
    </div>
  );
}
const texTupleL = (v: number[], lang: Lang) => `(${v.map((x) => texNum(x, lang)).join(lang === 'de' ? ';\\ ' : ',\\ ')})^T`;

export function CompositionExplorer() {
  const tr = useTr(), lang = useLang();
  const [pi, setPi] = useState(6);
  const [A, setA] = useState<Mat>(COMP_PRESETS[6].A.map((r) => [...r]));
  const [B, setB] = useState<Mat>(COMP_PRESETS[6].B.map((r) => [...r]));
  const load = (k: number) => { setPi(k); setA(COMP_PRESETS[k].A.map((r) => [...r])); setB(COMP_PRESETS[k].B.map((r) => [...r])); };
  const steps: AnimStep[] = [
    { ms: 400, holdMs: 1800, caption: <T de={<>Start: das Gitter, die Grundvektoren <Ink role="c1"><M>{t`e_1`}</M></Ink> und <Ink role="c2"><M>{t`e_2`}</M></Ink> und ein orangefarbenes <M>{t`\mathsf{F}`}</M> als «Bild», das wir verformen. Der rote Punkt ist <M p=".">x</M></>} en={<>Start: the grid, the basis vectors <Ink role="c1"><M>{t`e_1`}</M></Ink> and <Ink role="c2"><M>{t`e_2`}</M></Ink> and an orange <M>{t`\mathsf{F}`}</M> as the “picture” we deform. The red point is <M p=".">x</M></>} /> },
    { ms: 2300, holdMs: 1800, caption: <T de={<>Zuerst wirkt <M p=".">B</M> <M>{t`e_1`}</M> und <M>{t`e_2`}</M> landen auf den Spalten von <M>B</M> (blasse Pfeile <M>{t`b_1, b_2`}</M>). Das <M>{t`\mathsf{F}`}</M> wird mitverformt.</>} en={<>First <M>B</M> acts. <M>{t`e_1`}</M> and <M>{t`e_2`}</M> land on the columns of <M>B</M> (pale arrows <M p=")">{t`b_1, b_2`}</M> The <M>{t`\mathsf{F}`}</M> is deformed along with them.</>} /> },
    { ms: 2300, holdMs: 2000, caption: <T de={<>Dann wirkt <M>A</M> auf das schon verformte Bild (grau gestrichelt: das <M>{t`\mathsf{F}`}</M> nach <M p=").">B</M> Die Pfeile enden auf den Spalten <M>{t`c_1, c_2`}</M> von <M p=".">{t`C = AB`}</M></>} en={<>Then <M>A</M> acts on the already deformed picture (grey dashed: the <M>{t`\mathsf{F}`}</M> after <M p=").">B</M> The arrows end on the columns <M>{t`c_1, c_2`}</M> of <M p=".">{t`C = AB`}</M></>} /> },
    { ms: 2300, holdMs: 2000, caption: <T de={<>Jetzt <M>{t`C = AB`}</M> in einem einzigen Zug. Die Ebene landet genau dort, wo «erst <M p=",">B</M> dann <M>A</M>» geendet hat (violett gestrichelt): <M p=".">{t`(AB)x = A(Bx)`}</M></>} en={<>Now <M>{t`C = AB`}</M> in a single move. The plane lands exactly where “first <M p=",">B</M> then <M>A</M>” ended (purple dashed): <M p=".">{t`(AB)x = A(Bx)`}</M></>} /> },
    { ms: 2300, holdMs: 1800, caption: <T de={<>Andere Reihenfolge: Diesmal wirkt zuerst <M p=".">A</M> Die Pfeile landen auf den Spalten <M>{t`a_1, a_2`}</M> von <M p=".">A</M></>} en={<>The other order: this time <M>A</M> acts first. The arrows land on the columns <M>{t`a_1, a_2`}</M> of <M p=".">A</M></>} /> },
    { ms: 2300, holdMs: 2000, caption: <T de={<>Dann <M p=".">B</M> Das Ergebnis ist <M p=".">BA</M> Meistens liegt es woanders als <M>AB</M> (violett gestrichelt): Die Reihenfolge zählt, <M p=".">{t`BA \neq AB`}</M></>} en={<>Then <M p=".">B</M> The result is <M p=".">BA</M> Mostly it ends up somewhere else than <M>AB</M> (purple dashed): the order matters, <M p=".">{t`BA \neq AB`}</M></>} /> },
  ];
  return (
    <div className="la-fig">
      <div className="la-chips" role="group" aria-label={tr('Beispiele', 'presets')}>
        {COMP_PRESETS.map((p, k) => <button key={k} type="button" aria-pressed={pi === k} onClick={() => load(k)}>{lang === 'de' ? p.de : p.en}</button>)}
      </div>
      <div className="la-row">
        <div className="la-block"><span className="la-name"><T de={<><M>A</M> (wirkt als zweite)</>} en={<><M>A</M> (acts second)</>} /></span>
          <MatInput name="A" value={A} onChange={(X) => { setA(X); setPi(-1); }} /></div>
        <div className="la-block"><span className="la-name"><T de={<><M>B</M> (wirkt als erste)</>} en={<><M>B</M> (acts first)</>} /></span>
          <MatInput name="B" value={B} onChange={(X) => { setB(X); setPi(-1); }} /></div>
      </div>
      <StepPlayer key={pi} steps={steps} label={tr('Zwei Transformationen nacheinander: erst B, dann A', 'Two transformations in a row: first B, then A')}>
        {(step, tt) => <CompPlane A={A as unknown as M2} B={B as unknown as M2} step={step} tt={tt} />}
      </StepPlayer>
    </div>
  );
}

/* ================================================================ shape requirement (slide 28) */
function Rect({ rows, cols, name, cls, rowCls, colCls }: { rows: number; cols: number; name: ReactNode; cls: string; rowCls?: string; colCls?: string }) {
  const u = 22;
  return (
    <div className={`la-rect ${cls}`} style={{ width: Math.max(56, cols * u), height: Math.max(40, rows * u) }}>
      <span className={`dim-c ${colCls ?? ''}`}><M>{String(cols)}</M></span>
      <span className={`dim-r ${rowCls ?? ''}`}><M>{String(rows)}</M></span>
      {name}
    </div>
  );
}
export function ShapeChecker() {

  const [m, setM] = useState(3), [n, setN] = useState(3), [n2, setN2] = useState(3), [p, setP] = useState(1);
  const v = shapeVerdict(m, n, n2, p);
  const inner = v.ok ? 'pl-ink-c1' : 'pl-ink-tgt';
  const set = (a: number, b: number, c: number, d: number) => { setM(a); setN(b); setN2(c); setP(d); };
  return (
    <figure className="la-fig">
      <div className="la-chips">
        <button type="button" onClick={() => set(3, 3, 3, 1)}><T de={<>Matrix mal Vektor (<M p=")">{t`p = 1`}</M></>} en={<>matrix times vector (<M p=")">{t`p = 1`}</M></>} /></button>
        <button type="button" onClick={() => set(4, 1, 1, 2)}><T de={<>Folie 30: <M>{t`4\times 1`}</M> mal <M>{t`1\times 2`}</M></>} en={<>slide 30: <M>{t`4\times 1`}</M> times <M>{t`1\times 2`}</M></>} /></button>
        <button type="button" onClick={() => set(2, 3, 2, 3)}><T de={<><M>{t`2\times 3`}</M> mal <M>{t`2\times 3`}</M></>} en={<><M>{t`2\times 3`}</M> times <M>{t`2\times 3`}</M></>} /></button>
      </div>
      <div className="la-row">
        <span className="la-step-group"><M p=":">A</M> <Stepper label={<M>m</M>} value={m} min={1} max={5} onChange={setM} aria="m" /> <Stepper label={<M>n</M>} value={n} min={1} max={5} onChange={setN} aria="n" /></span>
        <span className="la-step-group"><M p=":">B</M> <Stepper label={<M>{t`n'`}</M>} value={n2} min={1} max={5} onChange={setN2} aria="n'" /> <Stepper label={<M>p</M>} value={p} min={1} max={5} onChange={setP} aria="p" /></span>
      </div>
      <div className="la-shape">
        <Rect rows={m} cols={n} name={<M>A</M>} cls="" colCls={inner} />
        <span className="la-op">·</span>
        <Rect rows={n2} cols={p} name={<M>B</M>} cls="b" rowCls={inner} />
        <span className="la-op">=</span>
        {v.result ? <Rect rows={m} cols={p} name={<M>C</M>} cls="c" /> : <div className="la-rect bad"><span className="pl-ink-tgt">?</span></div>}
      </div>
      <div className={`la-panel ${v.ok ? 'ok' : 'no'}`}>
        <span><M p=":">{t`A^{${m}\times ${n}}\cdot B^{${n2}\times ${p}}`}</M> <span className={inner}>{v.ok
          ? <T de={<>innen <M p={'\u00a0✓'}>{t`${n} = ${n2}`}</M></>} en={<>inside <M p={'\u00a0✓'}>{t`${n} = ${n2}`}</M></>} />
          : <T de={<>innen <M>{t`${n} \neq ${n2}`}</M></>} en={<>inside <M>{t`${n} \neq ${n2}`}</M></>} />}</span></span>
        <span className={`la-verdict ${v.ok ? 'ok' : 'no'}`}>{v.ok
          ? <T de={<>Das Produkt existiert: <M p=".">{t`C^{${m}\times ${p}}`}</M>{p === 1 ? ' Das Ergebnis ist ein Vektor.' : ''}</>} en={<>The product exists: <M p=".">{t`C^{${m}\times ${p}}`}</M>{p === 1 ? ' The result is a vector.' : ''}</>} />
          : <T de={<>Kein Produkt: Jede Zeile von <M>A</M> hat eine andere Länge als jede Spalte von <M p=".">B</M></>} en={<>No product: every row of <M>A</M> has a different length than every column of <M p=".">B</M></>} />}</span>
        <p className="la-note"><T de={<>Die Aussenzahlen <M>m</M> und <M>p</M> geben die Form des Ergebnisses.</>} en={<>The outer numbers <M>m</M> and <M>p</M> give the shape of the result.</>} /></p>
      </div>
    </figure>
  );
}

/* ================================================================ finger computer (slides 27, 29) */
const FINGER: { de: ReactNode; en: ReactNode; A: Mat; B: Mat }[] = [
  { de: 'Folien 27 und 29', en: 'slides 27 and 29', A: [[0, 2], [1, 0]], B: [[1, -2], [1, 0]] },
  { de: 'Folie 30, Aufgabe 1', en: 'slide 30, exercise 1', A: SLIDE30[0].A, B: SLIDE30[0].B },
  { de: 'Folie 30, Aufgabe 2', en: 'slide 30, exercise 2', A: SLIDE30[1].A, B: SLIDE30[1].B },
  { de: 'Folie 30, Aufgabe 3', en: 'slide 30, exercise 3', A: SLIDE30[2].A, B: SLIDE30[2].B },
];
const KROLE = ['c1', 'c2', 'c3'] as const;
export function FingerComputer() {
  const tr = useTr(), lang = useLang();
  const [k, setK] = useState(0);
  const [mode, setMode] = useState<'entry' | 'col'>('entry');
  const [sel, setSel] = useState<[number, number]>([0, 0]);
  const { A, B } = FINGER[k];
  const C = matMul(A, B);
  const i = Math.min(sel[0], C.length - 1), j = Math.min(sel[1], C[0].length - 1);
  const n = (x: number) => texNum(x, lang);
  const terms = entryTerms(A, B, i, j);
  const nc = A[0].length;
  const xj = column(B, j);
  return (
    <figure className="la-fig">
      <div className="la-chips">{FINGER.map((f, q) => <button key={q} type="button" aria-pressed={k === q} onClick={() => { setK(q); setSel([0, 0]); }}>{lang === 'de' ? f.de : f.en}</button>)}</div>
      <div className="la-chips">
        <button type="button" aria-pressed={mode === 'entry'} onClick={() => setMode('entry')}><T de="ein Eintrag (Zeile mal Spalte)" en="one entry (row times column)" /></button>
        <button type="button" aria-pressed={mode === 'col'} onClick={() => setMode('col')}><T de="eine Spalte (A mal Spalte)" en="one column (A times column)" /></button>
      </div>
      <div className="la-eqline">
        <div className="la-block"><span className="la-name"><M>A</M></span>
          <MatGrid rows={A.length} cols={nc} label="A" cell={(a, b) => <M>{n(A[a][b])}</M>}
            info={(a, b) => ({ cls: mode === 'entry' ? (a === i ? 'r' : 'dim') : KROLE[b % 3] })} /></div>
        <span className="la-op">·</span>
        <div className="la-block"><span className="la-name"><M>B</M></span>
          <MatGrid rows={B.length} cols={B[0].length} label="B" cell={(a, b) => <M>{n(B[a][b])}</M>}
            info={(_a, b) => ({ cls: b === j ? (mode === 'entry' ? 'k' : 'hit') : 'dim' })} /></div>
        <span className="la-op">=</span>
        <div className="la-block"><span className="la-name"><M>C</M></span>
          <MatGrid rows={C.length} cols={C[0].length} label="C" cell={(a, b) => <M>{n(C[a][b])}</M>}
            info={(a, b) => ({ cls: mode === 'entry' ? (a === i && b === j ? 'hit' : '') : b === j ? 'c3' : '', onClick: () => setSel([a, b]),
              title: tr(`Zeile ${a + 1}, Spalte ${b + 1}`, `row ${a + 1}, column ${b + 1}`) })} /></div>
      </div>
      <div className="la-panel">
        {mode === 'entry' ? <>
          <p className="la-note"><T de={<><Ink role="c2">Zeile <M>{String(i + 1)}</M> von <M>A</M></Ink> trifft <Ink role="tgt">Spalte <M>{String(j + 1)}</M> von <M p=":">B</M></Ink> Paarweise multiplizieren, dann addieren.</>}
            en={<><Ink role="c2">Row <M>{String(i + 1)}</M> of <M>A</M></Ink> meets <Ink role="tgt">column <M>{String(j + 1)}</M> of <M p=":">B</M></Ink> multiply pairwise, then add.</>} /></p>
          <M>{t`C_{${i + 1}${j + 1}} = ${terms.map((q) => `A_{${i + 1}${q.k + 1}}B_{${q.k + 1}${j + 1}}`).join(' + ')}`}</M>
          <M>{t`= ${terms.map((q) => `${n(q.a)}\\cdot ${q.b < 0 ? `(${n(q.b)})` : n(q.b)}`).join(' + ')} = ${n(C[i][j])}`}</M>
        </> : <>
          <p className="la-note"><T de={<>Spalte <M>{String(j + 1)}</M> von <M>C</M> ist <M>A</M> angewendet auf <Ink role="miss">Spalte <M>{String(j + 1)}</M> von <M p=":">B</M></Ink> die Spalten von <M>A</M> mit diesen Zahlen gewichtet.</>}
            en={<>Column <M>{String(j + 1)}</M> of <M>C</M> is <M>A</M> applied to <Ink role="miss">column <M>{String(j + 1)}</M> of <M p=":">B</M></Ink> the columns of <M>A</M> weighted by these numbers.</>} /></p>
          <M>{t`A${texVec(xj, lang)} = ${xj.map((w, q) => `${w < 0 ? `(${n(w)})` : n(w)}\\cdot ${texVec(column(A, q), lang)}`).join(' + ')} = ${texVec(columnOfProduct(A, B, j), lang)}`}</M>
        </>}
        <p className="la-note"><T de={<>Tipp auf ein Feld von <M p=".">C</M></>} en={<>Tap a cell of <M p=".">C</M></>} /></p>
      </div>
    </figure>
  );
}
