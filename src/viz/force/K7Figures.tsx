import { useMemo, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, useLang, useTr } from '../../i18n';
import { moveReference, PROOF, type Force2, type P2, type Plate } from '../../physics/kraeftegruppe';
import { E, E_LIM, EH, EW, eMeter, ePx, explorerScene } from './K7ExplorerScene';
import { SceneView, svgPoint } from './K7Svg';
import { roundToSum } from './k7Draw';
import './K7.css';

const t = String.raw;
const snap = (x: number, q = 0.1) => Math.round(x / q) * q;
const clampV = (v: P2, max: number): P2 => { const n = Math.hypot(v[0], v[1]); return n > max ? [(v[0] * max) / n, (v[1] * max) / n] : v; };
const ZERO_F = (A: P2): Force2 => ({ A, F: [0, 0] });

/** Presets of the explorer: the plate of the proof (p. 35) and the special cases the lecture and the formula allow. */
export type PresetId = 'skript' | 'punkt' | 'paar' | 'schub' | 'dreh';
export const PRESETS: Record<PresetId, Plate> = {
  skript: { B: [0, 0], vB: PROOF.vB, omega: PROOF.omega, forces: [PROOF.forces[0], PROOF.forces[1], ZERO_F([-0.5, 1.2])] },
  // all forces at one point A, B = A: M_B = 0, so only R·v_B is left (p. 34: «{A | F_i}: P = R · v_A»)
  punkt: { B: [1.2, 0.6], vB: [1, 0.4], omega: 1.2, forces: [{ A: [1.2, 0.6], F: [1.5, 0.5] }, { A: [1.2, 0.6], F: [-0.5, 1.5] }, { A: [1.2, 0.6], F: [1, -1] }] },
  // two equal and opposite forces: R = 0, only M_B · ω is left, the same for every B
  paar: { B: [0.4, 0.7], vB: [0.8, 0.3], omega: 1, forces: [{ A: [1.5, 0.3], F: [0, 1.5] }, { A: [-1.5, -0.3], F: [0, -1.5] }, ZERO_F([-0.5, 1.2])] },
  // no turning: P = R · v for every B
  schub: { B: [0, 0], vB: [1.2, 0.4], omega: 0, forces: [PROOF.forces[0], PROOF.forces[1], ZERO_F([-0.5, 1.2])] },
  // v_B = 0: the body turns about B at this instant, P = M_B · ω — but only in B
  dreh: { B: [0, 0], vB: [0, 0], omega: 1, forces: [PROOF.forces[0], PROOF.forces[1], ZERO_F([-0.5, 1.2])] },
};
const PRESET_ORDER: PresetId[] = ['skript', 'punkt', 'paar', 'schub', 'dreh'];

type Handle = { id: string; at: P2; r: number; faint?: boolean };

/**
 * Lecture p. 34–35: P = R̲·v̲_B + M̲_B·ω̲ for a rigid plate with forces F̲_i at the points A_i. Drag B (the reference point), the tips and
 * tails of the forces and the tip of v̲_B; the slider sets ω. Moving B re-describes the same motion in a new place
 * (v̲_B′ = v̲_B + ω̲ × BB̲′): R̲·v̲_B and M̲_B·ω̲ change, their sum and Σ F̲_i·v̲_i do not.
 */
