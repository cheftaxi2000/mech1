import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, useLang, useTr } from '../../i18n';
import { addMat, commonFactor, sameShape, scaleMat, shapeOf, type Mat } from '../../linalg/matops';
import type { M2, V2 } from '../../linalg/plane2';
import { GridWarp, PArrow, PLabel, Path, Plot, Pt, Seg } from '../plot/Plot';
import { scalarScene, sumScene } from './CalcScene';
import { CalcSlider, Ink, MatGrid, MatInput, Stepper, texMat, texNum, texVec } from './CalcMatrix';

const t = String.raw;
const toM2 = (A: Mat) => A as unknown as M2;
const snap = (x: number) => Math.round(x * 2) / 2;

/* ================================================================ slide 22: notation A^{m×n}, A_{ij} */
export function IndexExplorer() {
  const tr = useTr();
  const [m, setM] = useState(5), [n, setN] = useState(4);
  const [sel, setSel] = useState<[number, number]>([2, 3]);
  const si = Math.min(sel[0], m - 1), sj = Math.min(sel[1], n - 1);
  return (
    <figure className="la-fig">
      <div className="la-row">
        <Stepper label={<span><M>m</M> <span className="pl-ink-c2">{tr('Zeilen', 'rows')}</span></span>} value={m} min={1} max={6} onChange={setM} aria="m" />
        <Stepper label={<span><M>n</M> <span className="pl-ink-tgt">{tr('Spalten', 'columns')}</span></span>} value={n} min={1} max={6} onChange={setN} aria="n" />
      </div>
      <div className="la-row">
        <MatGrid rows={m} cols={n} label={tr('Matrix mit antippbaren Einträgen', 'Matrix with tappable entries')}
          rowLabels={(i) => <span className={i === si ? 'pl-ink-c2' : ''}><M>{String(i + 1)}</M></span>}
          colLabels={(j) => <span className={j === sj ? 'pl-ink-tgt' : ''}><M>{String(j + 1)}</M></span>}
          cell={(i, j) => <M>{`A_{${i + 1}${j + 1}}`}</M>}
          info={(i, j) => ({ cls: i === si && j === sj ? 'hit' : i === si ? 'r' : j === sj ? 'k' : '', onClick: () => setSel([i, j]),
            title: tr(`Zeile ${i + 1}, Spalte ${j + 1}`, `row ${i + 1}, column ${j + 1}`) })} />
      </div>
      <div className="la-panel">
        <div className="la-eqline">
          <span><M p=":">{t`A^{${m}\times ${n}}`}</M> <T de={<>{m} Zeilen, {n} Spalten, also <M>{t`${m}\cdot ${n} = ${m * n}`}</M> Einträge.</>} en={<>{m} rows, {n} columns, so <M>{t`${m}\cdot ${n} = ${m * n}`}</M> entries.</>} /></span>
        </div>
        <div className="la-eqline">
          <span><M>{t`A_{ij}\ \to\ A_{(${si + 1})(${sj + 1})}`}</M>{' '}
            <T de={<>in <Ink role="c2">Zeile <M p=",">{t`i = ${si + 1}`}</M></Ink> <Ink role="tgt">Spalte <M p=".">{t`j = ${sj + 1}`}</M></Ink></>}
              en={<>in <Ink role="c2">row <M p=",">{t`i = ${si + 1}`}</M></Ink> <Ink role="tgt">column <M p=".">{t`j = ${sj + 1}`}</M></Ink></>} /></span>
        </div>
        <p className="la-note"><T de="Erst die Zeilennummer, dann die Spaltennummer. Tipp auf einen Eintrag." en="First the row number, then the column number. Tap an entry." /></p>
      </div>
    </figure>
  );
}

