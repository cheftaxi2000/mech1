import { useEffect, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { useInView, useReducedMotion } from '../figUtils';
import { Arrow, KLabel, t, type V } from './kfKit';

const VB: [number, number, number, number] = [0, 0, 300, 150];
const PERIOD = 2.6; // seconds of one run of the trolley

/** Seconds into the current run (0 … PERIOD), looping; frozen at the end of a run under reduced motion. */
function useRun(active: boolean, seen: boolean): number {
  const reduced = useReducedMotion();
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!active || reduced || !seen) { setS(0); return; }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => { setS(((now - t0) / 1000) % (PERIOD + 0.5)); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced, seen]);
  return reduced && active ? PERIOD * 0.8 : Math.min(s, PERIOD);
}

/**
 * Lecture p. 29: forces change the velocity (trolley) or the shape (sponge); statics asks when everything stays at rest.
 * Left: a trolley with a push from the left and one from the right; the arrow length is the strength.
 * Right: a sponge squeezed from both sides.
 */
export function K1Effects() {
  const tr = useTr(), lang = useLang();
  const [fl, setFl] = useState(6), [fr, setFr] = useState(0);
  const [sq, setSq] = useState(6);
  const net = fl - fr;
  const host = useRef<HTMLElement>(null);
  const run = useRun(net !== 0, useInView(host));
  const dir = Math.sign(net);
  const off = dir * Math.min(50, 2.4 * Math.abs(net) * run * run);
  const speed = dir * Math.min(62, 6.5 * Math.abs(net) * run);
  const S = 5.4; // px per N
  const cx = 150 + off;
  const L: V = [cx - 42, 78], R: V = [cx + 42, 56 + 0];
  const num = (x: number) => fmtNum(x, 0, lang);

  // sponge
  const w = 104 * (1 - 0.46 * (sq / 10)), h = 58 * (1 + 0.18 * (sq / 10));
  const sx0 = 150 - w / 2, sx1 = 150 + w / 2, sy0 = 96 - h / 2;
  const pores: V[] = [[0.2, 0.3], [0.55, 0.22], [0.78, 0.5], [0.35, 0.65], [0.62, 0.74], [0.15, 0.7], [0.85, 0.2], [0.45, 0.45]];

  return (
    <figure className="vdemo kf-wide" ref={host}>
      <div className="kf-pair">
        <div className="kf-panel">
          <div className="vdemo-fig">
            <svg className="kf-svg" viewBox={VB.join(' ')} aria-label={tr('Wagen, von links und rechts gedrückt', 'Trolley pushed from the left and from the right')}>
              <line x1={4} y1={122} x2={296} y2={122} className="kf-axis" />
              <rect x={cx - 42} y={52} width={84} height={44} rx={6} className="kf-body" />
              {[-26, 26].map((d) => <circle key={d} cx={cx + d} cy={106} r={9} className="kf-body" />)}
              {fl > 0 && <Arrow a={[L[0] - fl * S, 66]} b={[L[0], 66]} cls="kf-f" />}
              {fr > 0 && <Arrow a={[R[0] + fr * S, 82]} b={[R[0], 82]} cls="kf-f" />}
              {fl > 0 && <circle cx={L[0]} cy={66} r={4} className="kf-pt solid" />}
              {fr > 0 && <circle cx={R[0]} cy={82} r={4} className="kf-pt solid" />}
              {Math.abs(speed) > 1 && <Arrow a={[cx, 34]} b={[cx + speed, 34]} cls="kf-v" />}
            </svg>
            {fl > 0 && <KLabel vb={VB} x={L[0] - fl * S / 2 - 4} y={52} ink="force">{t`\v F_{\text{L}}`}</KLabel>}
            {fr > 0 && <KLabel vb={VB} x={R[0] + fr * S / 2 + 4} y={98} ink="force">{t`\v F_{\text{R}}`}</KLabel>}
            {Math.abs(speed) > 1 && <KLabel vb={VB} x={cx + speed / 2} y={20} ink="vel">{t`\v v`}</KLabel>}
          </div>
          <div className="cap kf-ctl">
            <label className="slider"><span><M>{t`\v F_{\text{L}}`}</M></span>
              <input type="range" min={0} max={10} step={1} value={fl} onChange={(e) => setFl(+e.target.value)} aria-label={tr('Stoss von links', 'Push from the left')} />
              <span className="val">{num(fl)} N</span></label>
            <label className="slider"><span><M>{t`\v F_{\text{R}}`}</M></span>
              <input type="range" min={0} max={10} step={1} value={fr} onChange={(e) => setFr(+e.target.value)} aria-label={tr('Stoss von rechts', 'Push from the right')} />
              <span className="val">{num(fr)} N</span></label>
            <p className="state" role="status">
              {net === 0
                ? (fl === 0 ? tr('Nichts drückt: der Wagen bleibt stehen.', 'Nothing pushes: the trolley stays where it is.')
                  : tr('Die beiden Stösse gleichen sich aus: der Wagen bleibt in Ruhe (Gleichgewicht).', 'The two pushes balance: the trolley stays at rest (equilibrium).'))
                : tr('Der Wagen wird schneller: seine Geschwindigkeit ändert sich.', 'The trolley speeds up: its velocity changes.')}
            </p>
          </div>
        </div>
        <div className="kf-panel">
          <div className="vdemo-fig">
            <svg className="kf-svg" viewBox={VB.join(' ')} aria-label={tr('Schwamm, von beiden Seiten gedrückt', 'Sponge squeezed from both sides')}>
              <line x1={4} y1={132} x2={296} y2={132} className="kf-axis" />
              <rect x={sx0} y={sy0} width={w} height={h} rx={10} className="kf-sponge" />
              {pores.map((p, i) => <ellipse key={i} cx={sx0 + p[0] * w} cy={sy0 + p[1] * h} rx={3 + 0.1 * w * 0.04} ry={2.6} className="kf-pore" />)}
              {sq > 0 && <Arrow a={[sx0 - sq * S, 96]} b={[sx0, 96]} cls="kf-f" />}
              {sq > 0 && <Arrow a={[sx1 + sq * S, 96]} b={[sx1, 96]} cls="kf-f" />}
              {sq > 0 && <circle cx={sx0} cy={96} r={4} className="kf-pt solid" />}
              {sq > 0 && <circle cx={sx1} cy={96} r={4} className="kf-pt solid" />}
            </svg>
            {sq > 0 && <KLabel vb={VB} x={sx0 - sq * S / 2 - 2} y={80} ink="force">{t`\v F`}</KLabel>}
            {sq > 0 && <KLabel vb={VB} x={sx1 + sq * S / 2 + 2} y={80} ink="force">{t`-\v F`}</KLabel>}
          </div>
          <div className="cap kf-ctl">
            <label className="slider"><span><M>{t`|\v F|`}</M></span>
              <input type="range" min={0} max={10} step={1} value={sq} onChange={(e) => setSq(+e.target.value)} aria-label={tr('Wie stark gedrückt wird', 'How hard it is squeezed')} />
              <span className="val">{num(sq)} N</span></label>
            <p className="state" role="status">
              {sq === 0 ? tr('Kein Druck: der Schwamm hat seine volle Grösse.', 'No pressure: the sponge has its full size.')
                : tr('Der Schwamm bleibt an seinem Platz, aber er wird kleiner: seine Gestalt ändert sich.', 'The sponge stays where it is, but it gets smaller: its shape changes.')}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
}
