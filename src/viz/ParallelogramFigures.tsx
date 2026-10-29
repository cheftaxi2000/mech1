import { useState } from 'react';
import { M } from '../components/Tex';
import { fmtNum, useLang, useTr } from '../i18n';
import { parallelogramRoutes } from '../physics/truss';
import type { P2 } from '../physics/plane';

const t = String.raw;
// the parallelogram of Fig. 3.25: A bottom left, B bottom right, C top right, D top left; AB = DC = a, BC = AD = b
const a: P2 = [2.4, 0], b: P2 = [0.8, 1.5];
const S = 62, OX = 90, OY = 222, KV = 40;
const sv = (p: P2): [number, number] => [OX + S * p[0], OY - S * p[1]];
const A: P2 = [0, 0], B: P2 = [a[0], a[1]], C: P2 = [a[0] + b[0], a[1] + b[1]], D: P2 = [b[0], b[1]];

function Arrow({ from, to, cls }: { from: [number, number]; to: [number, number]; cls: string }) {
  const dx = to[0] - from[0], dy = to[1] - from[1], l = Math.hypot(dx, dy);
  if (l < 2) return null;
  const ux = dx / l, uy = dy / l, s = Math.min(9, 0.6 * l);
  const head = `${to[0]},${to[1]} ${to[0] - s * ux + 0.45 * s * uy},${to[1] - s * uy - 0.45 * s * ux} ${to[0] - s * ux - 0.45 * s * uy},${to[1] - s * uy + 0.45 * s * ux}`;
  return <g className={cls}><line x1={from[0]} y1={from[1]} x2={to[0] - ux * 4} y2={to[1] - uy * 4} /><polygon points={head} /></g>;
}

/**
 * Fig. 3.25, the proof as a toy: A is held at rest, the four bars turn with ω₁ … ω₄. From A the velocity of C is found on two routes
 * (via B and via D). The routes agree – the loop closes – exactly when opposite bars turn alike: ω₃ = ω₁ and ω₄ = ω₂.
 */
export function ParallelogramDemo() {
  const tr = useTr(), lang = useLang();
  const [w, setW] = useState<[number, number, number, number]>([1, 0.5, 1, 0.5]);
  const r = parallelogramRoutes(a, b, w);
  const set = (i: number, v: number) => setW((o) => o.map((x, k) => (k === i ? v : x)) as [number, number, number, number]);
  const cC = sv(C);
  const tip = (v: P2): [number, number] => [cC[0] + KV * v[0], cC[1] - KV * v[1]];
  const closed = Math.hypot(...r.gap) < 1e-9;
  const names = ['AB', 'BC', 'DC', 'AD'];
  
  const bar = (p: P2, q: P2, cls: string) => <line className={cls} x1={sv(p)[0]} y1={sv(p)[1]} x2={sv(q)[0]} y2={sv(q)[1]} />;
  return (
    <figure className="vdemo pgr-fig">
      <svg viewBox="0 0 400 260" role="img" aria-label={tr('Parallelogramm mit zwei Wegen zur Geschwindigkeit von C', 'Parallelogram with two routes to the velocity of C')} className="pgr-svg">
        {bar(A, B, 'pgr-bar pgr-a')}{bar(D, C, 'pgr-bar pgr-a')}{bar(B, C, 'pgr-bar pgr-b')}{bar(A, D, 'pgr-bar pgr-b')}
        {([['A', A, [-14, 14]], ['B', B, [10, 14]], ['C', C, [10, -8]], ['D', D, [-14, -8]]] as [string, P2, [number, number]][]).map(([n, p, o]) => (
          <g key={n}><circle className="an-point" cx={sv(p)[0]} cy={sv(p)[1]} r={4.5} /><text className="pgr-name" x={sv(p)[0] + o[0]} y={sv(p)[1] + o[1]}>{n}</text></g>
        ))}
        <Arrow from={cC} to={tip(r.vC1)} cls="pgr-v1" />
        <Arrow from={cC} to={tip(r.vC2)} cls="pgr-v2" />
        {!closed && <line className="pgr-gap" x1={tip(r.vC1)[0]} y1={tip(r.vC1)[1]} x2={tip(r.vC2)[0]} y2={tip(r.vC2)[1]} />}
        <text className="pgr-key pgr-k1" x={cC[0] + 18} y={cC[1] + 40}>{tr('über B', 'via B')}</text>
        <text className="pgr-key pgr-k2" x={cC[0] + 18} y={cC[1] + 56}>{tr('über D', 'via D')}</text>
      </svg>
      <div className="pgr-sl">
        {names.map((n, i) => (
          <label key={i} className="slider">
            <span><M>{String.raw`\omega_${i + 1}`}</M></span>
            <input type="range" min={-2} max={2} step={0.5} value={w[i]} aria-label={tr(`Drehgeschwindigkeit Stab ${n}`, `Angular velocity of bar ${n}`)} onChange={(e) => set(i, Number(e.target.value))} />
            <span className="val">{fmtNum(w[i], 1, lang)}</span>
          </label>
        ))}
      </div>
      <div className="pgr-btns">
        <button type="button" className="motion-btn" onClick={() => setW([1, 0.5, 1, 0.5])}>{tr('Gegenüberliegende gleich', 'Opposite bars equal')}</button>
        <button type="button" className="motion-btn" onClick={() => setW([1, 0.5, 0.5, 1])}>{tr('Zwei Stäbe vertauscht', 'Two bars swapped')}</button>
      </div>
      <div className="bx-say" aria-live="polite">
        {closed
          ? <>{tr('Die beiden Wege treffen sich: Die Schleife schliesst. Das geht nur mit ', 'The two routes meet: the loop closes. That works only with ')}<M p=".">{t`\omega_3 = \omega_1,\ \omega_4 = \omega_2`}</M></>
          : <>{tr('Die Wege treffen sich nicht (violette Lücke). Dann kann es keine Bewegung der starren Stäbe sein: Es müsste ', 'The routes do not meet (purple gap). Then this cannot be a motion of rigid bars: it would need ')}<M p=".">{t`\omega_3 = \omega_1,\ \omega_4 = \omega_2`}</M></>}
      </div>
    </figure>
  );
}
