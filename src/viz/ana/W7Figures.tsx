import { useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr, type Lang } from '../../i18n';
import {
  GROWTH, ORDER_EXAMPLE, arcosh, arsinh, artanh, cx, evalPoly, cabs, fromRoots, quadRoots, type C, type Poly,
} from '../../analysis/week7';
import { Curve, HLine, PLabel, Path, Plot, Pt, Seg, VLine, type Role } from '../plot/Plot';
import type { P2 } from '../plot/plotMath';
import { coshFrame, coshK, divFrame, sinhK, tanhK } from './w7Scenes';
import './w7.css';

const t = String.raw;
const R = (r: string) => r as Role;
/** Number as TeX, up to d decimals, trailing zeros removed. */
const nn = (x: number, lang: Lang, d = 2) => {
  const v = Math.abs(x) < 0.5 * 10 ** -d ? 0 : x;
  const isInt = Math.abs(v - Math.round(v)) < 1e-9;
  return fmtNum(v, isInt ? 0 : d, lang, true).replace(/(\{,\}|\.)(\d*?)0+$/, (_m, sep, ds) => (ds ? sep + ds : ''));
};
/** a + bi as TeX. */
function cart(z: C, lang: Lang): string {
  const re = Math.abs(z.re) < 5e-3 ? 0 : z.re, im = Math.abs(z.im) < 5e-3 ? 0 : z.im;
  const ip = (v: number) => (Math.abs(Math.abs(v) - 1) < 1e-9 ? 'i' : `${nn(Math.abs(v), lang)}i`);
  if (im === 0) return nn(re, lang);
  if (re === 0) return (im < 0 ? '-' : '') + ip(im);
  return `${nn(re, lang)} ${im < 0 ? '-' : '+'} ${ip(im)}`;
}
/** Polynomial (ascending coefficients) as TeX in z. */
export function polyTex(p: Poly, lang: Lang, v = 'z'): string {
  let out = '';
  for (let k = p.length - 1; k >= 0; k--) {
    const a = Math.abs(p[k]) < 1e-9 ? 0 : p[k];
    if (a === 0) continue;
    const mag = Math.abs(a), sgn = a < 0 ? '-' : '+';
    const coef = mag === 1 && k > 0 ? '' : nn(mag, lang);
    const pow = k === 0 ? '' : k === 1 ? v : `${v}^{${k}}`;
    out += out ? ` ${sgn} ${coef}${pow}` : `${a < 0 ? '-' : ''}${coef}${pow}`;
  }
  return out || '0';
}

/* =============================================================== 1 · quadratic: discriminant and the two zeros (S. 5) */