/* ================================================================ slide 23: index-by-index sum, same shape */
const B0: Mat = [[2, 2, 3, 1], [4, 1, 2, 1], [1, 1, 1, 1]];
export function AddExplorer() {
  const tr = useTr(), lang = useLang();
  const nl = (v: number) => texNum(v, lang);
  const [A, setA] = useState<Mat>([[1, 2, 3], [4, 5, 6]]);
  const [Bf, setBf] = useState<Mat>(B0);
  const [mb, setMb] = useState(2), [nb, setNb] = useState(3);
  const [sel, setSel] = useState<[number, number] | null>([0, 0]);
  const B = Bf.slice(0, mb).map((r) => r.slice(0, nb));
  const ok = sameShape(A, B);
  const C = ok ? addMat(A, B) : null;
  const [ma, na] = shapeOf(A);
  const mark = (i: number, j: number) => (sel && sel[0] === i && sel[1] === j ? 'hit' : '');
  return (
    <figure className="la-fig">
      <div className="la-row">
        <Stepper label={<span><M>{t`B`}</M> {tr('Zeilen', 'rows')}</span>} value={mb} min={1} max={3} onChange={setMb} aria={tr('Zeilen von B', 'rows of B')} />
        <Stepper label={<span><M>{t`B`}</M> {tr('Spalten', 'columns')}</span>} value={nb} min={1} max={4} onChange={setNb} aria={tr('Spalten von B', 'columns of B')} />
      </div>
      <div className="la-eqline">
        <div className="la-block"><span className="la-name"><M>{t`A^{${ma}\times ${na}}`}</M></span>
          <MatInput name="A" value={A} onChange={setA} onCell={(i, j) => setSel([i, j])} info={(i, j) => ({ cls: ok ? mark(i, j) : '' })} /></div>
        <span className="la-op">+</span>
        <div className="la-block"><span className="la-name"><M>{t`B^{${mb}\times ${nb}}`}</M></span>
          <MatInput name="B" value={B} onChange={(X) => setBf(Bf.map((r, i) => r.map((v, j) => (i < mb && j < nb ? X[i][j] : v))))}
            onCell={(i, j) => setSel([i, j])} info={(i, j) => ({ cls: ok ? mark(i, j) : (i >= ma || j >= na ? 'bad' : '') })} /></div>
        <span className="la-op">=</span>
        {C
          ? <div className="la-block"><span className="la-name"><M>{t`C^{${ma}\times ${na}}`}</M></span>
              <MatGrid rows={ma} cols={na} label="C" cell={(i, j) => <M>{texNum(C[i][j], lang)}</M>} info={(i, j) => ({ cls: mark(i, j), onClick: () => setSel([i, j]) })} /></div>
          : <div className="la-block"><span className="la-name">&nbsp;</span><span className="la-verdict no">{tr('nicht definiert', 'not defined')}</span></div>}
      </div>
      <div className={`la-panel ${ok ? 'ok' : 'no'}`}>
        {ok && sel
          ? <div className="la-eqline"><M>{t`C_{${sel[0] + 1}${sel[1] + 1}} = A_{${sel[0] + 1}${sel[1] + 1}} + B_{${sel[0] + 1}${sel[1] + 1}}`}</M>
              <M p=".">{t`= ${nl(A[sel[0]][sel[1]])} + ${nl(B[sel[0]][sel[1]])} = ${nl(C![sel[0]][sel[1]])}`}</M></div>
          : ok ? <p className="la-note">{tr('Tipp auf einen Eintrag.', 'Tap an entry.')}</p>
          : <>
              <span className="la-verdict no"><T de="Das geht nicht: die Formen sind verschieden." en="This does not work: the shapes differ." /></span>
              <p className="la-note"><T de={<>Zu <M>{t`A_{${ma}${na}}`}</M> gäbe es kein Gegenstück in <M p=".">B</M> Die orange Felder in <M>A</M> oder <M>B</M> haben keinen Partner.</>}
                en={<>The entry <M>{t`A_{${ma}${na}}`}</M> would have no counterpart in <M p=".">B</M> The orange cells in <M>A</M> or <M>B</M> have no partner.</>} /></p>
            </>}
      </div>
    </figure>
  );
}

