import { useState } from 'react';
import { M } from '../../components/Tex';
import { useLang, useTr } from '../../i18n';
import { LINE_L, lineExact, lineQ, sliceSum, type LineKind } from '../../physics/distributed';
import { KArrow, KL, KSlider, fmtSig, type ViewBox } from './k34Common';

const t = String.raw;
const VB: ViewBox = [0, 0, 600, 330];
const X0 = 50, KX = 125, BASE = 258, KY = 1.75;            // x of the left end, px per metre, baseline of the load, px per N/m

/**
 * p. 32, Linienkraftdichte: R = ∫₀ᴸ q(x) dx. Cut the beam into n pieces: every piece carries about q(x_i)·Δx.
 * The sum of all pieces approaches R, the area under q(x), when n grows.
 */
export function LineFigure() {
  const tr = useTr(), lang = useLang();
  const [kind, setKind] = useState<LineKind>('parab');
  const [n, setN] = useState(6);
  const q = (x: number) => lineQ(kind, x);
  const R = lineExact(kind), sum = sliceSum(q, n);
  const dx = LINE_L / n;
  const fx = (x: number, d = 4) => fmtSig(x, d, lang);
  const kinds: { id: LineKind; de: string; en: string }[] = [
    { id: 'const', de: 'konstant', en: 'constant' }, { id: 'ramp', de: 'linear wachsend', en: 'growing linearly' }, { id: 'parab', de: 'quadratisch wachsend', en: 'growing quadratically' },
  ];
  const curve = Array.from({ length: 81 }, (_, i) => { const x = (LINE_L * i) / 80; return `${X0 + KX * x},${BASE - KY * q(x)}`; }).join(' ');
  const eq = kind === 'const';
  return (
    <figure className="kf">
      <div className="kf-patch-row" role="group" aria-label={tr('Verlauf der Last', 'shape of the load')}>
        {kinds.map((k) => <button key={k.id} type="button" className="kf-chip small" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>{k.id === 'parab' ? <>{tr('wächst wie ', 'grows like ')}<M>{t`x^2`}</M></> : tr(k.de, k.en)}</button>)}
      </div>
      <div className="kf-fig" style={{ maxWidth: 720 }}>
        <svg viewBox={VB.join(' ')} role="img" aria-label={tr('Balken mit Streckenlast q(x), in Stücke zerlegt', 'Beam with line load q(x), cut into pieces')}>
          {/* pieces: bars of height q(x_i) and an arrow each */}
          {Array.from({ length: n }, (_, i) => {
            const xm = (i + 0.5) * dx, h = KY * q(xm);
            const x0 = X0 + KX * i * dx;
            return (
              <g key={i}>
                <rect className="kf-press" x={x0} y={BASE - h} width={KX * dx} height={Math.max(h, 0)} />
                {n <= 14 && h > 14 && <KArrow a={[x0 + (KX * dx) / 2, BASE - h]} b={[x0 + (KX * dx) / 2, BASE - 1]} kind="out" w={2} head={8} />}
              </g>
            );
          })}
          <polyline className="ks-curve" points={curve} />
          <line className="kf-axis" x1={X0 - 14} y1={BASE} x2={X0 + KX * LINE_L + 38} y2={BASE} />
          {/* the beam on two supports */}
          <rect className="kf-body" x={X0 - 20} y={BASE + 2} width={KX * LINE_L + 40} height={14} />
          {[X0 + 6, X0 + KX * LINE_L - 6].map((x) => <polygon key={x} className="kf-body" points={`${x},${BASE + 16} ${x - 18},${BASE + 52} ${x + 18},${BASE + 52}`} />)}
          {[0, LINE_L].map((x) => <line key={x} className="kf-tick" x1={X0 + KX * x} y1={BASE + 18} x2={X0 + KX * x} y2={BASE + 30} />)}
          <KArrow a={[X0 + KX * LINE_L + 10, BASE + 30]} b={[X0 + KX * LINE_L + 50, BASE + 30]} kind="load" w={1.6} head={8} />
        </svg>
        <KL vb={VB} at={[X0, BASE + 68]} ink="muted" className="small"><M>0</M></KL>
        <KL vb={VB} at={[X0 + KX * LINE_L, BASE + 68]} ink="muted" className="small"><M>L</M></KL>
        <KL vb={VB} at={[X0 + KX * LINE_L + 58, BASE + 30]} ink="muted" className="small" anchor="l"><M>x</M></KL>
        <KL vb={VB} at={[X0 + KX * LINE_L * 0.5, BASE + 44]} ink="muted" className="small"><M>{t`\Delta x = ${fx(dx, 3)}\,\mathrm m`}</M></KL>
        <KL vb={VB} at={[X0 + 4, 26]} ink="out" anchor="l"><M>{t`\v q(x)`}</M></KL>
        <KL vb={VB} at={[X0 + 4, 48]} ink="muted" anchor="l" className="small"><M>{t`[\mathrm{N/m}]`}</M></KL>
      </div>
      <div className="kf-controls">
        <KSlider label={tr('Stücke', 'pieces')} min={1} max={40} step={1} value={n} onChange={setN} val={<M>{t`n = ${n}`}</M>} aria={tr('Anzahl Stücke n', 'number of pieces n')} />
      </div>
      <div className="kf-readout">
        <div className="kf-sums">
          <div className="v-result"><M>{t`\sum q(x_i)\,\Delta x = ${fx(sum, 5)}\,\mathrm N`}</M></div>
          <div className="v-result pos"><M>{t`R = \displaystyle\int_0^L q\,\mathrm dx = ${fx(R, 5)}\,\mathrm N`}</M></div>
        </div>
        {eq && <div className="kf-sums"><div className="v-result"><M>{t`R = q\,L = ${fx(lineQ('const', 0), 3)}\,\mathrm{N/m}\cdot ${fx(LINE_L, 2)}\,\mathrm m = ${fx(R, 4)}\,\mathrm N`}</M></div></div>}
        <p className="kf-hint">{tr('Bei konstanter Last stimmt die Summe schon mit einem Stück: Alle Stücke sind gleich hoch.', 'With a constant load the sum is already exact with one piece: all pieces are equally high.')}</p>
      </div>
    </figure>
  );
}

