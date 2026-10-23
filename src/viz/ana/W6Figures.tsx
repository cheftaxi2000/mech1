import { useEffect, useRef, useState, type ReactNode } from 'react';
import { M, MD } from '../../components/Tex';
import { fmtNum, useLang, useTr, type Lang } from '../../i18n';
import {
  angleTex, arg, bisectorGap, cabs, cx, div4, divPolar, fromPolar, mulPolar, naiveArctan, norm2pi, powerList,
  probePoint, roots, type C,
} from '../../analysis/week6';
import { HLine, PArrow, PLabel, Path, Plot, Pt, Seg, usePlot } from '../plot/Plot';
import type { P2 } from '../plot/plotMath';
import { useReducedMotion } from '../figUtils';
import {
  HALF_WIN, MUL_WIN, REGION_PRESETS, ROOT_WIN, arcPts, boundaryIncluded, circlePts, halfPlanePoly, halfScene, linePts,
  mulScene, rootAnimScene, satisfies, snapPolar, tipOffset, type Cond, type Win,
} from './w6Scenes';

const t = String.raw;
const PI = Math.PI;
const P = (z: C): P2 => [z.re, z.im];

/** Number as TeX with up to d decimals, trailing zeros removed (German decimal comma). */
const nn = (x: number, lang: Lang, d = 2) => {
  const v = Math.abs(x) < 0.5 * 10 ** -d ? 0 : x;
  return fmtNum(v, Number.isInteger(Math.round(v * 1e6) / 1e6) ? 0 : d, lang, true).replace(/(\{,\}\d*?)0+$/, '$1').replace(/\{,\}$/, '');
};
const isNice = (x: number, d = 2) => Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-7;
/** «= v» or «≈ v». */
const eqv = (x: number, lang: Lang, d = 2) => `${isNice(x, d) ? '=' : '\\approx'} ${nn(x, lang, d)}`;
/** a + bi with up to two decimals. */
function cart(z: C, lang: Lang): string {
  const re = Math.abs(z.re) < 5e-3 ? 0 : z.re, im = Math.abs(z.im) < 5e-3 ? 0 : z.im;
  const imPart = (v: number) => (Math.abs(Math.abs(v) - 1) < 1e-9 ? 'i' : `${nn(Math.abs(v), lang)}i`);
  if (im === 0) return nn(re, lang);
  if (re === 0) return (im < 0 ? '-' : '') + imPart(im);
  return `${nn(re, lang)} ${im < 0 ? '-' : '+'} ${imPart(im)}`;
}
const cartNice = (z: C) => isNice(z.re) && isNice(z.im);
/** Angle as TeX: exact multiple of π/24 if possible, else decimal radians. */
const ang = (phi: number, lang: Lang, style: 'frac' | 'slash' = 'frac') => angleTex(phi, style) ?? nn(phi, lang);
/** r e^{iφ} as TeX. */
const eul = (r: number, phi: number, lang: Lang) => {
  const a = angleTex(phi, 'slash');
  const rr = Math.abs(r - Math.SQRT2) < 1e-9 ? '\\sqrt2' : Math.abs(r - 1) < 1e-12 ? '' : nn(r, lang);
  if (a === '0') return rr || '1';
  return `${rr}\\,e^{i${a ? (a.startsWith('-') ? `(${a})` : a) : `\\cdot ${nn(phi, lang)}`}}`;
};

/** Spiral arc from angle a0 to a1 whose radius grows a little per turn (keeps overlapping turns apart). */
function spiral(r0: number, a0: number, a1: number, grow = 0.18): P2[] {
  const n = Math.max(3, Math.ceil(Math.abs(a1 - a0) / 0.06));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n, r = r0 + (grow * Math.abs(a - a0)) / (2 * PI);
    return [r * Math.cos(a), r * Math.sin(a)] as P2;
  });
}
/** Label position (math coords) in the middle of an arc of radius r between a0 and a1, pushed out by k. */
const arcMid = (r: number, a0: number, a1: number, k = 1.35): P2 => { const a = (a0 + a1) / 2; return [k * r * Math.cos(a), k * r * Math.sin(a)]; };
/** Offset (viewBox units) perpendicular to the vector p, to label the middle of an arrow. */
function midLabel(p: P2, side = 1, d = 13) {
  const l = Math.hypot(p[0], p[1]) || 1;
  return { x: p[0] / 2, y: p[1] / 2, dx: (-p[1] / l) * d * side, dy: (-p[0] / l) * d * side };
}
/** Tick/check mark as KaTeX in a coloured span. */
const Mark = ({ ok }: { ok: boolean }) => <span className={ok ? 'w6-ok' : 'w6-no'}><M>{ok ? t`\checkmark` : t`\times`}</M></span>;

function Lbl({ z, tex, role, d = 12 }: { z: C | P2; tex: string; role: 'f' | 'g' | 'pt' | 'asym' | 'sec' | 'muted' | 'fg'; d?: number }) {
  const p: P2 = Array.isArray(z) ? (z as P2) : P(z as C);
  const o = tipOffset(p, d);
  return <PLabel x={p[0]} y={p[1]} dx={o.dx} dy={o.dy} anchor={o.anchor} tex={tex} role={role} small />;
}

/** Shared drag logic: pick the nearest of several handles on 'down', then update it. */
function useDrag<K extends string>(handles: Record<K, P2>, set: (k: K, x: number, y: number) => void) {
  const [active, setActive] = useState<K | null>(null);
  return (x: number, y: number, phase: 'down' | 'move' | 'up') => {
    if (phase === 'up') { setActive(null); return; }
    let k = active;
    if (phase === 'down' || k === null) {
      let best = Infinity;
      for (const key of Object.keys(handles) as K[]) { const h = handles[key], d = Math.hypot(x - h[0], y - h[1]); if (d < best) { best = d; k = key; } }
      setActive(k);
    }
    if (k !== null) set(k, x, y);
  };
}

/* =============================================================== 1 · powers of i: a quarter turn per factor */