const QPRESETS = [{ id: 'ex', b: -2, c: 5 }, { id: 'double', b: -2, c: 1 }, { id: 'real', b: -2, c: -3 }] as const;
export function QuadraticExplorer() {
  const tr = useTr(), lang = useLang();
  const [b, setB] = useState(-2);
  const [c, setC] = useState(5);
  const r = quadRoots(1, b, c);
  const f = (x: number) => x * x + b * x + c;
  const kind = r.kind;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide w7-wide"><div className="w7-pair">
        <Plot x={[-4, 5]} y={[-5, 8]} w={300} h={300} grid={[1, 1]} tick={[2, 2]} axes={['x', 'y']}
          label={tr('Parabel y = x² + bx + c und ihre Schnittpunkte mit der x-Achse', 'Parabola y = x² + bx + c and where it meets the x-axis')}>
          <Curve f={f} role="f" />
          {kind !== 'complex' && <Pt x={r.z1.re} y={0} role="pt" />}
          {kind === 'two-real' && <Pt x={r.z2.re} y={0} role="pt" />}
          <Pt x={-b / 2} y={f(-b / 2)} role="aux" r={3.5} />
          <PLabel x={-b / 2} y={f(-b / 2)} dy={14} tex={t`\text{S}`} role="muted" small />
        </Plot>
        <Plot x={[-4, 5]} y={[-4.5, 4.5]} w={300} h={300} grid={[1, 1]} tick={[2, 2]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
          label={tr('Die beiden Nullstellen in der komplexen Ebene', 'The two zeros in the complex plane')}>
          {kind === 'complex' && <Seg a={[r.z1.re, r.z1.im]} b={[r.z2.re, r.z2.im]} role="aux" dashed />}
          <Pt x={r.z1.re} y={r.z1.im} role={kind === 'complex' ? 'f' : 'pt'} r={5.5} />
          <Pt x={r.z2.re} y={r.z2.im} role={kind === 'complex' ? 'g' : 'pt'} r={kind === 'double' ? 8 : 5.5} />
          {kind === 'complex' && <>
            <PLabel x={r.z1.re} y={r.z1.im} dx={9} anchor="l" tex={cart(r.z1, lang)} role="f" small />
            <PLabel x={r.z2.re} y={r.z2.im} dx={9} anchor="l" tex={cart(r.z2, lang)} role="g" small />
          </>}
          {kind === 'double' && <PLabel x={r.z1.re} y={r.z1.im} dy={-16} tex={t`2\times`} role="pt" small />}
        </Plot>
      </div></div>
      <figcaption className="vdemo-readout">
        <div className="v-presets">{QPRESETS.map((q) => <button key={q.id} type="button" aria-pressed={b === q.b && c === q.c} onClick={() => { setB(q.b); setC(q.c); }}><M>{t`${polyTex([q.c, q.b, 1], lang)} = 0`}</M></button>)}</div>
        <label className="slider"><span><M>b</M></span><input type="range" min={-4} max={4} step={0.5} value={b} onChange={(e) => setB(Number(e.target.value))} aria-label="b" /><span className="val"><M>{nn(b, lang)}</M></span></label>
        <label className="slider"><span><M>c</M></span><input type="range" min={-4} max={8} step={0.25} value={c} onChange={(e) => setC(Number(e.target.value))} aria-label="c" /><span className="val"><M>{nn(c, lang)}</M></span></label>
        <div className="v-result"><M>{t`${polyTex([c, b, 1], lang)} = 0`}</M></div>
        <div className={`v-result ${kind === 'complex' ? 'neg' : 'pos'}`}><M>{t`b^2 - 4ac = ${nn(b * b, lang)} - 4\cdot ${nn(c, lang).replace(/^-/, '(-') + (c < 0 ? ')' : '')} = ${nn(r.D, lang)}`}</M></div>
        <div className="v-result"><M>{kind === 'complex' ? t`z_{1,2} = ${cart(r.z1, lang).replace(/ [+-] .*/, '')} \pm ${nn(Math.abs(r.z1.im), lang)}i` : kind === 'double' ? t`z_1 = z_2 = ${nn(r.z1.re, lang)}` : t`z_1 = ${nn(r.z1.re, lang)},\ z_2 = ${nn(r.z2.re, lang)}`}</M></div>
        <p className="vdemo-note">{kind === 'complex'
          ? <T de="Die Parabel schwebt über der x-Achse: keine reelle Nullstelle. Die zwei komplexen Nullstellen liegen spiegelbildlich zur reellen Achse." en="The parabola floats above the x-axis: no real zero. The two complex zeros lie mirror-symmetric to the real axis." />
          : kind === 'double' ? <T de="Die Parabel berührt die x-Achse: eine doppelte reelle Nullstelle." en="The parabola touches the x-axis: one double real zero." />
          : <T de="Die Parabel schneidet die x-Achse zweimal: zwei reelle Nullstellen. Schiebe c höher und sieh zu, wie sie sich treffen und dann nach oben und unten auseinandergehen." en="The parabola cuts the x-axis twice: two real zeros. Move c up and watch them meet and then split upwards and downwards." />}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 2 · build a real polynomial from its zeros (S. 6) */

interface Zeros { real: number[]; pairs: C[] }
const snap = (v: number) => Math.round(v * 2) / 2;
const ZPRESETS: { id: string; z: Zeros }[] = [
  { id: 'ex', z: { real: [2, 2], pairs: [cx(0, 1)] } },
  { id: 'sc9', z: { real: [0], pairs: [cx(1, 1), cx(-1, 1)] } },
  { id: 'deg3', z: { real: [-2], pairs: [cx(1, 1.5)] } },
];
export function RootBuilder() {
  const tr = useTr(), lang = useLang();
  const [z, setZ] = useState<Zeros>(ZPRESETS[0].z);
  const [drag, setDrag] = useState<{ kind: 'r' | 'p'; i: number } | null>(null);
  const p = fromRoots(z.real, z.pairs);
  const n = p.length - 1, rp = z.real.length, cp = 2 * z.pairs.length;
  const onDrag = (x: number, y: number, phase: 'down' | 'move' | 'up') => {
    if (phase === 'up') { setDrag(null); return; }
    let d = drag;
    if (phase === 'down' || !d) {
      let best = 0.7; d = null;
      z.real.forEach((r, i) => { const dd = Math.hypot(x - r, y); if (dd < best) { best = dd; d = { kind: 'r', i }; } });
      z.pairs.forEach((q, i) => { const dd = Math.min(Math.hypot(x - q.re, y - q.im), Math.hypot(x - q.re, y + q.im)); if (dd < best) { best = dd; d = { kind: 'p', i }; } });
      setDrag(d);
    }
    if (!d) return;
    const X = Math.max(-3, Math.min(3, snap(x)));
    if (d.kind === 'r') setZ({ ...z, real: z.real.map((r, i) => (i === d!.i ? X : r)) });
    else { const Y = Math.max(0.5, Math.min(3, snap(Math.abs(y)))); setZ({ ...z, pairs: z.pairs.map((q, i) => (i === d!.i ? cx(X, Y) : q)) }); }
  };
  const factor = [
    ...Object.entries(z.real.reduce<Record<string, number>>((m, r) => { const k = nn(r, lang); m[k] = (m[k] ?? 0) + 1; return m; }, {})).map(([k, m]) => (k === '0' ? 'z' : `(z ${k.startsWith('-') ? '+' : '-'} ${k.replace(/^-/, '')})`) + (m > 1 ? `^{${m}}` : '')),
    ...z.pairs.map((q) => `(${polyTex([q.re * q.re + q.im * q.im, -2 * q.re, 1], lang)})`),
  ].join('');
  const mult = (r: number) => z.real.filter((x) => x === r).length;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w7-plane">
        <Plot x={[-3.5, 3.5]} y={[-3.5, 3.5]} w={400} h={400} grid={[0.5, 0.5]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Nullstellen in der komplexen Ebene: reelle auf der Achse, nicht-reelle als Spiegelpaare', 'Zeros in the complex plane: real ones on the axis, non-real ones as mirror pairs')}>
          <HLine y={0} role={R('w7-axis')} dashed={false} />
          {z.pairs.map((q, i) => <g key={`p${i}`}>
            <Seg a={[q.re, q.im]} b={[q.re, -q.im]} role="aux" dashed />
            <Pt x={q.re} y={q.im} role="f" r={6} /><Pt x={q.re} y={-q.im} role="g" r={6} />
            <PLabel x={q.re} y={q.im} dx={10} anchor="l" tex={cart(q, lang)} role="f" small />
            <PLabel x={q.re} y={-q.im} dx={10} anchor="l" tex={cart(cx(q.re, -q.im), lang)} role="g" small />
          </g>)}
          {[...new Set(z.real)].map((r) => <g key={`r${r}`}>
            <Pt x={r} y={0} role="pt" r={mult(r) > 1 ? 8 : 6} />
            {mult(r) > 1 && <PLabel x={r} y={0} dy={-17} tex={t`${mult(r)}\times`} role="pt" small />}
          </g>)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets">
          {ZPRESETS.map((q) => <button key={q.id} type="button" onClick={() => setZ(q.z)}>{q.id === 'ex' ? <M>{t`(z - 2)^2(z^2 + 1)`}</M> : q.id === 'sc9' ? 'SC 9' : <T de="Grad 3" en="degree 3" />}</button>)}
        </div>
        <div className="v-presets">
          <button type="button" disabled={n >= 7} onClick={() => setZ({ ...z, real: [...z.real, 1] })}><T de="+ reelle Nullstelle" en="+ real zero" /></button>
          <button type="button" disabled={n >= 6} onClick={() => setZ({ ...z, pairs: [...z.pairs, cx(-1.5, 2)] })}><T de="+ komplexes Paar" en="+ complex pair" /></button>
          <button type="button" disabled={z.real.length === 0} onClick={() => setZ({ ...z, real: z.real.slice(0, -1) })}><T de="reelle entfernen" en="remove real" /></button>
          <button type="button" disabled={z.pairs.length === 0} onClick={() => setZ({ ...z, pairs: z.pairs.slice(0, -1) })}><T de="Paar entfernen" en="remove pair" /></button>
        </div>
        <div className="v-result"><M>{t`p(z) = ${factor || '1'}`}</M></div>
        <div className="v-result"><M>{t`= ${polyTex(p, lang)}`}</M></div>
        <div className="v-result pos"><M>{t`r_p + c_p = ${rp} + ${cp} = ${n} = \text{${lang === 'de' ? 'Grad' : 'degree'}}`}</M></div>
        <p className="vdemo-note"><T
          de={<>Ziehe die Punkte. Eine nicht-reelle Nullstelle nimmt ihr Spiegelbild immer mit, denn nur so werden alle Koeffizienten reell. Zwei reelle Nullstellen an derselben Stelle zählen doppelt.</>}
          en={<>Drag the points. A non-real zero always takes its mirror image along, because only then are all coefficients real. Two real zeros at the same place count twice.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 3 · finding the zeros of z⁴ − 6z³ + 23z² − 34z + 26 (S. 7) */

const P4: Poly = [26, -34, 23, -6, 1];
export function DivisionFig({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr(), lang = useLang();
  const f = divFrame(step, tt);
  const Z: [C, string, Role][] = [[cx(1, 1), '1 + i', 'f'], [cx(1, -1), '1 - i', 'g'], [cx(2, 3), '2 + 3i', 'f'], [cx(2, -3), '2 - 3i', 'g']];
  return (
    <div className="w7-anim">
      <div className="w7-anim-plane">
        <Plot x={[-1.5, 4]} y={[-4, 4]} w={260} h={330} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
          label={tr('Die vier Nullstellen in der komplexen Ebene', 'The four zeros in the complex plane')}>
          <g style={{ opacity: f.mirror }}><HLine y={0} role={R('w7-axis')} dashed={false} /></g>
          {Z.map(([z, tex, role], i) => f.zeros[i] > 0.01 && <g key={i} style={{ opacity: f.zeros[i] }}>
            <Pt x={z.re} y={z.im} role={role} r={5.5} />
            <PLabel x={z.re} y={z.im} dx={9} anchor="l" tex={tex} role={role} small />
          </g>)}
          {f.zeros[1] > 0.01 && <g style={{ opacity: f.zeros[1] }}><Seg a={[1, 1]} b={[1, -1]} role="aux" dashed /></g>}
          {f.zeros[2] > 0.01 && <g style={{ opacity: f.zeros[2] }}><Seg a={[2, 3]} b={[2, -3]} role="aux" dashed /></g>}
        </Plot>
      </div>
      <div className="w7-anim-text">
        <div><M>{t`p(z) = ${polyTex(P4, lang)}`}</M></div>
        <div style={{ opacity: f.rows.pair }}><M>{t`(z - (1 + i))(z - (1 - i)) = z^2 - 2z + 2`}</M></div>
        <div style={{ opacity: f.rows.div[0] }}><M>{t`p(z) : (z^2 - 2z + 2)`}</M></div>
        <div style={{ opacity: f.rows.div[0] }}><M>{t`-\,(z^4 - 2z^3 + 2z^2) \;\to\; -4z^3 + 21z^2 - 34z + 26`}</M></div>
        <div style={{ opacity: f.rows.div[1] }}><M>{t`-\,(-4z^3 + 8z^2 - 8z) \;\to\; 13z^2 - 26z + 26`}</M></div>
        <div style={{ opacity: f.rows.div[2] }}><M>{t`-\,(13z^2 - 26z + 26) \;\to\; 0`}</M></div>
        <div style={{ opacity: f.rows.quotient }}><M>{t`p(z) = (z^2 - 2z + 2)(z^2 - 4z + 13)`}</M></div>
        <div style={{ opacity: f.rows.formula }}><M>{t`z_{3,4} = \frac{4 \pm \sqrt{16 - 52}}{2} = 2 \pm \sqrt{-9} = 2 \pm 3i`}</M></div>
        <div style={{ opacity: f.rows.result }}><M>{t`z_1 = 1 + i,\ z_2 = 1 - i,\ z_3 = 2 + 3i,\ z_4 = 2 - 3i`}</M></div>
      </div>
    </div>
  );
}

/* =============================================================== 4 · cosh, sinh, tanh (S. 8–9) */

export function HypExplorer() {
  const tr = useTr(), lang = useLang();
  const [x0, setX0] = useState(1);
  const [parts, setParts] = useState(false);
  const c = Math.cosh(x0), s = Math.sinh(x0), th = Math.tanh(x0);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-3, 3]} y={[-3.5, 4.5]} w={400} h={360} grid={[1, 1]} tick={[1, 1]} axes={['x', 'y']}
          label={tr('Graphen von cosh, sinh und tanh', 'Graphs of cosh, sinh and tanh')}>
          <HLine y={1} role="asym" /><HLine y={-1} role="asym" />
          {parts && <><Curve f={(x) => Math.exp(x) / 2} role="ref" dashed /><Curve f={(x) => Math.exp(-x) / 2} role="ref" dashed /></>}
          <Curve f={Math.cosh} role="f" />
          <Curve f={Math.sinh} role="g" />
          <Curve f={Math.tanh} role={R('w7-green')} />
          <VLine x={x0} role="aux" />
          <Pt x={x0} y={c} role="f" /><Pt x={x0} y={s} role="g" /><Pt x={x0} y={th} role={R('w7-green')} />
          <PLabel x={-2.55} y={Math.cosh(-2.55)} dx={8} anchor="l" tex={t`\cosh x`} role="f" small />
          <PLabel x={2.2} y={Math.sinh(2.2)} dx={-8} anchor="r" tex={t`\sinh x`} role="g" small />
          <PLabel x={2.6} y={Math.tanh(2.6)} dy={-12} tex={t`\tanh x`} role={R('w7-green')} small />
          {parts && <><PLabel x={-1.9} y={Math.exp(1.9) / 2} dx={-6} anchor="r" tex={t`\tfrac{e^{-x}}{2}`} role="muted" small /><PLabel x={1.9} y={Math.exp(1.9) / 2} dx={6} anchor="l" tex={t`\tfrac{e^{x}}{2}`} role="muted" small /></>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider"><span><M>x</M></span><input type="range" min={-2.5} max={2.5} step={0.05} value={x0} onChange={(e) => setX0(Number(e.target.value))} aria-label="x" /><span className="val"><M>{nn(x0, lang)}</M></span></label>
        <div className="v-result"><M>{t`\cosh x = ${nn(c, lang, 3)},\quad \sinh x = ${nn(s, lang, 3)}`}</M></div>
        <div className="v-result"><M>{t`\tanh x = \frac{\sinh x}{\cosh x} = ${nn(th, lang, 3)}`}</M></div>
        <div className="v-result pos"><M>{t`\cosh^2 x - \sinh^2 x = ${nn(c * c, lang, 3)} - ${nn(s * s, lang, 3)} = 1`}</M></div>
        <label className="toggle"><input type="checkbox" checked={parts} onChange={(e) => setParts(e.target.checked)} />{' '}<T de={<>Hälften <M>{t`e^x/2`}</M> und <M>{t`e^{-x}/2`}</M> zeigen</>} en={<>show the halves <M>{t`e^x/2`}</M> and <M>{t`e^{-x}/2`}</M></>} /></label>
        <p className="vdemo-note"><T
          de={<><M>\cosh</M> ist symmetrisch zur y-Achse (gerade) und nie kleiner als 1. <M>\sinh</M> und <M>\tanh</M> sind punktsymmetrisch zum Ursprung (ungerade). <M>\tanh</M> bleibt zwischen <M>-1</M> und <M p=".">1</M> Für grosse <M>x</M> liegen <M>\cosh</M> und <M>\sinh</M> fast auf <M p=".">{t`e^x/2`}</M></>}
          en={<><M>\cosh</M> is symmetric about the y-axis (even) and never below 1. <M>\sinh</M> and <M>\tanh</M> are point-symmetric about the origin (odd). <M>\tanh</M> stays between <M>-1</M> and <M p=".">1</M> For large <M>x</M>, <M>\cosh</M> and <M>\sinh</M> lie almost on <M p=".">{t`e^x/2`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

export function CoshAnimFig({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr();
  const f = coshFrame(step, tt);
  const h = 1 - 0.5 * f.half;
  return (
    <div className="w7-anim-single">
      <Plot x={[-3, 3]} y={[-4, 5]} w={400} h={330} grid={[1, 1]} tick={[1, 1]} axes={['x', 'y']}
        label={tr('cosh, sinh und tanh aus e hoch x und e hoch minus x', 'cosh, sinh and tanh from e to the x and e to the minus x')}>
        <g style={{ opacity: f.expO }}>
          <Curve f={(x) => h * Math.exp(x)} role="ref" dashed={f.half > 0.5} />
          <Curve f={(x) => h * Math.exp(-x)} role="ref" dashed={f.half > 0.5} />
          <PLabel x={1.45} y={h * Math.exp(1.45)} dx={8} anchor="l" tex={f.half > 0.5 ? t`\tfrac{e^{x}}{2}` : t`e^{x}`} role="muted" small />
          <PLabel x={-1.45} y={h * Math.exp(1.45)} dx={-8} anchor="r" tex={f.half > 0.5 ? t`\tfrac{e^{-x}}{2}` : t`e^{-x}`} role="muted" small />
        </g>
        {f.coshO > 0 && <><Curve f={(x) => coshK(x, f.kCosh)} role="f" />{f.kCosh > 0.95 && <PLabel x={-2.4} y={Math.cosh(2.4)} dx={8} anchor="l" tex={t`\cosh x`} role="f" small />}</>}
        {f.sinhO > 0 && <><Curve f={(x) => sinhK(x, f.kSinh)} role="g" />{f.kSinh > 0.95 && <PLabel x={-1.9} y={Math.sinh(-1.9)} dx={10} anchor="l" tex={t`\sinh x`} role="g" small />}</>}
        {f.tanhO > 0 && <><g style={{ opacity: f.kTanh }}><HLine y={1} role="asym" /><HLine y={-1} role="asym" /></g><Curve f={(x) => tanhK(x, f.kTanh)} role={R('w7-green')} />{f.kTanh > 0.95 && <PLabel x={2.3} y={1} dy={-12} tex={t`\tanh x`} role={R('w7-green')} small />}</>}
        {f.coshO > 0 && f.kCosh > 0.95 && step === 2 && <><Seg a={[0.8, 0]} b={[0.8, Math.exp(0.8) / 2]} role="aux" /><Seg a={[0.8, Math.exp(0.8) / 2]} b={[0.8, Math.cosh(0.8)]} role="f" width={3} /></>}
      </Plot>
    </div>
  );
}

/* =============================================================== 5 · why «hyperbolic»: the point (cosh t, sinh t) on x² − y² = 1 (supplement) */

export function HyperbolaFigure() {
  const tr = useTr(), lang = useLang();
  const [s, setS] = useState(0.9);
  const X = Math.cosh(s), Y = Math.sinh(s);
  const branch: P2[] = Array.from({ length: 121 }, (_, i) => { const u = -2.2 + (4.4 * i) / 120; return [Math.cosh(u), Math.sinh(u)]; });
  const circle: P2[] = Array.from({ length: 121 }, (_, i) => { const u = (2 * Math.PI * i) / 120; return [Math.cos(u), Math.sin(u)]; });
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w7-plane">
        <Plot x={[-1.6, 4.2]} y={[-3.2, 3.2]} w={380} h={400} grid={[1, 1]} tick={[1, 1]} axes={['x', 'y']}
          label={tr('Der Punkt (cosh t, sinh t) läuft auf der Hyperbel x² − y² = 1', 'The point (cosh t, sinh t) runs on the hyperbola x² − y² = 1')}>
          <Path pts={circle} role="aux" dashed />
          <Path pts={branch} role={R('w7-green')} />
          <Seg a={[X, 0]} b={[X, Y]} role="f" dashed /><Seg a={[0, Y]} b={[X, Y]} role="g" dashed />
          <Seg a={[0, 0]} b={[X, Y]} role="aux" />
          <Pt x={X} y={Y} role="pt" r={5.5} />
          <Pt x={Math.cos(s)} y={Math.sin(s)} role="aux" r={3.5} />
          <PLabel x={X} y={0} dy={16} tex={t`\cosh t`} role="f" small />
          <PLabel x={0} y={Y} dx={-8} anchor="r" tex={t`\sinh t`} role="g" small />
          <PLabel x={3.4} y={Math.sqrt(3.4 * 3.4 - 1)} dx={-10} anchor="r" tex={t`x^2 - y^2 = 1`} role={R('w7-green')} small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider"><span><M>t</M></span><input type="range" min={-1.9} max={1.9} step={0.05} value={s} onChange={(e) => setS(Number(e.target.value))} aria-label="t" /><span className="val"><M>{nn(s, lang)}</M></span></label>
        <div className="v-result pos"><M>{t`x^2 - y^2 = \cosh^2 t - \sinh^2 t = ${nn(X * X, lang, 3)} - ${nn(Y * Y, lang, 3)} = 1`}</M></div>
        <p className="vdemo-note"><T
          de={<>Wie <M>{t`(\cos t, \sin t)`}</M> auf dem Kreis <M>{t`x^2 + y^2 = 1`}</M> läuft (gestrichelt, grauer Punkt), läuft <M>{t`(\cosh t, \sinh t)`}</M> auf der Hyperbel <M p=".">{t`x^2 - y^2 = 1`}</M> Daher der Name. Weil <M>\cosh</M> nie kleiner als 1 ist, bleibt der Punkt auf dem rechten Ast.</>}
          en={<>Just as <M>{t`(\cos t, \sin t)`}</M> runs on the circle <M>{t`x^2 + y^2 = 1`}</M> (dashed, grey point), <M>{t`(\cosh t, \sinh t)`}</M> runs on the hyperbola <M p=".">{t`x^2 - y^2 = 1`}</M> Hence the name. Since <M>\cosh</M> is never below 1, the point stays on the right branch.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 6 · inverse functions (S. 9–10) */

type Inv = 'sinh' | 'cosh' | 'tanh';
export function InverseHyp() {
  const tr = useTr();
  const [k, setK] = useState<Inv>('sinh');
  const f = k === 'sinh' ? Math.sinh : k === 'cosh' ? Math.cosh : Math.tanh;
  const g = k === 'sinh' ? arsinh : k === 'cosh' ? arcosh : artanh;
  const fDom: [number, number] = k === 'cosh' ? [0, 3] : [-3.2, 3.2];
  const gDom: [number, number] = k === 'cosh' ? [1, 3.2] : k === 'tanh' ? [-0.9999, 0.9999] : [-3.2, 3.2];
  const info: Record<Inv, { inv: string; formula: string; dom: string; der: string }> = {
    sinh: { inv: '\\operatorname{Arsinh}', formula: '\\ln\\bigl(x + \\sqrt{x^2 + 1}\\bigr)', dom: 'x \\in \\mathbb R', der: '\\frac{1}{\\sqrt{x^2 + 1}}' },
    cosh: { inv: '\\operatorname{Arcosh}', formula: '\\ln\\bigl(x + \\sqrt{x^2 - 1}\\bigr)', dom: 'x \\ge 1', der: '\\frac{1}{\\sqrt{x^2 - 1}},\\ x > 1' },
    tanh: { inv: '\\operatorname{Artanh}', formula: '\\frac12 \\ln\\Bigl(\\frac{1 + x}{1 - x}\\Bigr)', dom: '-1 < x < 1', der: '\\frac{1}{1 - x^2}' },
  };
  const I = info[k];
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w7-plane">
        <Plot x={[-3.2, 3.2]} y={[-3.2, 3.2]} w={400} h={400} grid={[1, 1]} tick={[1, 1]} axes={['x', 'y']}
          label={tr('Eine Hyperbelfunktion, ihre Umkehrfunktion und die Spiegelachse y = x', 'A hyperbolic function, its inverse and the mirror line y = x')}>
          <Curve f={(x) => x} role="aux" dashed />
          {k === 'cosh' && <Curve f={Math.cosh} dom={[-3, 0]} role="ref" dashed />}
          {k === 'tanh' && <><VLine x={1} role="asym" /><VLine x={-1} role="asym" /><HLine y={1} role="asym" /><HLine y={-1} role="asym" /></>}
          <Curve f={f} dom={fDom} role="f" />
          <Curve f={g} dom={gDom} role="g" n={600} />
          <PLabel x={k === 'cosh' ? 1.6 : 1.5} y={f(k === 'cosh' ? 1.6 : 1.5)} dx={-8} anchor="r" tex={`\\${k} x`} role="f" small />
          <PLabel x={2.6} y={g(k === 'tanh' ? 0.97 : 2.6)} dy={-12} tex={t`${I.inv}\, x`} role="g" small />
          {k === 'tanh' && <PLabel x={0.97} y={g(0.97)} dx={8} anchor="l" tex={t`${I.inv}\, x`} role="g" small />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets">{(['sinh', 'cosh', 'tanh'] as Inv[]).map((x) => <button key={x} type="button" aria-pressed={k === x} onClick={() => setK(x)}><M>{`\\${x}`}</M></button>)}</div>
        <div className="v-result"><M>{t`${I.inv}\, x = ${I.formula},\qquad ${I.dom}`}</M></div>
        <div className="v-result pos"><M>{t`(${I.inv}\, x)' = ${I.der}`}</M></div>
        <p className="vdemo-note">{k === 'cosh'
          ? <T de={<>Nur die rechte Hälfte von <M>\cosh</M> (ab <M p=")">{t`x = 0`}</M> ist umkehrbar; links (grau) käme jeder Wert zweimal vor. Gespiegelt an <M>{t`y = x`}</M> ergibt sie <M>{t`\operatorname{Arcosh}`}</M> mit <M p=".">{t`x \ge 1`}</M></>} en={<>Only the right half of <M>\cosh</M> (from <M p=")">{t`x = 0`}</M> is invertible; on the left (grey) every value would occur twice. Mirrored at <M>{t`y = x`}</M> it gives <M>{t`\operatorname{Arcosh}`}</M> with <M p=".">{t`x \ge 1`}</M></>} />
          : k === 'tanh' ? <T de={<><M>\tanh</M> nimmt nur Werte zwischen <M>-1</M> und <M>1</M> an. Darum ist <M>{t`\operatorname{Artanh}`}</M> nur dort definiert und hat bei <M>{t`\pm 1`}</M> senkrechte Asymptoten.</>} en={<><M>\tanh</M> only takes values between <M>-1</M> and <M p=".">1</M> So <M>{t`\operatorname{Artanh}`}</M> is only defined there and has vertical asymptotes at <M p=".">{t`\pm 1`}</M></>} />
          : <T de={<><M>\sinh</M> ist streng wachsend auf ganz <M p=",">{t`\mathbb R`}</M> also umkehrbar. Die Umkehrfunktion ist das Spiegelbild an der Geraden <M p=".">{t`y = x`}</M></>} en={<><M>\sinh</M> is strictly increasing on all of <M p=",">{t`\mathbb R`}</M> hence invertible. The inverse is the mirror image in the line <M p=".">{t`y = x`}</M></>} />}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 7 · the growth race (S. 10) */

const GROW_ROLE: Record<string, string> = { fact: 'pt', exp2: 'w7-blue', sq: 'w7-green', xlnx: 'g', x: 'asym', ln: 'w7-amber', one: 'aux' };
export function GrowthRace() {
  const tr = useTr();
  const [X, setX] = useState(10);
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(GROWTH.map((g) => [g.id, true])));
  const top = Math.max(2, Math.ceil(Math.log10(GROWTH[0].f(X)) + 0.3));
  const yTicks = Array.from({ length: top + 2 }, (_, k) => k - 1).filter((k) => top <= 10 || k % 2 === 0);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-X * 0.09, X + 0.2]} y={[-1.2, top]} w={420} h={320} grid={[X > 20 ? 5 : 1, 1]} tick={[X > 20 ? 5 : 2, 0]} axes={['x', t`y`]}
          label={tr('Wachstum im Vergleich, y logarithmisch', 'Growth compared, y on a log scale')}>
          {yTicks.map((k) => <PLabel key={k} x={0} y={k} dx={-5} anchor="r" tex={k === 0 ? '1' : k === 1 ? '10' : t`10^{${k}}`} role="muted" small halo={false} />)}
          {GROWTH.filter((g) => on[g.id]).map((g) => (
            <Curve key={g.id} f={(x) => { const v = g.f(x); return v > 0 ? Math.log10(v) : -9; }} dom={[1, X]} role={R(GROW_ROLE[g.id])} dashed={g.id === 'one'} n={400} />
          ))}
          {on.fact && Array.from({ length: Math.floor(X) }, (_, i) => i + 1).map((n) => <Pt key={n} x={n} y={Math.log10(GROWTH[0].f(n))} role="pt" r={3} />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="w7-legend" role="group" aria-label={tr('Funktionen ein- und ausblenden', 'Show or hide functions')}>
          {GROWTH.map((g) => <button key={g.id} type="button" aria-pressed={on[g.id]} className={`w7-key pl-ink-${GROW_ROLE[g.id]}`} onClick={() => setOn({ ...on, [g.id]: !on[g.id] })}><M>{g.tex}</M></button>)}
        </div>
        <label className="slider"><span><M>{t`x_\text{max}`}</M></span><input type="range" min={5} max={40} step={1} value={X} onChange={(e) => setX(Number(e.target.value))} aria-label="x max" /><span className="val"><M>{String(X)}</M></span></label>
        <p className="vdemo-note"><T
          de={<>Die y-Achse ist logarithmisch: Jede Linie ist zehnmal mehr als die darunter. Am Anfang liegen die Kurven durcheinander (<M>{t`x^2`}</M> ist bis <M>{t`x = 4`}</M> grösser als <M p=")">{t`2^x`}</M> Auf lange Sicht ist die Reihenfolge fest: <M p=".">{t`x! \gg 2^x \gg x^2 \gg x\ln x \gg x \gg \ln x \gg 1`}</M></>}
          en={<>The y-axis is logarithmic: each line is ten times the one below. At first the curves are mixed up (<M>{t`x^2`}</M> is larger than <M>{t`2^x`}</M> up to <M p=")">{t`x = 4`}</M> In the long run the order is fixed: <M p=".">{t`x! \gg 2^x \gg x^2 \gg x\ln x \gg x \gg \ln x \gg 1`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 8 · f = o(g): does the ratio go to 0? (S. 11–12) */

interface Pair { id: string; f: string; g: string; to: 'inf' | '0'; q: (x: number, a: number, b: number) => number; params?: [string, number, number, number][]; verdict: (a: number, b: number) => 'o' | 'O' | 'none'; label: ReactNode }
const PAIRS: Pair[] = [
  { id: 'x2x3', f: 'x^2', g: 'x^3', to: 'inf', q: (x) => 1 / x, verdict: () => 'o', label: <M>{t`x^2,\ x^3`}</M> },
  { id: 'pow-exp', f: 'x^a', g: 'e^{bx}', to: 'inf', q: (x, a, b) => Math.exp(a * Math.log(x) - b * x), params: [['a', 0.5, 8, 0.5], ['b', 0.25, 2, 0.25]], verdict: () => 'o', label: <M>{t`x^a,\ e^{bx}`}</M> },
  { id: 'ln-pow', f: '(\\ln x)^c', g: 'x^a', to: 'inf', q: (x, c, a) => Math.exp(c * Math.log(Math.log(x)) - a * Math.log(x)), params: [['c', 1, 6, 1], ['a', 0.25, 2, 0.25]], verdict: () => 'o', label: <M>{t`(\ln x)^c,\ x^a`}</M> },
  { id: 'lnln', f: '\\ln(\\ln x)', g: '\\ln x', to: 'inf', q: (x) => Math.log(Math.log(x)) / Math.log(x), verdict: () => 'o', label: <M>{t`\ln(\ln x),\ \ln x`}</M> },
  { id: 'sc12b', f: '\\ln x', g: '\\ln(x^2)', to: 'inf', q: () => 0.5, verdict: () => 'O', label: <>SC 12 (B)</> },
  { id: 'ln0', f: '|\\ln x|^c', g: 'x^{-a}', to: '0', q: (x, c, a) => Math.exp(c * Math.log(Math.abs(Math.log(x))) + a * Math.log(x)), params: [['c', 1, 6, 1], ['a', 0.25, 2, 0.25]], verdict: () => 'o', label: <M>{t`x \to 0^+`}</M> },
  { id: 'sc6', f: 'e^{-1/x}', g: 'x^4', to: '0', q: (x) => Math.exp(-1 / x - 4 * Math.log(x)), verdict: () => 'o', label: <>SC 6 (C)</> },
];
export function RatioExplorer({ initial = 'pow-exp' }: { initial?: string }) {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState(initial);
  const pr = PAIRS.find((p) => p.id === id)!;
  const [vals, setVals] = useState<Record<string, number>>({ a: 5, b: 1, c: 3 });
  const A = pr.params ? vals[pr.params[0][0]] : 0, B = pr.params ? vals[pr.params[1][0]] : 0;
  // horizontal axis: u = log10(x) (x → ∞) or u = log10(1/x) (x → 0⁺)
  const U = pr.to === 'inf' ? (pr.id === 'ln-pow' || pr.id === 'lnln' ? 14 : pr.id === 'pow-exp' ? 2.2 : 4) : (pr.id === 'sc6' ? 1.6 : 8);
  const u0 = pr.to === 'inf' ? (pr.id === 'ln-pow' || pr.id === 'lnln' ? 0.45 : 0) : 0;
  const xOf = (u: number) => (pr.to === 'inf' ? 10 ** u : 10 ** -u);
  const ratio = (u: number) => pr.q(xOf(u), A, B);
  let ymax = 0;
  for (let i = 0; i <= 200; i++) { const v = ratio(u0 + ((U - u0) * i) / 200); if (Number.isFinite(v)) ymax = Math.max(ymax, v); }
  ymax = Math.max(1, ymax * 1.15);
  const yT = ymax > 20 ? 10 ** Math.floor(Math.log10(ymax / 2)) : ymax > 5 ? 2 : ymax > 2 ? 1 : 0.5;
  const uT = U > 8 ? 2 : 1;
  const ticks = Array.from({ length: Math.floor(U / uT) + 1 }, (_, k) => k * uT).filter((u) => u >= u0);
  const end = ratio(U);
  const v = pr.verdict(A, B);
  const peak = pr.id === 'pow-exp' ? A / B : pr.id === 'ln-pow' ? Math.exp(A / B) : null;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[u0, U]} y={[0, ymax]} w={420} h={300} grid={[uT, yT]} tick={[0, yT]} axes={[pr.to === 'inf' ? 'x' : 'x', t`\tfrac{f}{g}`]}
          label={tr('Der Quotient f durch g, x logarithmisch', 'The ratio f over g, x on a log scale')}>
          {ticks.map((u) => <PLabel key={u} x={u} y={0} dy={13} tex={pr.to === 'inf' ? (u === 0 ? '1' : u === 1 ? '10' : t`10^{${u}}`) : (u === 0 ? '1' : t`10^{-${u}}`)} role="muted" small halo={false} />)}
          <Curve f={ratio} dom={[u0, U]} role="f" n={500} />
          {peak !== null && Math.log10(peak) < U && Math.log10(peak) > u0 && <><VLine x={Math.log10(peak)} role="aux" /><Pt x={Math.log10(peak)} y={ratio(Math.log10(peak))} role="pt" r={4} /></>}
          {v === 'O' && <HLine y={0.5} role="asym" />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-presets">{PAIRS.map((p) => <button key={p.id} type="button" aria-pressed={p.id === id} onClick={() => setId(p.id)}>{p.label}</button>)}</div>
        {pr.params?.map(([k, lo, hi, st]) => (
          <label key={k} className="slider"><span><M>{k}</M></span><input type="range" min={lo} max={hi} step={st} value={vals[k]} onChange={(e) => setVals({ ...vals, [k]: Number(e.target.value) })} aria-label={k} /><span className="val"><M>{nn(vals[k], lang)}</M></span></label>
        ))}
        <div className="v-result"><M>{t`f(x) = ${pr.f.replace('a', pr.params?.some((p) => p[0] === 'a') ? nn(vals.a, lang) : 'a').replace('c', pr.params?.some((p) => p[0] === 'c') ? nn(vals.c, lang) : 'c')},\quad g(x) = ${pr.g.replace('b', pr.params?.some((p) => p[0] === 'b') ? (vals.b === 1 ? '' : nn(vals.b, lang)) : 'b').replace('a', pr.params?.some((p) => p[0] === 'a') ? nn(vals.a, lang) : 'a')},\quad x \to ${pr.to === 'inf' ? '\\infty' : '0^+'}`}</M></div>
        <div className={`v-result ${v === 'o' ? 'pos' : ''}`}><M>{v === 'o' ? t`\frac{f}{g} \to 0 \;\Rightarrow\; f = o(g)` : t`\frac{f}{g} = \tfrac12 \not\to 0 \;\Rightarrow\; f \ne o(g),\ \text{${lang === 'de' ? 'aber' : 'but'}}\ f = O(g)`}</M></div>
        <p className="vdemo-note">
          {pr.id === 'pow-exp' && <T de={<>Der Quotient <M>{t`x^a e^{-bx}`}</M> wächst zuerst bis <M>{t`x = a/b`}</M> (roter Punkt) und fällt dann gegen 0. Grosses <M>a</M> verschiebt den Buckel nur nach rechts, es verhindert ihn nicht.</>} en={<>The ratio <M>{t`x^a e^{-bx}`}</M> first grows up to <M>{t`x = a/b`}</M> (red point) and then falls to 0. A large <M>a</M> only moves the hump to the right; it cannot prevent the fall.</>} />}
          {pr.id === 'ln-pow' && <T de={<>Der Logarithmus verliert, aber sehr langsam: der Buckel liegt bei <M p=",">{t`x = e^{c/a}`}</M> danach geht es gegen 0. Die x-Achse reicht bis <M p=".">{t`10^{14}`}</M></>} en={<>The logarithm loses, but very slowly: the hump lies at <M p=",">{t`x = e^{c/a}`}</M> after that the ratio goes to 0. The x-axis reaches <M p=".">{t`10^{14}`}</M></>} />}
          {pr.id === 'x2x3' && <T de={<><M>{t`x^2/x^3 = 1/x \to 0`}</M>: <M>{t`x^2`}</M> wächst langsamer als <M p=".">{t`x^3`}</M></>} en={<><M>{t`x^2/x^3 = 1/x \to 0`}</M>: <M>{t`x^2`}</M> grows more slowly than <M p=".">{t`x^3`}</M></>} />}
          {pr.id === 'lnln' && <T de={<>Auch ein Logarithmus vom Logarithmus ist klein gegen den Logarithmus, obwohl beide gegen unendlich gehen.</>} en={<>Even a logarithm of a logarithm is small compared with the logarithm, although both go to infinity.</>} />}
          {pr.id === 'sc12b' && <T de={<><M>{t`\ln(x^2) = 2\ln x`}</M>: Der Quotient ist immer <M p=".">{t`\tfrac12`}</M> Ein fester Faktor ändert die Grössenordnung nicht. Also nicht klein-o, wohl aber gross-O.</>} en={<><M>{t`\ln(x^2) = 2\ln x`}</M>: the ratio is always <M p=".">{t`\tfrac12`}</M> A constant factor does not change the order of magnitude. So not little o, but big O.</>} />}
          {pr.id === 'ln0' && <T de={<>Für <M>{t`x \to 0^+`}</M> läuft die Achse nach rechts zu immer kleineren <M p=".">x</M> Der Betrag ist nötig, weil <M>{t`\ln x < 0`}</M> dort.</>} en={<>For <M>{t`x \to 0^+`}</M> the axis runs to ever smaller <M>x</M> towards the right. The absolute value is needed because <M>{t`\ln x < 0`}</M> there.</>} />}
          {pr.id === 'sc6' && <T de={<>Mit <M>{t`u = 1/x \to \infty`}</M> wird der Quotient zu <M p=":">{t`u^4 e^{-u}`}</M> eine Potenz gegen eine Exponentialfunktion, also <M p=".">{t`\to 0`}</M></>} en={<>With <M>{t`u = 1/x \to \infty`}</M> the ratio becomes <M p=":">{t`u^4 e^{-u}`}</M> a power against an exponential, so <M p=".">{t`\to 0`}</M></>} />}
          {' '}{Number.isFinite(end) && <T de={<>Am rechten Rand: <M p=".">{t`f/g \approx ${end < 1e-3 ? end.toExponential(1).replace('e', '\\cdot 10^{').replace(/$/, '}').replace('.', lang === 'de' ? '{,}' : '.') : nn(end, lang, 3)}`}</M></>} en={<>At the right edge: <M p=".">{t`f/g \approx ${end < 1e-3 ? end.toExponential(1).replace('e', '\\cdot 10^{').replace(/$/, '}') : nn(end, lang, 3)}`}</M></>} />}
        </p>
      </figcaption>
    </figure>
  );
}

/** S. 12 ordering example: the four functions on a log scale. */
export function OrderExample() {
  const tr = useTr();
  const roles = ['pt', 'w7-blue', 'w7-green', 'g'];
  const Xmax = 40;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <Plot x={[-4, Xmax]} y={[-2, 5]} w={420} h={300} grid={[5, 1]} tick={[10, 0]} axes={['x', 'y']}
          label={tr('Die vier Funktionen von S. 12, y logarithmisch', 'The four functions of p. 12, y on a log scale')}>
          {[-1, 0, 1, 2, 3, 4].map((k) => <PLabel key={k} x={0} y={k} dx={-5} anchor="r" tex={k === 0 ? '1' : k === 1 ? '10' : t`10^{${k}}`} role="muted" small halo={false} />)}
          {ORDER_EXAMPLE.map((g, i) => <Curve key={g.id} f={(x) => (x > 0 ? g.lnf(x) / Math.LN10 : -9)} dom={[g.id === 'f3' ? 1.31 : 0.05, Xmax]} role={R(roles[i])} n={600} />)}
          {ORDER_EXAMPLE.map((g, i) => <PLabel key={g.id} x={i === 0 ? 1.5 : i === 3 ? 25 : Xmax - 1} y={i === 0 ? 3.7 : g.lnf(i === 3 ? 25 : Xmax - 1) / Math.LN10} dx={i === 0 ? 8 : i === 3 ? 0 : -6} dy={i === 3 ? 24 : -10} anchor={i === 0 ? 'l' : i === 3 ? 'c' : 'r'} tex={g.tex} role={R(roles[i])} small />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <p className="vdemo-note"><T
          de={<><M>{t`e^{5x+1}`}</M> verlässt das Bild schon bei <M p=".">{t`x \approx 1{,}6`}</M> Ganz unten <M p=":">{t`\ln\bigl(e^{x^{1/4}} - 2\bigr)`}</M> Für grosse <M>x</M> ist die <M>-2</M> neben <M>{t`e^{x^{1/4}}`}</M> unwichtig, also <M p=".">{t`\ln\bigl(e^{x^{1/4}} - 2\bigr) \approx x^{1/4}`}</M> Das wächst langsamer als <M p=".">{t`\sqrt x = x^{1/2}`}</M></>}
          en={<><M>{t`e^{5x+1}`}</M> leaves the picture already at <M p=".">{t`x \approx 1.6`}</M> At the very bottom: <M p=".">{t`\ln\bigl(e^{x^{1/4}} - 2\bigr)`}</M> For large <M>x</M> the <M>-2</M> next to <M>{t`e^{x^{1/4}}`}</M> does not matter, so <M p=".">{t`\ln\bigl(e^{x^{1/4}} - 2\bigr) \approx x^{1/4}`}</M> That grows more slowly than <M p=".">{t`\sqrt x = x^{1/2}`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

/** Check helper used by the tests of this file's examples (re-export). */
export const evalAt = (p: Poly, z: C) => cabs(evalPoly(p, z));