export function GroupPowerExplorer() {
  const tr = useTr(), lang = useLang();
  const [p, setP] = useState<Plate>(PRESETS.skript);
  const [active, setActive] = useState<PresetId | null>('skript');
  const [drag, setDrag] = useState<string | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const scene = useMemo(() => explorerScene(p, lang), [p, lang]);
  const n = scene.numbers;
  const B = ePx(p.B);

  const handles: Handle[] = [
    { id: 'B', at: B, r: 15 },
    { id: 'vB', at: [B[0] + E.KV * p.vB[0], B[1] - E.KV * p.vB[1]], r: 13 },
    ...p.forces.flatMap((f, i): Handle[] => {
      const A = ePx(f.A), tip: P2 = [A[0] + E.KF * f.F[0], A[1] - E.KF * f.F[1]], used = Math.hypot(f.F[0], f.F[1]) > 0.04;
      return used ? [{ id: `F${i}`, at: tip, r: 13 }, { id: `A${i}`, at: A, r: 11 }] : [{ id: `F${i}`, at: A, r: 12, faint: true }];
    }),
  ];

  const pick = (q: P2): string | null => {
    let best: string | null = null, bd = 1e9;
    for (const h of handles) {
      const d = Math.hypot(q[0] - h.at[0], q[1] - h.at[1]);
      if (d <= h.r + 6 && d < bd - 0.5) { best = h.id; bd = d; }
    }
    return best;
  };
  const onDown = (e: React.PointerEvent) => {
    if (!svg.current) return;
    const id = pick(svgPoint(svg.current, EW, EH, e));
    if (!id) return;
    setDrag(id);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag || !svg.current || (e.pointerType === 'mouse' && e.buttons !== 1)) return;
    const q = svgPoint(svg.current, EW, EH, e);
    const inPlate = (m: P2): P2 => [Math.max(-E_LIM.x, Math.min(E_LIM.x, snap(m[0]))), Math.max(-E_LIM.y, Math.min(E_LIM.y, snap(m[1])))];
    setActive(drag === 'B' ? active : null);
    if (drag === 'B') setP(moveReference(p, inPlate(eMeter(q))));
    else if (drag === 'vB') {
      const v = clampV([(q[0] - B[0]) / E.KV, -(q[1] - B[1]) / E.KV], E_LIM.v);
      setP({ ...p, vB: [snap(v[0]), snap(v[1])] });
    } else {
      const i = Number(drag.slice(1));
      const f = p.forces[i];
      const forces = p.forces.map((x, k): Force2 => {
        if (k !== i) return x;
        if (drag[0] === 'A') return { ...x, A: inPlate(eMeter(q)) };
        const A = ePx(f.A), F = clampV([(q[0] - A[0]) / E.KF, -(q[1] - A[1]) / E.KF], E_LIM.F);
        return { ...x, F: [snap(F[0]), snap(F[1])] };
      });
      setP({ ...p, forces });
    }
  };
  const onUp = () => setDrag(null);
  const choose = (id: PresetId) => { setP(PRESETS[id]); setActive(id); };

  const fx = (x: number) => fmtNum(x, 1, lang, true);
  const sep = lang === 'de' ? t`;\ ` : t`,\ `;
  const tup = (v: P2) => `(${fx(v[0])}${sep}${fx(v[1])})`;
  const [shownA, shownB] = roundToSum([n.translation, n.rotation], 1);
  const shownTot = roundToSum([n.total], 1)[0], shownSum = roundToSum([n.sumP], 1)[0];
  const cls = n.total > 0.04 ? 'pos' : n.total < -0.04 ? 'neg' : '';

  return (
    <figure className="vdemo k7-explorer">
      <div className="v-presets" role="group" aria-label={tr('Beispiele', 'Examples')}>
        {PRESET_ORDER.map((id) => (
          <button key={id} type="button" aria-pressed={active === id} onClick={() => choose(id)}>
            {id === 'skript' && tr('zwei Kräfte (S. 35)', 'two forces (p. 35)')}
            {id === 'punkt' && tr('ein Angriffspunkt', 'one point of application')}
            {id === 'paar' && <>{tr('gegengleich', 'equal and opposite')} <M p="">{t`\v R = \v 0`}</M></>}
            {id === 'schub' && <>{tr('nur Schieben', 'pushing only')} <M p="">{t`\omega = 0`}</M></>}
            {id === 'dreh' && <>{tr('nur Drehen um', 'turning only about')} <M p="">B</M></>}
          </button>
        ))}
      </div>
      <SceneView
        scene={scene} W={EW} H={EH} svgRef={svg} className="wide"
        label={tr('Platte mit Kräften: Bezugspunkt B, Kräfte und v_B ziehbar; Balken zeigen die Leistung auf zwei Arten', 'Plate with forces: reference point B, the forces and v_B can be dragged; bars show the power in two ways')}
        handlers={{ onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp }}
        extra={handles.map((h) => <circle key={h.id} cx={h.at[0]} cy={h.at[1]} r={h.r} className={`k7-handle${drag === h.id ? ' on' : ''}${h.faint ? ' faint' : ''}`} />)}
      />
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider"><span><M>\omega</M></span>
          <input type="range" min={-E_LIM.w} max={E_LIM.w} step={0.1} value={p.omega}
            onChange={(e) => { setP({ ...p, omega: snap(Number(e.target.value)) }); setActive(null); }} aria-label="omega" />
          <span className="val">{fmtNum(p.omega, 1, lang)}</span></label>
        <div className="v-result rt-readout">
          <M p=",">{t`\v v_B = ${tup(p.vB)}`}</M> <M p=",">{t`\omega = ${fx(p.omega)}`}</M> <M p=",">{t`\v R = ${tup(n.R as P2)}`}</M> <M>{t`M_B = ${fx(n.MB)}`}</M>
        </div>
        <div className={`v-result rt-readout ${cls}`}>
          <M>{t`\v R\cdot\v v_B = ${fx(shownA)}`}</M> <M>+</M> <M>{t`\v M_B\cdot\v\omega = ${fx(shownB)}`}</M> <M>{t`= ${fx(shownTot)}\,\text{W}`}</M>
        </div>
        <div className="v-result rt-readout">
          <M p="">{t`\sum_i \v F_i\cdot\v v_i = ${fx(shownSum)}\,\text{W}`}</M> <M p="">{t`\ \checkmark`}</M>
        </div>
      </figcaption>
    </figure>
  );
}