export function IPowers() {
  const tr = useTr();
  const [n, setN] = useState(27);
  const { q, r } = div4(n);
  const names = ['1', 'i', '-1', '-i'];
  const pos: P2[] = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  // the spiral of quarter turns fills the radii 0.3 … 0.85 whatever n is
  const turns = Math.max(1, n / 4);
  const sp = spiral(0.3, 0, (n * PI) / 2, 0.55 / turns);
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w6-small">
        <Plot x={[-1.7, 1.7]} y={[-1.7, 1.7]} w={300} h={300} grid={[0, 0]} tick={[0, 0]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
          label={tr('Einheitskreis: jede Multiplikation mit i dreht um eine Vierteldrehung', 'Unit circle: every multiplication by i turns by a quarter turn')}>
          <Path pts={circlePts(1)} role="aux" dashed />
          {n > 0 && <g className="w6-thin"><Path pts={sp} role="asym" /></g>}
          {n > 0 && <PArrow a={sp[sp.length - 2]} b={sp[sp.length - 1]} role="asym" head={8} />}
          {pos.map((p, k) => <Pt key={k} x={p[0]} y={p[1]} role={k === r ? 'pt' : 'muted'} r={k === r ? 6.5 : 3.5} />)}
          {pos.map((p, k) => <PLabel key={`l${k}`} x={p[0]} y={p[1]} dx={k === 2 ? -8 : 8} dy={k % 2 === 0 ? -12 : k === 1 ? -4 : 6} anchor={k === 2 ? 'r' : 'l'} tex={k === r ? t`i^{${n}} = ${names[k]}` : names[k]} role={k === r ? 'pt' : 'muted'} small />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider"><span><M>n</M></span>
          <input type="range" min={0} max={31} step={1} value={n} onChange={(e) => setN(Number(e.target.value))} aria-label="n" /><span className="val">{n}</span></label>
        <div className="v-result"><M>{t`${n} = 4\cdot ${q} + ${r}`}</M></div>
        <div className="v-result pos"><M>{t`i^{${n}} = (i^4)^{${q}}\cdot i^{${r}} = 1\cdot i^{${r}} = ${names[r]}`}</M></div>
        <p className="vdemo-note">{tr(<>Jeder Faktor <M>i</M> dreht um eine Vierteldrehung (violette Spirale). Nach vier Schritten ist man wieder bei <M p=".">1</M> Darum zählt nur der Rest beim Teilen durch <M p=".">4</M></>,
          <>Every factor <M>i</M> turns by a quarter turn (purple spiral). After four steps you are back at <M p=".">1</M> That is why only the remainder after dividing by <M>4</M> counts.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 2 · polar form and the right angle */

const ANG_PRESETS: { tex: string; r: number; phi: number }[] = [
  { tex: t`\sqrt3 + i`, r: 2, phi: PI / 6 },
  { tex: t`-\sqrt3 + i`, r: 2, phi: (5 * PI) / 6 },
  { tex: '1', r: 1, phi: 0 },
  { tex: 'i', r: 1, phi: PI / 2 },
  { tex: '-1', r: 1, phi: PI },
  { tex: '-i', r: 1, phi: (3 * PI) / 2 },
];

export function AngleExplorer() {
  const tr = useTr(), lang = useLang();
  const [p, setP] = useState({ r: 2, phi: (5 * PI) / 6 });
  const z = fromPolar(p.r, p.phi);
  const onDrag = useDrag({ z: P(z) }, (_k, x, y) => setP(snapPolar(x, y, 0.25, PI / 12, 0.25, 3)));
  const zero = p.r === 0;
  const a = zero ? 0 : z.re, b = zero ? 0 : z.im;
  const at = zero || Math.abs(a) < 1e-9 ? NaN : naiveArctan(z);
  const left = a < -1e-9;
  const atRay = Number.isFinite(at) ? fromPolar(p.r, at) : null;
  const WIN = 3.5;
  const pressed = (q: { r: number; phi: number }) => Math.abs(q.r - p.r) < 1e-9 && Math.abs(norm2pi(q.phi) - p.phi) < 1e-9;
  const aTex = (Math.abs(Math.abs(a) - Math.sqrt(3)) < 1e-9 ? (a < 0 ? '-\\sqrt3' : '\\sqrt3') : null);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {ANG_PRESETS.map((q) => <button key={q.tex} type="button" aria-pressed={pressed(q)} onClick={() => setP({ r: q.r, phi: q.phi })}><M>{q.tex}</M></button>)}
      </div>
      <div className="vdemo-fig w6-plane">
        <Plot x={[-WIN, WIN]} y={[-WIN, WIN]} w={400} h={400} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Komplexe Ebene: Punkt z mit Länge r und Winkel φ; gestrichelt der Strahl von arctan(b/a)', 'Complex plane: point z with length r and angle φ; dashed the ray of arctan(b/a)')}>
          {!zero && <>
            <Seg a={P(z)} b={[a, 0]} role="f" dashed /><Seg a={P(z)} b={[0, b]} role="f" dashed />
            {atRay && <><Seg a={[0, 0]} b={P(atRay)} role="sec" dashed /><Path pts={arcPts(1.25, 0, at)} role="sec" /></>}
            <Path pts={arcPts(0.75, 0, p.phi)} role="asym" />
            <PArrow a={[0, 0]} b={P(z)} role="f" />
            <Pt x={a} y={b} role="f" r={6} />
            <Lbl z={z} tex="z" role="f" />
            {p.phi > 0.15 && <PLabel x={arcMid(0.75, 0, p.phi)[0]} y={arcMid(0.75, 0, p.phi)[1]} tex={t`\varphi`} role="asym" small />}
            {atRay && left && <Lbl z={atRay} tex={t`\arctan\tfrac{b}{a}`} role="sec" />}
            {p.r >= 1 && <PLabel {...midLabel(P(z), left ? -1 : 1)} tex="r" role="f" small />}
            {Math.abs(a) > 0.3 && <PLabel x={a / 2} y={b} dy={b >= 0 ? -11 : 11} tex="a" role="f" small />}
            {Math.abs(b) > 0.3 && <PLabel x={a} y={b / 2} dx={a >= 0 ? 10 : -10} anchor={a >= 0 ? 'l' : 'r'} tex="b" role="f" small />}
          </>}
          {zero && <><Pt x={0} y={0} role="f" r={6} /><PLabel x={0} y={0} dx={10} dy={-14} anchor="l" tex={t`z = 0`} role="f" small /></>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        {zero ? <p className="vdemo-note">{tr(<>Bei <M>{t`z = 0`}</M> ist <M p=".">{t`r = 0`}</M> Ein Winkel ist hier nicht festgelegt – jeder Winkel gibt denselben Punkt.</>,
          <>At <M>{t`z = 0`}</M> we have <M p=".">{t`r = 0`}</M> No angle is defined here – every angle gives the same point.</>)}</p> : <>
          <div className="v-result"><M>{t`z = a + bi ${aTex ? '=' : cartNice(z) ? '=' : '\\approx'} ${aTex ? `${aTex} ${b < 0 ? '-' : '+'} ${Math.abs(Math.abs(b) - 1) < 1e-9 ? 'i' : nn(Math.abs(b), lang) + 'i'}` : cart(z, lang)}`}</M></div>
          <div className="v-result"><M>{t`r = \sqrt{a^2 + b^2} = ${nn(p.r, lang)}`}</M></div>
          <div className="v-result"><M>{t`\cos\varphi = \tfrac{a}{r} ${eqv(a / p.r, lang)},\quad \sin\varphi = \tfrac{b}{r} ${eqv(b / p.r, lang)}`}</M></div>
          <div className="v-result pos"><M>{t`\varphi = ${ang(p.phi, lang)}\quad(${nn((p.phi * 180) / PI, lang, 1)}^\circ)`}</M></div>
          <div className={`v-result ${!Number.isFinite(at) ? '' : left ? 'neg' : ''}`}>
            {Number.isFinite(at)
              ? <><M>{t`\arctan\tfrac{b}{a} = ${ang(at, lang)}`}</M> <Mark ok={!left} /> {left
                ? tr(<>falsche Hälfte: <M p=".">{t`\varphi = \arctan\tfrac{b}{a} + \pi`}</M></>, <>wrong half: <M p=".">{t`\varphi = \arctan\tfrac{b}{a} + \pi`}</M></>)
                : Math.abs(norm2pi(at) - p.phi) < 1e-9 && at < 0 ? tr(<>dieselbe Richtung (<M p=")">{t`+2\pi`}</M></>, <>same direction (<M p=")">{t`+2\pi`}</M></>) : tr('dieselbe Richtung', 'same direction')}</>
              : <>{tr(<><M>{t`a = 0`}</M>: <M>{t`b/a`}</M> ist nicht definiert.</>, <><M>{t`a = 0`}</M>: <M>{t`b/a`}</M> is not defined.</>)}</>}
          </div>
          <div className="v-result"><M>{t`z = ${nn(p.r, lang)}\left(\cos ${ang(p.phi, lang)} + i\sin ${ang(p.phi, lang)}\right)`}</M></div>
        </>}
        <p className="vdemo-note">{tr(<>Ziehe <M p=".">z</M> Türkis gestrichelt: der Strahl, den <M>{t`\arctan(b/a)`}</M> liefert. In der linken Halbebene zeigt er in die Gegenrichtung.</>,
          <>Drag <M p=".">z</M> Teal dashed: the ray that <M>{t`\arctan(b/a)`}</M> gives. In the left half-plane it points the opposite way.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 3 · multiplication, slide example (step animation) */

export function MulAnimFig({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr();
  const s = mulScene(step, tt);
  return (
    <div className="w6-anim">
      <Plot x={MUL_WIN.x} y={MUL_WIN.y} w={400} h={356} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
        label={tr('2e^{iπ/6} mal 3e^{iπ/3}: erst strecken, dann drehen', '2e^{iπ/6} times 3e^{iπ/3}: first stretch, then turn')}>
        <Path pts={arcPts(0.9, 0, PI / 6)} role="f" />
        {s.showZ2 && <><PArrow a={[0, 0]} b={P(s.z2)} role="g" /><Path pts={arcPts(0.6, 0, PI / 3)} role="g" /><Lbl z={s.z2} tex={t`z_2 = 3e^{i\pi/3}`} role="g" /></>}
        {s.turnArc && <Path pts={s.turnArc} role="g" />}
        {s.turnArc && step === 2 && tt >= 1 && <PLabel x={2.05 * Math.cos(1.33)} y={2.05 * Math.sin(1.33)} tex={t`+\tfrac{\pi}{3}`} role="g" small />}
        {step >= 1 && <PArrow a={[0, 0]} b={P(s.cur)} role="fg" />}
        <PArrow a={[0, 0]} b={P(s.z1)} role="f" />
        {s.z1.re > 0.3 && <Lbl z={s.z1} tex={t`z_1 = 2e^{i\pi/6}`} role="f" />}
        <PLabel x={1.25} y={0.33} anchor="l" tex={t`\tfrac{\pi}{6}`} role="f" small />
        {step >= 1 && <Pt x={s.cur.re} y={s.cur.im} role="fg" r={5.5} />}
        {step === 1 && tt >= 1 && <PLabel x={s.cur.re} y={s.cur.im} dx={-8} dy={-12} anchor="r" tex={t`r = 2\cdot 3 = 6`} role="fg" small />}
        {s.done && <PLabel x={0} y={6} dx={10} anchor="l" tex={t`z_1 z_2 = 6e^{i\pi/2} = 6i`} role="fg" small />}
      </Plot>
    </div>
  );
}

/* =============================================================== 4 · multiplication / division explorer (showpiece) */

type MulMode = 'mul' | 'div';
interface Pol { r: number; phi: number }
const MUL_PRESETS: { id: string; mode: MulMode; z1: Pol; z2: Pol; label: (tr: ReturnType<typeof useTr>) => ReactNode }[] = [
  { id: 'ex', mode: 'mul', z1: { r: 2, phi: PI / 6 }, z2: { r: 3, phi: PI / 3 }, label: (tr) => tr('Übung', 'Class example') },
  { id: 'i', mode: 'mul', z1: { r: 2, phi: PI / 6 }, z2: { r: 1, phi: PI / 2 }, label: () => <M>{t`\cdot\, i`}</M> },
  { id: 'm1', mode: 'mul', z1: { r: 2, phi: PI / 6 }, z2: { r: 1, phi: PI }, label: () => <M>{t`\cdot\,(-1)`}</M> },
  { id: 'small', mode: 'mul', z1: { r: 4, phi: PI / 6 }, z2: { r: 0.5, phi: PI / 2 }, label: () => <M>{t`r_2 < 1`}</M> },
  { id: 'div', mode: 'div', z1: { r: 6, phi: PI / 2 }, z2: { r: 2, phi: PI / 6 }, label: (tr) => <>{tr('Division', 'Division')} <M>{t`z_1 / z_2`}</M></> },
];

export function MulExplorer() {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<MulMode>('mul');
  const [p1, setP1] = useState<Pol>({ r: 2, phi: PI / 6 });
  const [p2, setP2] = useState<Pol>({ r: 3, phi: PI / 3 });
  const z1 = fromPolar(p1.r, p1.phi), z2 = fromPolar(p2.r, p2.phi);
  const res = mode === 'mul' ? mulPolar(p1.r, p1.phi, p2.r, p2.phi) : divPolar(p1.r, p1.phi, p2.r, p2.phi);
  const zr = fromPolar(res.r, res.phi);
  const MAX = 6.5;
  const onDrag = useDrag({ z1: P(z1), z2: P(z2) }, (k, x, y) => {
    const s = snapPolar(x, y, 0.5, PI / 12, 0.5, 6);
    const r = Math.max(0.5, s.r);
    if (k === 'z1') {
      const lim = mode === 'mul' ? MAX / p2.r : MAX * p2.r;
      setP1({ r: Math.min(r, Math.floor(lim * 2) / 2), phi: s.phi });
    } else {
      const lim = mode === 'mul' ? MAX / p1.r : p1.r / MAX;
      setP2({ r: mode === 'mul' ? Math.min(r, Math.max(0.5, Math.floor(lim * 2) / 2)) : Math.max(r, Math.ceil(lim * 2) / 2), phi: s.phi });
    }
  });
  const preset = (q: (typeof MUL_PRESETS)[number]) => { setMode(q.mode); setP1(q.z1); setP2(q.z2); };
  const same = (a: Pol, b: Pol) => Math.abs(a.r - b.r) < 1e-9 && Math.abs(a.phi - b.phi) < 1e-9;
  const W = 7;
  const s1 = p1.phi, s2 = p2.phi;
  const sum = mode === 'mul' ? s1 + s2 : s1 - s2;
  // arcs: φ1 blue (r 0.9), φ2 magenta continuing from φ1 (r 1.25), the result's angle purple spiral (r 1.8)
  // φ1 (blue) and the attached φ2 (magenta) on one circle, so the second visibly continues the first;
  // the result's angle as a purple arc further out (a slight spiral if it exceeds a full turn).
  const RA = 1.3, RB = 2.3;
  const a1 = spiral(RA, 0, s1, 0.25);
  const a2 = spiral(RA + (0.25 * Math.abs(s1)) / (2 * PI), s1, sum, 0.25);
  const aR = spiral(RB, 0, sum, 0.35);
  // labels outside the arcs; +φ2 at three quarters of its piece (its middle can lie exactly on the arrow of z2)
  const lab1 = arcMid(RA, 0, mode === 'mul' ? s1 : 0.6 * s1, 1.3), lab2 = arcMid(RA, s1, s1 + 1.5 * (sum - s1), 1.35), labR = arcMid(RB, 0, 1.7 * sum, 1.25);
  const rTex = t`r_1 r_2`;
  const angSum = (style: 'frac' | 'slash') => (mode === 'mul' ? `${ang(s1, lang, style)} + ${ang(s2, lang, style)}` : `${ang(s1, lang, style)} - ${ang(s2, lang, style)}`);
  const red = norm2pi(sum);
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {MUL_PRESETS.map((q) => <button key={q.id} type="button" aria-pressed={mode === q.mode && same(p1, q.z1) && same(p2, q.z2)} onClick={() => preset(q)}>{q.label(tr)}</button>)}
      </div>
      <div className="vdemo-fig w6-plane">
        <Plot x={[-W, W]} y={[-W, W]} w={400} h={400} grid={[1, 1]} tick={[2, 2]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Zwei ziehbare komplexe Zahlen und ihr Produkt: Längen multiplizieren, Winkel addieren', 'Two draggable complex numbers and their product: lengths multiply, angles add')}>
          <Path pts={a1} role="f" />
          {Math.abs(s2) > 1e-9 && <Path pts={a2} role="g" />}
          {Math.abs(sum) > 1e-9 && <Path pts={aR} role="asym" />}
          <PArrow a={[0, 0]} b={P(z2)} role="g" />
          <PArrow a={[0, 0]} b={P(z1)} role="f" />
          <PArrow a={[0, 0]} b={P(zr)} role="fg" />
          <Pt x={z1.re} y={z1.im} role="f" r={6} /><Pt x={z2.re} y={z2.im} role="g" r={6} /><Pt x={zr.re} y={zr.im} role="fg" r={5} />
          <Lbl z={z1} tex="z_1" role="f" /><Lbl z={z2} tex="z_2" role="g" />
          <Lbl z={zr} tex={mode === 'mul' ? 'z_1 z_2' : 'z_1 / z_2'} role="fg" />
          {Math.abs(s1) > 0.3 && <PLabel x={lab1[0]} y={lab1[1]} tex={t`\varphi_1`} role="f" small />}
          {Math.abs(s2) > 0.3 && <PLabel x={lab2[0]} y={lab2[1]} tex={mode === 'mul' ? t`+\varphi_2` : t`-\varphi_2`} role="g" small />}
          {Math.abs(sum) > 0.3 && <PLabel x={labR[0]} y={labR[1]} tex={mode === 'mul' ? t`\varphi_1 + \varphi_2` : t`\varphi_1 - \varphi_2`} role="asym" small />}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result"><M>{t`z_1 = ${eul(p1.r, s1, lang)},\quad z_2 = ${eul(p2.r, s2, lang)}`}</M></div>
        <div className="v-result pos"><M>{mode === 'mul'
          ? t`z_1 z_2 = (${nn(p1.r, lang)}\cdot ${nn(p2.r, lang)})\,e^{i(${angSum('slash')})} = ${eul(res.r, sum, lang)}`
          : t`\frac{z_1}{z_2} = \frac{${nn(p1.r, lang)}}{${nn(p2.r, lang)}}\,e^{i(${angSum('slash')})} = ${eul(res.r, sum, lang)}`}</M></div>
        {Math.abs(red - sum) > 1e-9 && <div className="v-result"><M>{t`${ang(sum, lang)} \text{ ${tr('und', 'and')} } ${ang(red, lang)}\ \text{${tr('geben denselben Punkt', 'give the same point')}}`}</M></div>}
        <div className="v-result"><M>{t`${mode === 'mul' ? 'z_1 z_2' : '\\tfrac{z_1}{z_2}'} ${cartNice(zr) ? '=' : '\\approx'} ${cart(zr, lang)}`}</M></div>
        <p className="vdemo-note">{mode === 'mul'
          ? tr(<>Ziehe <M>{t`z_1`}</M> oder <M p=".">{t`z_2`}</M> Längen multiplizieren <M p=",">{t`(${rTex} = ${nn(p1.r, lang)}\cdot ${nn(p2.r, lang)} = ${nn(res.r, lang)})`}</M> Winkel addieren: Der magenta Bogen <M>{t`\varphi_2`}</M> wird an <M>{t`\varphi_1`}</M> angehängt.</>,
            <>Drag <M>{t`z_1`}</M> or <M p=".">{t`z_2`}</M> Lengths multiply <M p=",">{t`(${rTex} = ${nn(p1.r, lang)}\cdot ${nn(p2.r, lang)} = ${nn(res.r, lang)})`}</M> angles add: the magenta arc <M>{t`\varphi_2`}</M> is attached to <M p=".">{t`\varphi_1`}</M></>)
          : tr(<>Längen teilen <M p=",">{t`(${nn(p1.r, lang)} : ${nn(p2.r, lang)} = ${nn(res.r, lang)})`}</M> Winkel abziehen: Der magenta Bogen <M>{t`\varphi_2`}</M> wird von <M>{t`\varphi_1`}</M> zurückgedreht.</>,
            <>Lengths divide <M p=",">{t`(${nn(p1.r, lang)} : ${nn(p2.r, lang)} = ${nn(res.r, lang)})`}</M> angles subtract: the magenta arc <M>{t`\varphi_2`}</M> is turned back from <M p=".">{t`\varphi_1`}</M></>)}</p>
        <div className="v-presets">
          <button type="button" aria-pressed={mode === 'mul'} onClick={() => setMode('mul')}><M>{t`z_1 \cdot z_2`}</M></button>
          <button type="button" aria-pressed={mode === 'div'} onClick={() => { setMode('div'); if (p1.r / p2.r > MAX) setP2({ ...p2, r: Math.ceil((2 * p1.r) / MAX) / 2 }); }}><M>{t`z_1 / z_2`}</M></button>
        </div>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 5 · powers: the spiral z, z², …, zⁿ */

const POW_PRESETS: { id: string; r: number; phi: number; n: number; tex: string }[] = [
  { id: 'ex', r: Math.SQRT2, phi: PI / 4, n: 4, tex: t`(1 + i)^4` },
  { id: 'in', r: 0.85, phi: PI / 6, n: 12, tex: t`r < 1` },
  { id: 'on', r: 1, phi: PI / 6, n: 12, tex: t`r = 1` },
  { id: 'out', r: 1.1, phi: PI / 6, n: 12, tex: t`r > 1` },
];

export function PowerSpiral() {
  const tr = useTr(), lang = useLang();
  const [p, setP] = useState<Pol>({ r: Math.SQRT2, phi: PI / 4 });
  const [n, setN] = useState(4);
  // window: fits all powers; changes only on preset, slider or the end of a drag (not while dragging)
  const fit = (q: Pol, m: number) => Math.min(4.5, Math.max(1.5, Math.ceil(2 * 1.15 * Math.max(...powerList(fromPolar(q.r, q.phi), m).map(cabs), 1)) / 2));
  const [W, setW] = useState(() => fit({ r: Math.SQRT2, phi: PI / 4 }, 4));
  const z = fromPolar(p.r, p.phi);
  const drag = useDrag({ z: P(z) }, (_k, x, y) => { const s = snapPolar(x, y, 0.05, PI / 24, 0.5, 1.5); setP({ r: Math.max(0.5, s.r), phi: s.phi }); });
  const onDrag = (x: number, y: number, phase: 'down' | 'move' | 'up') => { drag(x, y, phase); if (phase === 'up') setW(fit(p, n)); };
  const pw = powerList(z, n);
  const zn = pw[n - 1];
  const pts: P2[] = pw.map(P);
  const rn = p.r ** n;
  const rTex = Math.abs(p.r - Math.SQRT2) < 1e-9 ? '(\\sqrt2)' : `(${nn(p.r, lang)})`;
  const tk = W <= 2 ? 0.5 : 1;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {POW_PRESETS.map((q) => <button key={q.id} type="button" aria-pressed={Math.abs(q.r - p.r) < 1e-9 && Math.abs(q.phi - p.phi) < 1e-9 && q.n === n} onClick={() => { setP({ r: q.r, phi: q.phi }); setN(q.n); setW(fit(q, q.n)); }}><M>{q.tex}</M></button>)}
      </div>
      <div className="vdemo-fig w6-plane">
        <Plot x={[-W, W]} y={[-W, W]} w={400} h={400} grid={[tk, tk]} tick={[tk, tk]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Potenzen z, z², …, zⁿ als Spirale; gestrichelt der Einheitskreis', 'Powers z, z², …, zⁿ as a spiral; dashed the unit circle')}>
          <Path pts={circlePts(1)} role="aux" dashed />
          {pw.slice(1, n - 1).map((w, k) => <Seg key={`r${k}`} a={[0, 0]} b={P(w)} role="aux" />)}
          <Path pts={pts} role="sec" />
          {n > 1 && <PArrow a={[0, 0]} b={P(zn)} role="fg" />}
          <PArrow a={[0, 0]} b={P(z)} role="f" />
          {pw.map((w, k) => <Pt key={k} x={w.re} y={w.im} role={k === 0 ? 'f' : k === n - 1 ? 'fg' : 'sec'} r={k === 0 || k === n - 1 ? 5.5 : 3.5} />)}
          <Lbl z={z} tex="z" role="f" />
          {n > 1 && <Lbl z={zn} tex={t`z^{${n}}`} role="fg" />}
          {n > 2 && pw.slice(1, Math.min(n - 1, 3)).map((w, k) => <Lbl key={k} z={w} tex={t`z^{${k + 2}}`} role="sec" d={9} />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider"><span><M>n</M></span>
          <input type="range" min={1} max={12} step={1} value={n} onChange={(e) => { const m = Number(e.target.value); setN(m); setW(fit(p, m)); }} aria-label="n" /><span className="val">{n}</span></label>
        <div className="v-result"><M>{t`z = ${eul(p.r, p.phi, lang)}`}</M></div>
        <div className="v-result pos"><M>{t`z^{${n}} = ${rTex}^{${n}}\,e^{i\cdot ${n}\cdot ${ang(p.phi, lang, 'slash')}} = ${eul(rn, n * p.phi, lang)}`}</M></div>
        <div className="v-result"><M>{t`z^{${n}} ${cartNice(zn) ? '=' : '\\approx'} ${cart(zn, lang)}`}</M>{(Math.abs(zn.re) > W || Math.abs(zn.im) > W) && <> {tr('(ausserhalb des Bildes)', '(outside the picture)')}</>}</div>
        <p className="vdemo-note">{tr(<>Ziehe <M p=".">z</M> Jeder Schritt dreht um <M>{t`\varphi`}</M> und streckt mit <M p=".">r</M> Bei <M>{t`r < 1`}</M> läuft die Spirale nach innen, bei <M>{t`r > 1`}</M> nach aussen, bei <M>{t`r = 1`}</M> bleibt sie auf dem Kreis.</>,
          <>Drag <M p=".">z</M> Each step turns by <M>{t`\varphi`}</M> and stretches by <M p=".">r</M> For <M>{t`r < 1`}</M> the spiral runs inward, for <M>{t`r > 1`}</M> outward, for <M>{t`r = 1`}</M> it stays on the circle.</>)}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 6 · multiplying by i: z = 6 + 7i → −7 + 6i */

export function RotateI() {
  const tr = useTr();
  const z = cx(6, 7), iz = cx(-7, 6);
  const az = arg(z);
  const sq = 0.9, u: P2 = [z.re / cabs(z), z.im / cabs(z)], v: P2 = [iz.re / cabs(iz), iz.im / cabs(iz)];
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w6-small">
        <Plot x={[-8.5, 8.5]} y={[-2.5, 8.5]} w={400} h={260} grid={[1, 1]} tick={[2, 2]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
          label={tr('z = 6 + 7i und iz = −7 + 6i: Drehung um 90 Grad', 'z = 6 + 7i and iz = −7 + 6i: rotation by 90 degrees')}>
          <Path pts={arcPts(4.2, az, az + PI / 2)} role="asym" />
          <PArrow a={P(fromPolar(4.2, az + PI / 2 - 0.12))} b={P(fromPolar(4.2, az + PI / 2))} role="asym" />
          <Path pts={[[sq * u[0], sq * u[1]], [sq * (u[0] + v[0]), sq * (u[1] + v[1])], [sq * v[0], sq * v[1]]]} role="aux" />
          <PArrow a={[0, 0]} b={P(z)} role="f" /><PArrow a={[0, 0]} b={P(iz)} role="g" />
          <Pt x={z.re} y={z.im} role="f" r={5.5} /><Pt x={iz.re} y={iz.im} role="g" r={5.5} />
          <PLabel x={z.re} y={z.im} dx={-10} anchor="r" tex={t`z = 6 + 7i`} role="f" small />
          <PLabel x={iz.re} y={iz.im} dx={10} dy={-6} anchor="l" tex={t`iz = -7 + 6i`} role="g" small />
          <PLabel x={fromPolar(5.2, az + PI / 4).re} y={fromPolar(5.2, az + PI / 4).im} dy={-4} tex={t`90^\circ`} role="asym" small />
        </Plot>
      </div>
    </figure>
  );
}

/* =============================================================== 7 · z⁴ = −16, construction (step animation) */

export function RootAnimFig({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr();
  const s = rootAnimScene(step, tt);
  const W = ROOT_WIN;
  const names = ['z_0', 'z_1', 'z_2', 'z_3'];
  return (
    <div className="w6-anim w6-square">
      <Plot x={W.x} y={W.y} w={360} h={360} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
        label={tr('Die vier Lösungen von z hoch 4 gleich −16 auf dem Kreis mit Radius 2', 'The four solutions of z to the 4th equal −16 on the circle of radius 2')}>
        <PArrow a={[-0.4, 0]} b={[-2.95, 0]} role="g" />
        <Path pts={arcPts(0.4, 0, PI)} role="g" />
        {s.circle && <Path pts={s.circle} role="aux" dashed />}
        {s.square > 0 && <g style={{ opacity: s.square }}><Path pts={s.roots} role="f" closed /></g>}
        {s.startArc && <Path pts={s.startArc} role="asym" />}
        {s.turnArc && step === 3 && <Path pts={s.turnArc} role="asym" />}
        {s.marker && step <= 3 && <Seg a={[0, 0]} b={P(s.marker)} role="asym" />}
        {s.roots.map((p, k) => s.shown[k] && <Pt key={k} x={p[0]} y={p[1]} role={k === 0 ? 'pt' : 'f'} r={5.5} />)}
        {s.roots.map((p, k) => s.shown[k] && <Lbl key={`l${k}`} z={p} tex={names[k]} role={k === 0 ? 'pt' : 'f'} d={11} />)}
        <PLabel x={-2.9} y={0} dy={-13} anchor="l" tex={t`w = -16\ \text{${tr('(weit links)', '(far left)')}}`} role="g" small />
        <PLabel x={0} y={0.4} dy={-16} dx={6} tex={t`\theta = \pi`} role="g" small />
        {step >= 1 && (step > 1 || tt >= 1) && <PLabel x={-1.55} y={-2.25} anchor="r" tex={t`r = \sqrt[4]{16} = 2`} role="muted" small />}
        {s.startArc && step >= 2 && (step > 2 || tt >= 1) && <PLabel x={0.95} y={0.42} anchor="l" tex={t`\tfrac{\pi}{4}`} role="asym" small />}
        {step >= 3 && <PLabel x={0} y={1.75} tex={t`+\tfrac{\pi}{2}`} role="asym" small />}
      </Plot>
    </div>
  );
}

/* =============================================================== 8 · roots explorer (showpiece) */

export function RootsExplorer() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [w, setW] = useState<C>(cx(-4, 0));
  const [n, setN] = useState(4);
  const [probe, setProbe] = useState(0); // 0 = off, else animation time in [0, 1]
  const [running, setRunning] = useState(false);
  const raf = useRef(0);
  const W = 4.6;
  const onDrag = useDrag({ w: P(w) }, (_k, x, y) => {
    let q = cx(Math.round(4 * x) / 4, Math.round(4 * y) / 4);
    const l = cabs(q);
    if (l > 4.4) q = cx((q.re * 4.4) / l, (q.im * 4.4) / l);
    setW(q); setProbe(0); setRunning(false);
  });
  useEffect(() => {
    if (!running) return;
    if (reduced) { setProbe(1); setRunning(false); return; }
    const t0 = performance.now(), dur = 2600;
    const tick = (now: number) => {
      const s = Math.min(1, (now - t0) / dur);
      setProbe(s);
      if (s < 1) raf.current = requestAnimationFrame(tick); else setRunning(false);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running, reduced]);
  const zero = cabs(w) < 1e-9;
  const rs = roots(w, n);
  const R = cabs(w), th = arg(w), rr = R ** (1 / n);
  const ease = (x: number) => x * x * (3 - 2 * x);
  const pt = ease(probe);
  const names = (k: number) => `z_{${k}}`;
  const thTex = zero ? '' : ang(th, lang);
  const nice = !zero && angleTex(th) !== null;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        <button type="button" aria-pressed={w.re === -4 && w.im === 0 && n === 4} onClick={() => { setW(cx(-4, 0)); setN(4); setProbe(0); }}><M>{t`z^4 = -4`}</M></button>
        <button type="button" aria-pressed={w.re === 1 && w.im === 0 && n === 6} onClick={() => { setW(cx(1, 0)); setN(6); setProbe(0); }}><M>{t`z^6 = 1`}</M></button>
        <button type="button" aria-pressed={w.re === 0 && w.im === 2 && n === 3} onClick={() => { setW(cx(0, 2)); setN(3); setProbe(0); }}><M>{t`z^3 = 2i`}</M></button>
      </div>
      <div className="vdemo-fig w6-plane">
        <Plot x={[-W, W]} y={[-W, W]} w={400} h={400} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Die n Lösungen von zⁿ = w bilden ein regelmässiges n-Eck auf einem Kreis', 'The n solutions of zⁿ = w form a regular n-gon on a circle')}>
          {!zero && <>
            <Path pts={circlePts(rr)} role="aux" dashed />
            <Path pts={rs.map((r) => P(r.z))} role="f" closed />
            <Path pts={arcPts(Math.min(0.55, 0.45 * R), 0, th)} role="g" />
            <PArrow a={[0, 0]} b={P(w)} role="g" />
            <Path pts={arcPts(rr * 0.55, 0, th / n)} role="asym" />
            <Path pts={arcPts(rr * 1.18, th / n, th / n + (2 * PI) / n)} role="asym" dashed />
            <Seg a={[0, 0]} b={P(rs[0].z)} role="asym" />
            {probe > 0 && rs.map((r, k) => {
              const path = Array.from({ length: 61 }, (_, i) => P(probePoint(rr, r.angle, n, (pt * i) / 60)));
              const cur = probePoint(rr, r.angle, n, pt);
              return <g key={`p${k}`}><Path pts={path} role="asym" /><Pt x={cur.re} y={cur.im} role="asym" r={4} /></g>;
            })}
            {rs.map((r, k) => <Pt key={k} x={r.z.re} y={r.z.im} role={k === 0 ? 'pt' : 'f'} r={k === 0 ? 6 : 5} />)}
            {rs.map((r, k) => <Lbl key={`l${k}`} z={r.z} tex={names(k)} role={k === 0 ? 'pt' : 'f'} d={11} />)}
            <Pt x={w.re} y={w.im} role="g" r={6.5} />
            <Lbl z={w} tex="w" role="g" d={13} />
            {th / n > 0.3 && <PLabel x={arcMid(rr * 0.55, 0, th / n, 1.0)[0]} y={arcMid(rr * 0.55, 0, th / n, 1.0)[1]} dx={14} anchor="l" tex={t`\theta/${n}`} role="asym" small />}
            <PLabel x={arcMid(rr * 1.18, th / n, th / n + (2 * PI) / n, 1.2)[0]} y={arcMid(rr * 1.18, th / n, th / n + (2 * PI) / n, 1.2)[1]} tex={t`2\pi/${n}`} role="asym" small />
          </>}
          {zero && <><Pt x={0} y={0} role="g" r={6.5} /><PLabel x={0} y={0} dx={10} dy={-14} anchor="l" tex={t`w = 0 = z`} role="g" small /></>}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider"><span><M>n</M></span>
          <input type="range" min={2} max={8} step={1} value={n} onChange={(e) => { setN(Number(e.target.value)); setProbe(0); setRunning(false); }} aria-label="n" /><span className="val">{n}</span></label>
        {zero ? <p className="vdemo-note">{tr(<>Bei <M>{t`w = 0`}</M> gibt es nur die eine Lösung <M p=".">{t`z = 0`}</M></>, <>For <M>{t`w = 0`}</M> there is only the one solution <M p=".">{t`z = 0`}</M></>)}</p> : <>
          <div className="v-result"><M>{t`w = ${cart(w, lang)} = R\,e^{i\theta},\quad R ${eqv(R, lang)},\ \theta ${nice ? '=' : '\\approx'} ${thTex}`}</M></div>
          <div className="v-result pos"><M>{t`z_k = \sqrt[${n}]{R}\,e^{i(\theta + 2\pi k)/${n}},\quad k = 0, \dots, ${n - 1}`}</M></div>
          <div className="v-result"><M>{t`\sqrt[${n}]{R} ${eqv(rr, lang)},\quad \tfrac{\theta}{${n}} ${nice ? '=' : '\\approx'} ${ang(th / n, lang)},\quad \tfrac{2\pi}{${n}} = ${ang((2 * PI) / n, lang)}`}</M></div>
          {probe >= 1 && <div className="v-result pos"><M>{t`z_k^{${n}}:\ \text{${tr('Winkel', 'angle')}}\ ${n}\cdot\tfrac{\theta + 2\pi k}{${n}} = \theta + 2\pi k\ \to\ w`}</M></div>}
        </>}
        <div className="v-presets">
          <button type="button" disabled={zero} aria-pressed={probe > 0} onClick={() => { if (probe > 0 && !running) setProbe(0); else { setProbe(0.0001); setRunning(true); } }}>
            {tr('Probe: jede Lösung hoch ', 'Check: raise each solution to the ')}<M>n</M>{tr('', 'th power')}</button>
        </div>
        <p className="vdemo-note">{tr(<>Ziehe <M>w</M> und ändere <M p=".">n</M> Die Lösungen bilden ein regelmässiges <M>n</M>-Eck: Startwinkel <M p=",">{t`\theta/n`}</M> dann jeweils <M>{t`2\pi/n`}</M> weiter. Die Probe zeigt, warum alle passen: Hoch <M>n</M> macht aus jedem Winkel <M p=",">{t`\theta + 2\pi k`}</M> und das ist dieselbe Richtung wie <M p=".">\theta</M></>,
          <>Drag <M>w</M> and change <M p=".">n</M> The solutions form a regular <M>n</M>-gon: start angle <M p=",">{t`\theta/n`}</M> then <M>{t`2\pi/n`}</M> further each time. The check shows why all of them work: raising to the power <M>n</M> turns each angle into <M p=",">{t`\theta + 2\pi k`}</M> which is the same direction as <M p=".">\theta</M></>)}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 9 · double angle: compare Re and Im (step animation) */

const BL = '#3b82f6', MG = '#ec4899';
const DBL_LINES = [
  t`e^{2ix} = \left(e^{ix}\right)^2`,
  t`\cos(2x) + i\sin(2x) = (\cos x + i\sin x)^2`,
  t`\begin{aligned}(\cos x + i\sin x)^2 &= \cos^2 x + 2i\sin x\cos x \\ &\phantom{=}\ + i^2\sin^2 x \\ &= {\color{${BL}}\cos^2 x - \sin^2 x} + i\,{\color{${MG}}2\sin x\cos x}\end{aligned}`,
  t`\begin{gathered}{\color{${BL}}\cos(2x) = \cos^2 x - \sin^2 x} \\ {\color{${MG}}\sin(2x) = 2\sin x\cos x}\end{gathered}`,
];
export function DoubleAngleLines({ step, t: tt }: { step: number; t: number }) {
  return (
    <div className="w6-anim w6-lines">
      {DBL_LINES.map((l, i) => (
        <div key={i} className={`w6-line${i === step ? ' now' : ''}`} style={{ opacity: i < step ? 0.75 : i === step ? Math.min(1, 0.2 + 1.2 * tt) : 0 }}>
          <MD>{l}</MD>
        </div>
      ))}
    </div>
  );
}

/* =============================================================== 10 · Re(iz) > 1 (step animation) */

export function HalfAnimFig({ step, t: tt }: { step: number; t: number }) {
  const tr = useTr(), lang = useLang();
  const s = halfScene(step, tt);
  const W: Win = HALF_WIN;
  return (
    <div className="w6-anim">
      <Plot x={W.x} y={W.y} w={400} h={370} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]}
        label={tr('Re(iz) > 1: iz ist z um 90 Grad gedreht; Re(iz) = −b; die Halbebene b < −1', 'Re(iz) > 1: iz is z turned by 90 degrees; Re(iz) = −b; the half-plane b < −1')}>
        {s.shade > 0 && <g style={{ opacity: s.shade }}><Path pts={[[W.x[0] - 1, -1], [W.x[1] + 1, -1], [W.x[1] + 1, W.y[0] - 1], [W.x[0] - 1, W.y[0] - 1]]} role="g" fill /></g>}
        {s.shade > 0 && <g style={{ opacity: s.shade }}><HLine y={-1} role="g" dashed /></g>}
        <Seg a={P(s.z)} b={[0, s.z.im]} role="f" dashed />
        {s.arc && <Path pts={s.arc} role="asym" />}
        {s.rot > 0 && <PArrow a={[0, 0]} b={P(s.iz)} role="g" />}
        {s.showRe && <><Seg a={P(s.iz)} b={[s.iz.re, 0]} role="g" dashed /><Seg a={[0, 0]} b={[s.iz.re, 0]} role="pt" width={4} /></>}
        <PArrow a={[0, 0]} b={P(s.z)} role="f" />
        <Pt x={s.z.re} y={s.z.im} role="f" r={5.5} />
        {s.rot > 0 && <Pt x={s.iz.re} y={s.iz.im} role="g" r={5.5} />}
        <PLabel x={s.z.re} y={s.z.im} dx={10} anchor="l" tex={t`z = a + bi`} role="f" small />
        <PLabel x={0} y={s.z.im} dx={-8} anchor="r" tex="b" role="f" small />
        {s.rot >= 1 && <PLabel x={s.iz.re} y={s.iz.im} dx={10} anchor="l" tex={t`iz = ai - b`} role="g" small />}
        {s.showRe && <PLabel x={s.iz.re} y={0} dx={8} dy={-12} anchor="l" tex={t`\mathrm{Re}(iz) = -b = ${nn(s.reIz, lang)}`} role="pt" small />}
        {s.shade >= 1 && <PLabel x={-1.6} y={-2.2} tex={t`b < -1`} role="g" />}
        {s.shade >= 1 && <PLabel x={W.x[1]} y={-1} dx={-4} dy={-11} anchor="r" tex={t`b = -1`} role="g" small />}
      </Plot>
    </div>
  );
}

/* =============================================================== 11 · region explorer (showpiece) */

/** The shape of one condition's set, in viewBox coordinates (for clip paths). */
function CondShape({ c, win }: { c: Cond; win: Win }) {
  const fr = usePlot();
  if (c.kind === 'dist') {
    const cxp = fr.sx(c.c.re), cyp = fr.sy(c.c.im), rp = fr.sx(c.c.re + c.R) - cxp;
    if (c.rel === '<' || c.rel === '<=' || c.rel === '=') return <circle cx={cxp} cy={cyp} r={rp} />;
    const x0 = fr.sx(win.x[0]) - 50, x1 = fr.sx(win.x[1]) + 50, y0 = fr.sy(win.y[1]) - 50, y1 = fr.sy(win.y[0]) + 50;
    const d = `M${x0},${y0}H${x1}V${y1}H${x0}Z M${cxp + rp},${cyp} A${rp},${rp} 0 1 0 ${cxp - rp},${cyp} A${rp},${rp} 0 1 0 ${cxp + rp},${cyp}Z`;
    return <path d={d} clipRule="evenodd" fillRule="evenodd" />;
  }
  const poly = halfPlanePoly(c, win);
  return <polygon points={poly.map((p) => `${fr.sx(p[0])},${fr.sy(p[1])}`).join(' ')} />;
}
function CondBoundary({ c, win, cls, dashed }: { c: Cond; win: Win; cls: string; dashed: boolean }) {
  const fr = usePlot();
  const className = `w6-bd ${cls}${dashed ? ' dashed' : ''}`;
  if (c.kind === 'dist') return <circle className={className} cx={fr.sx(c.c.re)} cy={fr.sy(c.c.im)} r={fr.sx(c.c.re + c.R) - fr.sx(c.c.re)} />;
  const [a, b] = linePts(c, win);
  return <line className={className} x1={fr.sx(a[0])} y1={fr.sy(a[1])} x2={fr.sx(b[0])} y2={fr.sy(b[1])} />;
}
/** Shaded intersection of all conditions + boundaries (strong where they bound the set, faint elsewhere). */
function RegionLayer({ conds, win, uid }: { conds: Cond[]; win: Win; uid: string }) {
  const fr = usePlot();
  const ids = conds.map((_, i) => `${uid}-c${i}`);
  const nest = (inner: ReactNode, skip: number) => ids.reduce<ReactNode>((acc, id, i) => (i === skip ? acc : <g clipPath={`url(#${id})`}>{acc}</g>), inner);
  const full = <rect x={fr.sx(win.x[0]) - 20} y={fr.sy(win.y[1]) - 20} width={fr.sx(win.x[1]) - fr.sx(win.x[0]) + 40} height={fr.sy(win.y[0]) - fr.sy(win.y[1]) + 40} />;
  return (
    <g>
      <defs>{conds.map((c, i) => <clipPath key={i} id={ids[i]}><CondShape c={c} win={win} /></clipPath>)}</defs>
      {conds.length > 1 && conds.map((_c, i) => <g key={`s${i}`} clipPath={`url(#${ids[i]})`} className={`w6-single w6-c${i}`}>{full}</g>)}
      <g className="w6-region">{nest(full, -1)}</g>
      {conds.map((c, i) => <CondBoundary key={`f${i}`} c={c} win={win} cls={`w6-c${i} faint`} dashed={!boundaryIncluded(c)} />)}
      {conds.map((c, i) => <g key={`b${i}`}>{nest(<CondBoundary c={c} win={win} cls={`w6-c${i}`} dashed={!boundaryIncluded(c)} />, i)}</g>)}
    </g>
  );
}

const REGION_LABEL: Record<string, [ReactNode, ReactNode]> = {
  disc: ['Kreisscheibe', 'Disc'],
  half: ['Halbebene', 'Half-plane'],
  ring: ['Kreisring', 'Annulus'],
  diag: [<M key="d">{t`\mathrm{Re}\,z \geq \mathrm{Im}\,z`}</M>, <M key="e">{t`\mathrm{Re}\,z \geq \mathrm{Im}\,z`}</M>],
  both: ['Schnittmenge', 'Intersection'],
};

function condValue(c: Cond, z: C, lang: Lang): string {
  if (c.kind === 'dist') {
    const d = Math.hypot(z.re - c.c.re, z.im - c.c.im);
    const lhs = c.c.re === 0 && c.c.im === 0 ? '|z|' : `|z - (${cart(c.c, lang)})|`;
    return `${lhs} ${eqv(d, lang)}`;
  }
  if (c.value) return t`\mathrm{Re}(iz) = -b = ${nn(c.value(z), lang)}`;
  return t`\mathrm{Re}\,z = ${nn(z.re, lang)},\ \mathrm{Im}\,z = ${nn(z.im, lang)}`;
}

export function RegionExplorer() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState('disc');
  const pre = REGION_PRESETS.find((p) => p.id === id)!;
  const [z, setZ] = useState<C>(pre.test);
  const win = pre.win;
  const onDrag = useDrag({ z: P(z) }, (_k, x, y) => setZ(cx(Math.max(win.x[0] + 0.25, Math.min(win.x[1] - 0.25, Math.round(4 * x) / 4)), Math.max(win.y[0] + 0.25, Math.min(win.y[1] - 0.25, Math.round(4 * y) / 4)))));
  const oks = pre.conds.map((c) => satisfies(c, z));
  const all = oks.every(Boolean);
  const uid = `w6r-${id}`;
  return (
    <figure className="vdemo">
      <div className="v-presets">
        {REGION_PRESETS.map((p) => <button key={p.id} type="button" aria-pressed={p.id === id} onClick={() => { setId(p.id); setZ(p.test); }}>{tr(...REGION_LABEL[p.id])}</button>)}
      </div>
      <div className="vdemo-fig w6-plane">
        <Plot x={win.x} y={win.y} w={400} h={375} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Menge in der komplexen Ebene mit ziehbarem Testpunkt; Rand durchgezogen = dabei, gestrichelt = ausgeschlossen', 'Set in the complex plane with a draggable test point; solid boundary = included, dashed = excluded')}>
          <RegionLayer conds={pre.conds} win={win} uid={uid} />
          {pre.conds.map((c, i) => c.kind === 'dist' && !(c.c.re === 0 && c.c.im === 0) && <g key={i}><Pt x={c.c.re} y={c.c.im} role="f" r={3.5} /><PLabel x={c.c.re} y={c.c.im} dx={-6} dy={-10} anchor="r" tex={cart(c.c, lang)} role="f" small /></g>)}
          <Pt x={z.re} y={z.im} r={6.5} />
          <PLabel x={z.re} y={z.im} dx={10} dy={-10} anchor="l" tex="z" role="pt" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="v-result"><M>{t`z = ${cart(z, lang)}`}</M></div>
        {pre.conds.map((c, i) => (
          <div key={i} className="w6-cond">
            <span className={`w6-key w6-c${i}`} /><M>{c.tex}</M> <Mark ok={oks[i]} />
            <span className="w6-val"><M>{condValue(c, z, lang)}</M></span>
          </div>
        ))}
        <div className={`v-result ${all ? 'pos' : 'neg'}`}><M>z</M> {all ? tr('liegt in der Menge', 'lies in the set') : tr('liegt nicht in der Menge', 'does not lie in the set')} <Mark ok={all} /></div>
        <p className="vdemo-note">{tr(<>Ziehe den roten Testpunkt. Rand durchgezogen: gehört dazu (<M p=");">{t`\leq, \geq`}</M> gestrichelt: ausgeschlossen (<M p=").">{t`<, >`}</M> {pre.conds.length > 1 && <>Hell: jede Bedingung einzeln; kräftig: die gemeinsame Menge.</>}</>,
          <>Drag the red test point. Solid boundary: included (<M p=");">{t`\leq, \geq`}</M> dashed: excluded (<M p=").">{t`<, >`}</M> {pre.conds.length > 1 && <>Light: each condition alone; strong: the common set.</>}</>)}</p>
      </figcaption>
    </figure>
  );
}

/* =============================================================== 12 · |z − a| = |z − b|: the perpendicular bisector (supplement) */

export function Bisector() {
  const tr = useTr(), lang = useLang();
  const [a, setA] = useState<C>(cx(-2, 0));
  const [b, setB] = useState<C>(cx(1, 2));
  const [z, setZ] = useState<C>(cx(0.5, -0.25));
  const snap = (x: number, y: number) => cx(Math.max(-3.5, Math.min(3.5, Math.round(4 * x) / 4)), Math.max(-3, Math.min(3, Math.round(4 * y) / 4)));
  const onDrag = useDrag({ a: P(a), b: P(b), z: P(z) }, (k, x, y) => { const q = snap(x, y); if (k === 'a') setA(q); else if (k === 'b') setB(q); else setZ(q); });
  const same = Math.hypot(a.re - b.re, a.im - b.im) < 1e-9;
  const mid: P2 = [(a.re + b.re) / 2, (a.im + b.im) / 2];
  const d: P2 = [b.re - a.re, b.im - a.im], L = Math.hypot(d[0], d[1]) || 1, u: P2 = [-d[1] / L, d[0] / L];
  const da = Math.hypot(z.re - a.re, z.im - a.im), db = Math.hypot(z.re - b.re, z.im - b.im);
  const on = Math.abs(bisectorGap(z, a, b)) < 1e-9;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig w6-small">
        <Plot x={[-4, 4]} y={[-3.5, 3.5]} w={400} h={350} grid={[1, 1]} tick={[1, 1]} axes={[t`\mathrm{Re}`, t`\mathrm{Im}`]} onDrag={onDrag}
          label={tr('Alle Punkte mit gleichem Abstand zu a und b bilden die Mittelsenkrechte', 'All points at equal distance from a and b form the perpendicular bisector')}>
          {!same && <Seg a={[mid[0] - 20 * u[0], mid[1] - 20 * u[1]]} b={[mid[0] + 20 * u[0], mid[1] + 20 * u[1]]} role="asym" />}
          <Seg a={P(a)} b={P(b)} role="aux" dashed />
          <Seg a={P(z)} b={P(a)} role="f" /><Seg a={P(z)} b={P(b)} role="g" />
          <Pt x={a.re} y={a.im} role="f" r={6} /><Pt x={b.re} y={b.im} role="g" r={6} /><Pt x={z.re} y={z.im} r={6} />
          {!same && <Pt x={mid[0]} y={mid[1]} role="asym" r={3} />}
          <PLabel x={a.re} y={a.im} dx={-9} anchor="r" tex="a" role="f" small />
          <PLabel x={b.re} y={b.im} dx={9} anchor="l" tex="b" role="g" small />
          <PLabel x={z.re} y={z.im} dx={9} dy={10} anchor="l" tex="z" role="pt" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className={`v-result ${on ? 'pos' : ''}`}><M>{t`|z - a| ${eqv(da, lang)},\quad |z - b| ${eqv(db, lang)}`}</M> {on && <Mark ok />}</div>
        <p className="vdemo-note">{tr(<>Ziehe <M p=",">a</M> <M>b</M> oder <M p=".">z</M> Auf der violetten Geraden sind beide Abstände gleich: Das ist die Mittelsenkrechte der Strecke von <M>a</M> nach <M p=".">b</M></>,
          <>Drag <M p=",">a</M> <M p=",">b</M> or <M p=".">z</M> On the purple line both distances are equal: it is the perpendicular bisector of the segment from <M>a</M> to <M p=".">b</M></>)}</p>
      </figcaption>
    </figure>
  );
}