/* ================================================================ slide 24: (A+B)v = Av + Bv */
export function SumOfTransforms() {
  const tr = useTr(), lang = useLang();
  const [A, setA] = useState<Mat>([[1, 1], [0, 2]]);
  const [B, setB] = useState<Mat>([[2, 0], [-1, 0]]);
  const [v, setV] = useState<V2>([1, 1]);
  const s = sumScene(toM2(A), toM2(B), v);
  const r = Math.max(s.r, 5);
  const tk = r > 8 ? 2 : 1;
  return (
    <figure className="vdemo la-sum">
            <div className="vdemo-fig">
        <Plot x={[-r, r]} y={[-r, r]} w={400} h={400} grid={[tk, tk]} tick={[tk, tk]}
          label={tr('Av, Bv und (A+B)v als Pfeile, aneinandergehängt', 'Av, Bv and (A+B)v as arrows placed tip to tail')}
          onDrag={(x, y) => setV([Math.max(-4, Math.min(4, snap(x))), Math.max(-4, Math.min(4, snap(y)))])}>
          <Seg a={[0, 0]} b={s.Bv} role="miss" dashed />
          <Seg a={s.Av} b={s.tipAvBv} role="miss" dashed />
          <Seg a={s.Bv} b={s.tipAvBv} role="c2" dashed />
          <PArrow a={[0, 0]} b={s.v} role="tgt" />
          <PArrow a={[0, 0]} b={s.Av} role="c2" />
          <PArrow a={s.Av} b={s.tipAvBv} role="miss" />
          <PArrow a={[0, 0]} b={s.Cv} role="c1" />
          <Pt x={s.v[0]} y={s.v[1]} role="tgt" r={6} />
          <PLabel x={s.v[0]} y={s.v[1]} dx={10} dy={12} anchor="l" role="tgt" tex="v" />
          <PLabel x={s.Av[0]} y={s.Av[1]} dx={-8} dy={-10} anchor="r" role="c2" tex="Av" />
          <PLabel x={(s.Av[0] + s.tipAvBv[0]) / 2} y={(s.Av[1] + s.tipAvBv[1]) / 2} dx={8} dy={-8} anchor="l" role="miss" tex="Bv" />
          <PLabel x={s.Cv[0]} y={s.Cv[1]} dx={8} dy={8} anchor="l" role="c1" tex="(A+B)v" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <p className="la-note"><T de={<>Zieh den roten Punkt <M>v</M>; oder gib <M>A</M>, <M>B</M>, <M>v</M> unten ein.</>} en={<>Drag the red point <M>v</M>, or type <M>A</M>, <M>B</M>, <M>v</M> below.</>} /></p>
        <div className="la-row">
          <div className="la-block"><span className="la-name"><M>A</M></span><MatInput name="A" value={A} onChange={setA} /></div>
          <div className="la-block"><span className="la-name"><M>B</M></span><MatInput name="B" value={B} onChange={setB} /></div>
          <div className="la-block"><span className="la-name"><M>v</M></span><MatInput name="v" value={[[v[0]], [v[1]]]} onChange={(X) => setV([X[0][0], X[1][0]])} /></div>
        </div>
        <Ink role="c2"><M>{t`${texMat(A, lang)}${texVec(v, lang)} = ${texVec(s.Av, lang)}`}</M></Ink>
        <Ink role="miss"><M>{t`${texMat(B, lang)}${texVec(v, lang)} = ${texVec(s.Bv, lang)}`}</M></Ink>
        <Ink role="c1"><M>{t`${texMat(s.S, lang)}${texVec(v, lang)} = ${texVec(s.Cv, lang)}`}</M></Ink>
        <M>{t`${texVec(s.Cv, lang)} = ${texVec(s.Av, lang)} + ${texVec(s.Bv, lang)}`}</M>
      </figcaption>
    </figure>
  );
}

