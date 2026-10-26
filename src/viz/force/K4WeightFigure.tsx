import { useState } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr } from '../../i18n';
import { G_EARTH, MATERIALS, boxWeight, type Material } from '../../physics/distributed';
import type { Vec3 } from '../../physics/vec';
import { OBLIQUE, project, type View } from '../anim/geometry';
import { boxFaces } from './k4Box';
import { KArrow, KL, KSlider, fmtSig, pts, type V, type ViewBox } from './k34Common';

const t = String.raw;
const VB: ViewBox = [0, 0, 520, 330];
const VIEW: View = { ...OBLIQUE, cx: 250, cy: 232, s: 50 };
const boxF = (a: number, b: number, c: number) => boxFaces(a, b, c, VIEW);

/**
 * Weight as a volume force: choose a material and the size of a box; G = ρ g V. The toggle lets the density change with the
 * height (denser at the bottom): then G = g ∭ρ dV = (mean ρ) g V.
 */
export function WeightFigure() {
  const tr = useTr(), lang = useLang();
  const [mat, setMat] = useState<Material>(MATERIALS[1]);
  const [a, setA] = useState(1), [b, setB] = useState(0.6), [c, setC] = useState(0.5);
  const [vary, setVary] = useState(false);
  const w = boxWeight(mat.rho, a, b, c, vary);
  const f = boxF(a, b, c);
  const fx = (x: number, d = 3) => fmtSig(x, d, lang);
  const op = 0.14 + 0.7 * (mat.rho / 7850);
  const tri = (v: Vec3): V => { const o = project([0, 0, 0], { ...VIEW, cx: 62, cy: 292, s: 34 }), q = project(v, { ...VIEW, cx: 62, cy: 292, s: 34 }); return [q[0] - o[0] + 62, q[1] - o[1] + 292]; };
  const kN = w.G >= 1e4;
  const gamma = mat.rho * G_EARTH;
  const bot = Math.max(...f.left.map((p) => p[1]), ...f.right.map((p) => p[1]));
  const gTip: V = [f.centre[0], Math.min(318, bot + 62)];
  return (
    <figure className="kf">
      <div className="kf-patch-row" role="group" aria-label={tr('Material', 'material')}>
        {MATERIALS.map((m) => <button key={m.id} type="button" className="kf-chip small" aria-pressed={mat.id === m.id} onClick={() => setMat(m)}>{tr(m.de, m.en)}</button>)}
      </div>
      <div className="kf-fig" style={{ maxWidth: 620 }}>
        <svg viewBox={VB.join(' ')} role="img" aria-label={tr('Ein Quader aus gewähltem Material mit seinem Gewicht G', 'A box of the chosen material with its weight G')}>
          <defs>
            <linearGradient id="k4wg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--c-rho)" stopOpacity={vary ? op * 0.62 : op} /><stop offset="1" stopColor="var(--c-rho)" stopOpacity={vary ? Math.min(0.92, op * 1.55) : op} />
            </linearGradient>
          </defs>
          <polygon points={pts(f.left)} fill="url(#k4wg)" stroke="var(--c-rho)" strokeWidth={1.8} strokeLinejoin="round" />
          <polygon points={pts(f.right)} fill="url(#k4wg)" stroke="var(--c-rho)" strokeWidth={1.8} strokeLinejoin="round" />
          <polygon points={pts(f.top)} fill="var(--c-rho)" fillOpacity={vary ? op * 0.5 : op * 0.75} stroke="var(--c-rho)" strokeWidth={1.8} strokeLinejoin="round" />
          <KArrow a={f.centre} b={gTip} kind="out" w={4} head={14} />
          <circle className="kf-dot" cx={f.centre[0]} cy={f.centre[1]} r={4} />
          {/* axes as in the lecture */}
          <KArrow a={tri([0, 0, 0])} b={tri([1, 0, 0])} kind="load" w={2} head={8} />
          <KArrow a={tri([0, 0, 0])} b={tri([0, 1, 0])} kind="load" w={2} head={8} />
          <KArrow a={tri([0, 0, 0])} b={tri([0, 0, 1])} kind="load" w={2} head={8} />
        </svg>
        <KL vb={VB} at={[gTip[0] + 16, gTip[1] - 6]} ink="out" anchor="l"><M>{t`\v G`}</M></KL>
        {([['x', [1, 0, 0]], ['y', [0, 1, 0]], ['z', [0, 0, 1]]] as const).map(([k, v]) => {
          const q = tri(v as unknown as Vec3), o = tri([0, 0, 0]);
          return <KL key={k} vb={VB} at={[q[0] + 0.5 * (q[0] - o[0]) + (k === 'z' ? 0 : 6), q[1] + 0.5 * (q[1] - o[1])]} ink={k} className="small"><M>{`\\e ${k}`}</M></KL>;
        })}
        <KL vb={VB} at={[f.left[1][0] + 4, f.left[1][1] + 16]} ink="muted" className="small" anchor="l"><M>a</M></KL>
        <KL vb={VB} at={[f.right[1][0] + 12, (f.right[1][1] + f.right[0][1]) / 2]} ink="muted" className="small" anchor="l"><M>b</M></KL>
        <KL vb={VB} at={[f.left[0][0] - 12, (f.left[0][1] + f.left[3][1]) / 2]} ink="muted" className="small" anchor="r"><M>c</M></KL>
      </div>
      <div className="kf-controls">
        <KSlider label={<M>a</M>} min={0.1} max={2} step={0.1} value={a} onChange={setA} val={<M>{`${fx(a, 2)}\\,\\mathrm m`}</M>} aria="a" />
        <KSlider label={<M>b</M>} min={0.1} max={2} step={0.1} value={b} onChange={setB} val={<M>{`${fx(b, 2)}\\,\\mathrm m`}</M>} aria="b" />
        <KSlider label={<M>c</M>} min={0.1} max={2} step={0.1} value={c} onChange={setC} val={<M>{`${fx(c, 2)}\\,\\mathrm m`}</M>} aria="c" />
        <label className="toggle"><input type="checkbox" checked={vary} onChange={(e) => setVary(e.target.checked)} />{' '}{tr('Dichte nimmt nach oben ab (unten dichter)', 'density decreases upwards (denser at the bottom)')}</label>
      </div>
      <div className="kf-readout">
        <div className="kf-sums">
          <div className="v-result"><M>{t`V = a\,b\,c = ${fx(w.V, 3)}\,\mathrm{m^3} = ${fx(w.V * 1000, 3)}\,\mathrm L`}</M></div>
          {!vary && <div className="v-result"><M>{t`\rho\,g = ${fx(mat.rho, 4)}\cdot ${fx(G_EARTH, 3)} = ${fx(gamma / 1000, 3)}\,\mathrm{kN/m^3}`}</M></div>}
          {vary && <div className="v-result"><M>{t`\bar\rho = \dfrac{\iiint \rho\,\mathrm dV}{V} = ${fx(w.rhoMean, 4)}\,\mathrm{kg/m^3}`}</M></div>}
        </div>
        <div className="kf-sums">
          <div className="v-result pos">
            <M>{vary ? t`G = g\iiint\rho\,\mathrm dV = \bar\rho\,g\,V = ${fx(kN ? w.G / 1000 : w.G, 4)}\,\mathrm{${kN ? 'kN' : 'N'}}` : t`G = \rho\,g\,V = ${fx(kN ? w.G / 1000 : w.G, 4)}\,\mathrm{${kN ? 'kN' : 'N'}}`}</M>
          </div>
        </div>
        <p className="kf-hint">{tr(`Das ist die Gewichtskraft von ${fmtPlain(w.M, lang)} Litern Wasser (ein Liter Wasser wiegt 9,81 N). Der Pfeil ist nicht massstäblich.`, `That is the weight of ${fmtPlain(w.M, lang)} litres of water (one litre of water weighs 9.81 N). The arrow is not to scale.`)}</p>
      </div>
    </figure>
  );
}

const fmtPlain = (x: number, lang: 'de' | 'en') => {
  const s = x >= 100 ? Math.round(x).toString() : x >= 10 ? x.toFixed(0) : x.toFixed(1);
  const g = s.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'de' ? ' ' : ',');
  return lang === 'de' ? g.replace('.', ',') : g;
};
