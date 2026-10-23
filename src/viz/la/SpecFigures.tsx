import { useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, useLang, useTr } from '../../i18n';
import type { Mat } from '../../linalg/matops';
import type { M2, V2 } from '../../linalg/plane2';
import { apply } from '../../linalg/plane2';
import { antisymmetrize, antisymmetryBreaks, isAntisymmetric, isSymmetric, symmetrize, symmetryBreaks, transpose } from '../../linalg/special';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { GridWarp, PArrow, PLabel, Path, Plot, Pt } from '../plot/Plot';
import { CalcSlider, Ink, MatGrid, MatInput, Stepper, texMat, texNum, texVec } from './CalcMatrix';
import { antiFrame, transposeFrame, type MFrame } from './SpecScene';

const t = String.raw;
const snap = (x: number) => Math.round(x * 2) / 2;
const clampV = (x: number) => Math.max(-3, Math.min(3, snap(x)));
const UNIT: V2[] = [[0, 0], [1, 0], [1, 1], [0, 1]];

/* ================================================================ zones of D, 𝕀, L, R (slides 31–32) */
type Kind = 'D' | 'I' | 'L' | 'R';
export function SpecZones() {
  const tr = useTr();
  const [kind, setKind] = useState<Kind>('D');
  const [n, setN] = useState(4);
  const zone = (i: number, j: number): 'diag' | 'zero' | 'free' => (i === j ? 'diag' : (kind === 'L' && j < i) || (kind === 'R' && j > i) ? 'free' : 'zero');
  const content = (i: number, j: number) => {
    const z = zone(i, j);
    if (z === 'zero') return <M>0</M>;
    if (z === 'diag') return <M>{kind === 'I' ? '1' : kind === 'D' ? `d_{${i + 1}}` : t`\ast`}</M>;
    return <M>{t`\ast`}</M>;
  };
  const names: Record<Kind, ReactNode> = {
    D: <T de="Diagonalmatrix" en="diagonal matrix" />,
    I: <T de={<>Einheitsmatrix <M>{t`\mathbb{I}`}</M></>} en={<>identity matrix <M>{t`\mathbb{I}`}</M></>} />,
    L: <T de={<>Links-Dreiecksmatrix <M>L</M></>} en={<>lower triangular <M>L</M></>} />,
    R: <T de={<>Rechts-Dreiecksmatrix <M>R</M></>} en={<>upper triangular <M>R</M></>} />,
  };
  return (
    <figure className="la-fig">
      <div className="la-chips" role="group" aria-label={tr('Art der Matrix', 'kind of matrix')}>
        {(['D', 'I', 'L', 'R'] as Kind[]).map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>{names[k]}</button>)}
      </div>
      <div className="la-row">
        <Stepper label={<M>n</M>} value={n} min={2} max={6} onChange={setN} aria="n" />
      </div>
      <div className="la-row">
        <MatGrid rows={n} cols={n} label={tr('Muster der Matrix', 'pattern of the matrix')} cell={content}
          info={(i, j) => ({ cls: zone(i, j) === 'zero' ? 'zero' : zone(i, j) === 'diag' ? 'diag' : 'c2' })} />
      </div>
      <p className="la-note">{kind === 'D' && <T de={<>Grün: die Diagonale. Alles daneben ist <M p=".">0</M></>} en={<>Green: the diagonal. Everything else is <M p=".">0</M></>} />}
        {kind === 'I' && <T de={<>Lauter <M>1</M> auf der Diagonalen, sonst <M p=".">0</M> Ein Spezialfall der Diagonalmatrix.</>} en={<>All <M>1</M> on the diagonal, <M>0</M> elsewhere. A special case of the diagonal matrix.</>} />}
        {kind === 'L' && <T de={<>Nullen <em>über</em> der Diagonalen; das Dreieck mit Zahlen (blau, <M p=")">{t`\ast`}</M> liegt links unten.</>} en={<>Zeros <em>above</em> the diagonal; the triangle with numbers (blue, <M p=")">{t`\ast`}</M> is at the bottom left.</>} />}
        {kind === 'R' && <T de={<>Nullen <em>unter</em> der Diagonalen; das Dreieck mit Zahlen (blau, <M p=")">{t`\ast`}</M> liegt rechts oben.</>} en={<>Zeros <em>below</em> the diagonal; the triangle with numbers (blue, <M p=")">{t`\ast`}</M> is at the top right.</>} />}
      </p>
    </figure>
  );
}

/* ================================================================ diagonal matrix scales each basis vector; 𝕀 does nothing (slide 31) */
export function SpecDiag() {
  const tr = useTr(), lang = useLang();
  const [d1, setD1] = useState(2), [d2, setD2] = useState(0.5);
  const [v, setV] = useState<V2>([1, 2]);
  const D: M2 = [[d1, 0], [0, d2]];
  const Dv = apply(D, v);
  const isI = d1 === 1 && d2 === 1;
  const presets: [string, number, number][] = [[t`\mathbb{I}`, 1, 1], [t`\operatorname{diag}(2;\ 0{,}5)`, 2, 0.5], [t`\operatorname{diag}(-1;\ 1)`, -1, 1], [t`\operatorname{diag}(1{,}5;\ 1{,}5)`, 1.5, 1.5]];
  const pre = (s: string) => (lang === 'de' ? s : s.replace(/;\\ /g, ',\\ ').replace(/\{,\}/g, '.'));
  return (
    <figure className="vdemo la-diag">
      <div className="vdemo-fig">
        <Plot x={[-4, 4]} y={[-4, 4]} w={400} h={400}
          label={tr('Gitter nach der Diagonalmatrix: jede Achse wird für sich gestreckt', 'Grid after the diagonal matrix: each axis is stretched on its own')}
          onDrag={(x, y) => setV([clampV(x), clampV(y)])}>
          <GridWarp M={D} n={12} role="c3" opacity={0.3} />
          <Path pts={UNIT.map((p) => apply(D, p))} closed role="c3" />
          <PArrow a={[0, 0]} b={[d1, 0]} role="c1" />
          <PArrow a={[0, 0]} b={[0, d2]} role="c2" />
          <PArrow a={[0, 0]} b={v} role="tgt" />
          <PArrow a={[0, 0]} b={Dv} role="ax" />
          <Pt x={v[0]} y={v[1]} role="tgt" r={6} />
          {Math.abs(d1) > 0.3 && <PLabel x={d1} y={0} dy={14} anchor="t" small role="c1" tex="d_1 e_1" />}
          {Math.abs(d2) > 0.3 && <PLabel x={0} y={d2} dx={-8} anchor="r" small role="c2" tex="d_2 e_2" />}
          <PLabel x={v[0]} y={v[1]} dx={10} dy={-10} anchor="l" role="tgt" tex="v" />
          {!isI && <PLabel x={Dv[0]} y={Dv[1]} dx={10} dy={10} anchor="l" role="ax" tex="Dv" />}
          {isI && <PLabel x={v[0]} y={v[1]} dx={10} dy={12} anchor="l" role="ax" small tex={t`\mathbb{I}v = v`} />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="la-chips">{presets.map(([lab, a, b]) => <button key={lab} type="button" aria-pressed={d1 === a && d2 === b} onClick={() => { setD1(a); setD2(b); }}><M>{pre(lab)}</M></button>)}</div>
        <CalcSlider label={<M>{t`d_1`}</M>} min={-2} max={3} step={0.25} value={d1} onChange={setD1} aria="d1" show={<M>{texNum(d1, lang)}</M>} />
        <CalcSlider label={<M>{t`d_2`}</M>} min={-2} max={3} step={0.25} value={d2} onChange={setD2} aria="d2" show={<M>{texNum(d2, lang)}</M>} />
        <M>{t`D\,v = ${texMat(D, lang)}${texVec(v, lang)} = ${texVec(Dv, lang)}`}</M>
        <p className="vdemo-note">{isI
          ? <T de={<>Das ist <M p=":">{t`\mathbb{I}`}</M> Das Gitter bleibt, wie es ist, und der Pfeil <M>{t`\mathbb{I}v`}</M> liegt genau auf <M p=".">v</M></>} en={<>This is <M p=":">{t`\mathbb{I}`}</M> the grid stays as it is, and the arrow <M>{t`\mathbb{I}v`}</M> lies exactly on <M p=".">v</M></>} />
          : <T de={<>Die <Ink role="c1"><M>x</M>-Richtung</Ink> wird um <M>{t`d_1`}</M> gestreckt, die <Ink role="c2"><M>y</M>-Richtung</Ink> um <M p=".">{t`d_2`}</M> Nichts kippt. Zieh <M>v</M> herum. Ein negatives <M>d</M> spiegelt.</>} en={<>The <Ink role="c1"><M>x</M> direction</Ink> is stretched by <M p=",">{t`d_1`}</M> the <Ink role="c2"><M>y</M> direction</Ink> by <M p=".">{t`d_2`}</M> Nothing tilts. Drag <M>v</M> around. A negative <M>d</M> mirrors.</>} />}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ a shear is triangular (slide 32) */
export function SpecShear() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(1);
  const [upper, setUpper] = useState(true);
  const S: M2 = upper ? [[1, s], [0, 1]] : [[1, 0], [s, 1]];
  return (
    <figure className="vdemo la-shear">
      <div className="vdemo-fig">
        <Plot x={[-3.5, 3.5]} y={[-3.5, 3.5]} w={400} h={400}
          label={tr('Eine Scherung: eine Achse bleibt liegen, die andere kippt', 'A shear: one axis stays, the other tilts')}>
          <GridWarp M={S} n={12} role="c3" opacity={0.3} />
          <Path pts={UNIT.map((p) => apply(S, p))} closed role="c3" />
          <PArrow a={[0, 0]} b={[S[0][0], S[1][0]]} role="c1" />
          <PArrow a={[0, 0]} b={[S[0][1], S[1][1]]} role="c2" />
          <PLabel x={S[0][0]} y={S[1][0]} dx={8} dy={upper ? 12 : 0} anchor="l" small role="c1" tex="Se_1" />
          <PLabel x={S[0][1]} y={S[1][1]} dx={8} dy={-10} anchor="l" small role="c2" tex="Se_2" />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="la-chips">
          <button type="button" aria-pressed={upper} onClick={() => setUpper(true)}><T de={<>Rechts-Dreieck <M>R</M></>} en={<>upper <M>R</M></>} /></button>
          <button type="button" aria-pressed={!upper} onClick={() => setUpper(false)}><T de={<>Links-Dreieck <M>L</M></>} en={<>lower <M>L</M></>} /></button>
        </div>
        <CalcSlider label={<M>s</M>} min={-2} max={2} step={0.25} value={s} onChange={setS} aria="s" show={<M>{texNum(s, lang)}</M>} />
        <MatGrid rows={2} cols={2} label="S" cell={(i, j) => <M>{texNum(S[i][j], lang)}</M>}
          info={(i, j) => ({ cls: (upper ? i > j : j > i) ? 'zero' : i === j ? 'diag' : 'c2' })} />
        <p className="vdemo-note">{upper
          ? <T de={<>Unter der Diagonalen steht <M p=":">0</M> eine Rechts-Dreiecksmatrix. Darum bleibt <Ink role="c1"><M>{t`e_1`}</M></Ink> liegen, nur <Ink role="c2"><M>{t`e_2`}</M></Ink> kippt um <M>s</M> zur Seite.</>} en={<>Below the diagonal there is <M p=":">0</M> an upper triangular matrix. So <Ink role="c1"><M>{t`e_1`}</M></Ink> stays put, only <Ink role="c2"><M>{t`e_2`}</M></Ink> tilts sideways by <M p=".">s</M></>} />
          : <T de={<>Über der Diagonalen steht <M p=":">0</M> eine Links-Dreiecksmatrix. Jetzt bleibt <Ink role="c2"><M>{t`e_2`}</M></Ink> liegen und <Ink role="c1"><M>{t`e_1`}</M></Ink> kippt nach oben.</>} en={<>Above the diagonal there is <M p=":">0</M> a lower triangular matrix. Now <Ink role="c2"><M>{t`e_2`}</M></Ink> stays put and <Ink role="c1"><M>{t`e_1`}</M></Ink> tilts upwards.</>} />}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ the mirror grid used by both animations */
const CLS: Record<string, string> = { '': '', diag: 'diag', move: 'hit', moved: 'c2', me: 'me', partner: 'partner' };
function MirrorGrid({ f }: { f: MFrame }) {
  const n = f.n, c = (v: number) => v + 0.5;
  return (
    <div className="la-block">
      <span className="la-name la-big"><M>{f.title}</M></span>
      <div className="la-mirror" style={{ width: 'min(100%, 260px)', aspectRatio: '1' }}>
        <svg viewBox={`0 0 ${n} ${n}`} preserveAspectRatio="none" aria-hidden="true">
          <line className="diagline" x1={0.1} y1={0.1} x2={n - 0.1} y2={n - 0.1} style={{ opacity: f.mirror }} vectorEffect="non-scaling-stroke" />
          {f.arcs.map((a, k) => a.self
            ? <circle key={k} className="arc" cx={c(a.from[0]) + 0.36} cy={c(a.from[1]) - 0.36} r={0.2} vectorEffect="non-scaling-stroke" />
            : <path key={k} className="arc" d={`M ${c(a.from[0])} ${c(a.from[1])} Q ${(c(a.from[0]) + c(a.to[0])) / 2 + 0.45} ${(c(a.from[1]) + c(a.to[1])) / 2 - 0.45} ${c(a.to[0])} ${c(a.to[1])}`} vectorEffect="non-scaling-stroke" />)}
        </svg>
        {f.cells.map((cell) => (
          <span key={cell.key} className={`cell la-c ${CLS[cell.cls]}`} style={{ left: `${(c(cell.x) / n) * 100}%`, top: `${(c(cell.y) / n) * 100}%` }}><M>{cell.tex}</M></span>
        ))}
      </div>
      {f.eq && <div className="la-eqline la-mt"><M>{f.eq}</M></div>}
    </div>
  );
}

/* ================================================================ transposing = mirroring across the diagonal (slide 33), step animation */
export function TransposeAnim() {
  const tr = useTr();
  const steps: AnimStep[] = [
    { ms: 900, holdMs: 1800, caption: <T de={<>Das ist <M p=".">A</M> Die rote gestrichelte Linie ist die Diagonale. Sie ist der Spiegel; die Zahlen auf ihr (grün) bleiben liegen.</>} en={<>This is <M p=".">A</M> The red dashed line is the diagonal. It is the mirror; the numbers on it (green) stay where they are.</>} /> },
    { ms: 1600, holdMs: 2000, caption: <T de={<>Die erste Zeile <M>{t`(1\ 2\ 3)`}</M> klappt in die erste Spalte. Dafür wandert die alte erste Spalte <M>{t`(1\ 4\ 7)`}</M> in die erste Zeile.</>} en={<>The first row <M>{t`(1\ 2\ 3)`}</M> folds into the first column. In exchange the old first column <M>{t`(1\ 4\ 7)`}</M> moves into the first row.</>} /> },
    { ms: 1400, holdMs: 2000, caption: <T de={<>Dasselbe mit der zweiten Zeile: <M>6</M> und <M>8</M> tauschen die Plätze. Jede Zahl springt dabei an die Stelle, die ihr im Spiegel gegenüberliegt.</>} en={<>The same with the second row: <M>6</M> and <M>8</M> swap places. Each number jumps to the spot facing it across the mirror.</>} /> },
    { ms: 700, holdMs: 1800, caption: <T de={<>Fertig: <M p=".">{t`A^T`}</M> Der Eintrag aus Zeile <M>i</M> und Spalte <M>j</M> steht jetzt in Zeile <M>j</M> und Spalte <M p=":">i</M> <M p=".">{t`(A^T)_{ji} = A_{ij}`}</M></>} en={<>Done: <M p=".">{t`A^T`}</M> The entry from row <M>i</M> and column <M>j</M> now sits in row <M>j</M> and column <M p=":">i</M> <M p=".">{t`(A^T)_{ji} = A_{ij}`}</M></>} /> },
  ];
  return (
    <StepPlayer steps={steps} label={tr('Transponieren: Spiegeln an der Diagonalen', 'Transposing: mirroring across the diagonal')}>
      {(step, tt) => <MirrorGrid f={transposeFrame(step, tt)} />}
    </StepPlayer>
  );
}

/* ================================================================ why the diagonal of an antisymmetric matrix is 0 (slide 36), step animation */
export function AntiDiagAnim() {
  const tr = useTr();
  const steps: AnimStep[] = [
    { ms: 700, holdMs: 1800, caption: <T de={<>Bei einer antisymmetrischen Matrix haben Spiegelpartner entgegengesetzte Vorzeichen: <M>{t`S_{12} = 2`}</M> und <M p=".">{t`S_{21} = -2`}</M> Die Bögen verbinden alle Partner.</>} en={<>In an antisymmetric matrix, mirror partners carry opposite signs: <M>{t`S_{12} = 2`}</M> and <M p=".">{t`S_{21} = -2`}</M> The arcs join all partners.</>} /> },
    { ms: 700, holdMs: 1800, caption: <T de={<>Ein Feld auf der Diagonalen ist sein eigener Partner (kleiner Kreis). Nennen wir seinen Wert <M p=".">a</M> Die Regel verlangt <M p=",">{t`S_{22} = -S_{22}`}</M> also <M p=".">{t`a = -a`}</M></>} en={<>A cell on the diagonal is its own partner (small circle). Call its value <M p=".">a</M> The rule demands <M p=",">{t`S_{22} = -S_{22}`}</M> so <M p=".">{t`a = -a`}</M></>} /> },
    { ms: 900, holdMs: 1800, caption: <T de={<>Bring <M>-a</M> nach links: <M p=".">{t`2a = 0`}</M> Die einzige Zahl, die gleich ihrem Negativen ist, ist <M p=".">0</M> Darum stehen auf der Diagonalen nur Nullen.</>} en={<>Bring <M>-a</M> to the left: <M p=".">{t`2a = 0`}</M> The only number equal to its own negative is <M p=".">0</M> So the diagonal holds only zeros.</>} /> },
  ];
  return (
    <StepPlayer steps={steps} label={tr('Warum die Diagonale einer antisymmetrischen Matrix null ist', 'Why the diagonal of an antisymmetric matrix is zero')}>
      {(step, tt) => <MirrorGrid f={antiFrame(step, tt)} />}
    </StepPlayer>
  );
}

/* ================================================================ transpose explorer: pick size and entries */
const T_BACK: Mat = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]];
const T_PRE: { label: string; A: Mat }[] = [
  { label: t`\begin{smallmatrix}1&2\\3&4\\5&6\end{smallmatrix}`, A: [[1, 2], [3, 4], [5, 6]] },
  { label: t`\begin{smallmatrix}1&2&3\\4&5&6\\7&8&9\end{smallmatrix}`, A: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  { label: t`\begin{smallmatrix}-2&0\\5&0\\6&2\end{smallmatrix}`, A: [[-2, 0], [5, 0], [6, 2]] },
  { label: t`\begin{smallmatrix}1&1&1\\0&0&0\\2&2&2\end{smallmatrix}`, A: [[1, 1, 1], [0, 0, 0], [2, 2, 2]] },
];
export function TransposeExplorer() {
  const tr = useTr(), lang = useLang();
  const [m, setM] = useState(3), [n, setN] = useState(2);
  const [back, setBack] = useState<Mat>([[1, 2, 7, 7], [3, 4, 7, 7], [5, 6, 7, 7], [7, 7, 7, 7]]);
  const [sel, setSel] = useState<[number, number]>([0, 1]);
  const A = back.slice(0, m).map((r) => r.slice(0, n));
  const AT = transpose(A);
  const si = Math.min(sel[0], m - 1), sj = Math.min(sel[1], n - 1);
  const load = (P: Mat) => { setM(P.length); setN(P[0].length); setBack(T_BACK.map((r, i) => r.map((v, j) => P[i]?.[j] ?? v))); };
  return (
    <figure className="la-fig">
      <div className="la-chips" role="group" aria-label={tr('Beispiele der Folien', 'examples from the slides')}>
        {T_PRE.map((p) => <button key={p.label} type="button" onClick={() => load(p.A)}><M>{t`\left(${p.label}\right)`}</M></button>)}
      </div>
      <div className="la-row">
        <Stepper label={<M>m</M>} value={m} min={1} max={4} onChange={setM} aria="m" />
        <Stepper label={<M>n</M>} value={n} min={1} max={4} onChange={setN} aria="n" />
      </div>
      <div className="la-eqline">
        <div className="la-block"><span className="la-name"><M>{t`A^{${m}\times ${n}}`}</M></span>
          <MatInput name="A" value={A} onCell={(i, j) => setSel([i, j])}
            onChange={(X) => setBack(back.map((r, i) => r.map((v, j) => (i < m && j < n ? X[i][j] : v))))}
            info={(i, j) => ({ cls: i === si && j === sj ? 'me' : i === si ? 'c2' : '' })} /></div>
        <span className="la-op">→</span>
        <div className="la-block"><span className="la-name"><M>{t`(A^T)^{${n}\times ${m}}`}</M></span>
          <MatGrid rows={n} cols={m} label={t`A^T`} cell={(i, j) => <M>{texNum(AT[i][j], lang)}</M>}
            info={(i, j) => ({ cls: i === sj && j === si ? 'me' : j === si ? 'c2' : '' })} /></div>
      </div>
      <div className="la-panel">
        <T de={<p className="la-note"><Ink role="c2">Zeile <M>{String(si + 1)}</M> von <M>A</M></Ink> wird <Ink role="c2">Spalte <M>{String(si + 1)}</M> von <M p=".">{t`A^T`}</M></Ink> Der rote Eintrag: <M p=".">{t`A_{${si + 1}${sj + 1}} = (A^T)_{${sj + 1}${si + 1}} = ${texNum(A[si][sj], lang)}`}</M></p>}
          en={<p className="la-note"><Ink role="c2">Row <M>{String(si + 1)}</M> of <M>A</M></Ink> becomes <Ink role="c2">column <M>{String(si + 1)}</M> of <M p=".">{t`A^T`}</M></Ink> The red entry: <M p=".">{t`A_{${si + 1}${sj + 1}} = (A^T)_{${sj + 1}${si + 1}} = ${texNum(A[si][sj], lang)}`}</M></p>} />
      </div>
    </figure>
  );
}

/* ================================================================ symmetry explorer (slides 35–36) */
const S35: Mat = [[1, 2, -2, 0], [2, 2, 0, 1], [-2, 0, -3, 0], [0, 1, 0, 1]];
const A36: Mat = [[0, 1, 2, 3], [-1, 0, 0, -1], [-2, 0, 0, -2], [-3, 1, 2, 0]];
export function SymmetryExplorer() {
  const tr = useTr(), lang = useLang();
  const [A, setA] = useState<Mat>(S35);
  const [sel, setSel] = useState<[number, number]>([0, 1]);
  const [i, j] = sel;
  const sym = isSymmetric(A), anti = isAntisymmetric(A);
  const sb = symmetryBreaks(A)[0], ab = antisymmetryBreaks(A)[0];
  const n = (v: number) => texNum(v, lang);
  const presets: [ReactNode, Mat][] = [
    [<T de="Folie 35 (symmetrisch)" en="slide 35 (symmetric)" />, S35],
    [<T de="Folie 36 (antisymmetrisch)" en="slide 36 (antisymmetric)" />, A36],
    [<T de="beliebig" en="arbitrary" />, [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]],
  ];
  return (
    <figure className="la-fig">
      <div className="la-chips">
        {presets.map(([lab, P], k) => <button key={k} type="button" onClick={() => setA(P.map((r) => [...r]))}>{lab}</button>)}
        <button type="button" onClick={() => setA(symmetrize(A))}><T de="oben nach unten spiegeln" en="mirror top to bottom" /></button>
        <button type="button" onClick={() => setA(antisymmetrize(A))}><T de="mit Minus spiegeln" en="mirror with a minus" /></button>
      </div>
      <div className="la-row">
        <MatInput name="A" value={A} onChange={setA} onCell={(a, b) => setSel([a, b])}
          rowLabels={(a) => <M>{String(a + 1)}</M>} colLabels={(b) => <M>{String(b + 1)}</M>}
          info={(a, b) => ({ cls: a === i && b === j ? 'me' : a === j && b === i ? 'partner' : a === b ? 'diag' : '' })} />
      </div>
      <div className="la-panel">
        <p className="la-note">{i === j
          ? <T de={<>Gewählt: <Ink role="tgt"><M p=".">{t`A_{${i + 1}${j + 1}}`}</M></Ink> Es liegt auf der Diagonalen und ist sein eigener Spiegelpartner.</>} en={<>Selected: <Ink role="tgt"><M p=".">{t`A_{${i + 1}${j + 1}}`}</M></Ink> It lies on the diagonal and is its own mirror partner.</>} />
          : <T de={<>Gewählt: <Ink role="tgt"><M p=",">{t`A_{${i + 1}${j + 1}} = ${n(A[i][j])}`}</M></Ink> sein Spiegelpartner: <Ink role="c2"><M p=".">{t`A_{${j + 1}${i + 1}} = ${n(A[j][i])}`}</M></Ink></>} en={<>Selected: <Ink role="tgt"><M p=",">{t`A_{${i + 1}${j + 1}} = ${n(A[i][j])}`}</M></Ink> its mirror partner: <Ink role="c2"><M p=".">{t`A_{${j + 1}${i + 1}} = ${n(A[j][i])}`}</M></Ink></>} />}</p>
        <div className="la-pair">
          <span className={`la-verdict ${sym ? 'ok' : 'no'}`}><T de={<>symmetrisch <M p="?">{t`(A^T = A)`}</M></>} en={<>symmetric <M p="?">{t`(A^T = A)`}</M></>} /></span>
          <span>{sym ? <T de="ja" en="yes" /> : <T de={<>nein: <M>{t`A_{${sb[0] + 1}${sb[1] + 1}} = ${n(A[sb[0]][sb[1]])} \neq ${n(A[sb[1]][sb[0]])} = A_{${sb[1] + 1}${sb[0] + 1}}`}</M></>} en={<>no: <M>{t`A_{${sb[0] + 1}${sb[1] + 1}} = ${n(A[sb[0]][sb[1]])} \neq ${n(A[sb[1]][sb[0]])} = A_{${sb[1] + 1}${sb[0] + 1}}`}</M></>} />}</span>
          <span className={`la-verdict ${anti ? 'ok' : 'no'}`}><T de={<>antisymmetrisch <M p="?">{t`(A = -A^T)`}</M></>} en={<>antisymmetric <M p="?">{t`(A = -A^T)`}</M></>} /></span>
          <span>{anti ? <T de="ja" en="yes" /> : ab[0] === ab[1]
            ? <T de={<>nein: <M>{t`A_{${ab[0] + 1}${ab[0] + 1}} = ${n(A[ab[0]][ab[0]])} \neq 0`}</M></>} en={<>no: <M>{t`A_{${ab[0] + 1}${ab[0] + 1}} = ${n(A[ab[0]][ab[0]])} \neq 0`}</M></>} />
            : <T de={<>nein: <M>{t`A_{${ab[0] + 1}${ab[1] + 1}} = ${n(A[ab[0]][ab[1]])} \neq ${n(-A[ab[1]][ab[0]])} = -A_{${ab[1] + 1}${ab[0] + 1}}`}</M></>} en={<>no: <M>{t`A_{${ab[0] + 1}${ab[1] + 1}} = ${n(A[ab[0]][ab[1]])} \neq ${n(-A[ab[1]][ab[0]])} = -A_{${ab[1] + 1}${ab[0] + 1}}`}</M></>} />}</span>
        </div>
        <p className="la-note">{tr('Tipp auf ein Feld: rot das Feld, blau sein Spiegelpartner. Ändere Zahlen und beobachte die beiden Prüfungen.', 'Tap a cell: red the cell, blue its mirror partner. Change numbers and watch the two checks.')}</p>
      </div>
    </figure>
  );
}