/* ================================================================ slide 25: λA stretches space by λ */
const A_SC: Mat = [[1, 1], [0, 2]];
export function ScalarStretch() {
  const tr = useTr(), lang = useLang();
  const [lam, setLam] = useState(2);
  const [v, setV] = useState<V2>([2, -1]);
  const s = scalarScene(toM2(A_SC), lam, v);
  const r = Math.max(s.r, 5);
  return (
    <figure className="vdemo la-scalar">
            <div className="vdemo-fig">
        <Plot x={[-r, r]} y={[-r, r]} w={400} h={400} grid={[r > 8 ? 2 : 1, r > 8 ? 2 : 1]} tick={[r > 8 ? 2 : 1, r > 8 ? 2 : 1]}
          label={tr('Das Gitter von A und von λA: alles wird um den Faktor λ gestreckt', 'The grid of A and of λA: everything is stretched by the factor λ')}
          onDrag={(x, y) => setV([Math.max(-4, Math.min(4, snap(x))), Math.max(-4, Math.min(4, snap(y)))])}>
          <GridWarp M={s.L} n={14} role="c1" opacity={0.28} />
          <Path pts={s.squareA} closed role="ref" dashed />
          <Path pts={s.squareL} closed role="c1" />
          <PArrow a={[0, 0]} b={s.v} role="tgt" />
          <PArrow a={[0, 0]} b={s.Av} role="c2" />
          <PArrow a={[0, 0]} b={s.lAv} role="c1" />
          <Pt x={s.v[0]} y={s.v[1]} role="tgt" r={6} />
          <PLabel x={s.v[0]} y={s.v[1]} dx={-8} dy={-6} anchor="r" role="tgt" tex="v" />
          <PLabel x={s.Av[0]} y={s.Av[1]} dx={-8} dy={-8} anchor="r" role="c2" tex="Av" />
          {Math.hypot(s.lAv[0], s.lAv[1]) > 0.8 && <PLabel x={s.lAv[0]} y={s.lAv[1]} dx={8} dy={8} anchor="l" role="c1" tex={t`\lambda A v`} />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <CalcSlider label={<M>{t`\lambda`}</M>} min={-2} max={3} step={0.5} value={lam} onChange={setLam} aria="λ" show={<M>{texNum(lam, lang)}</M>} />
        <M>{t`\lambda A = ${texNum(lam, lang)}\cdot ${texMat(A_SC, lang)} = ${texMat(s.L, lang)}`}</M>
        <Ink role="c1"><M>{t`(\lambda A)v = ${texVec(s.lAv, lang)} = ${texNum(lam, lang)}\cdot ${texVec(s.Av, lang)} = \lambda\,(Av)`}</M></Ink>
        <p className="vdemo-note"><T
          de={<>Das grüne Gitter ist das Gitter von <M>A</M> (gestrichelt: das Einheitsquadrat) – um <M>{t`\lambda`}</M> gestreckt. Bei <M>{t`\lambda < 0`}</M> dreht es sich um, bei <M>{t`\lambda = 0`}</M> fällt alles auf den Nullpunkt.</>}
          en={<>The green grid is the grid of <M>A</M> (dashed: the unit square) – stretched by <M>{t`\lambda`}</M>. For <M>{t`\lambda < 0`}</M> it turns around, for <M>{t`\lambda = 0`}</M> everything collapses to the origin.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ slide 25: factor out a common λ */
export function FactorOut() {
  const tr = useTr(), lang = useLang();
  const [A, setA] = useState<Mat>([[5, 10, 5], [15, 5, 0]]);
  const g = commonFactor(A);
  const inner = scaleMat(1 / g, A);
  return (
    <figure className="la-fig">
      <div className="la-eqline">
        <MatInput name="A" value={A} onChange={setA} />
        {g > 1
          && <><span className="la-op">=</span><M>{t`${g}\cdot ${texMat(inner, lang, 0)}`}</M></>}
      </div>
      <div className={`la-panel ${g > 1 ? 'ok' : ''}`}>
        <p className="la-note">{g > 1
          ? <T de={<>Alle Einträge sind durch <M>{String(g)}</M> teilbar, also darf man <M>{String(g)}</M> vor die Matrix ziehen.</>} en={<>All entries are divisible by <M>{String(g)}</M>, so <M>{String(g)}</M> may be pulled in front of the matrix.</>} />
          : tr('Kein gemeinsamer ganzzahliger Faktor (ausser 1) – oder alle Einträge sind 0. Tippe andere Zahlen ein, z. B. lauter Vielfache von 3.', 'No common integer factor (other than 1) – or all entries are 0. Type other numbers, e.g. all multiples of 3.')}</p>
      </div>
    </figure>
  );
}
